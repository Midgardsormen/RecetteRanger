# Logger Utility

Helper centralisé pour logger les erreurs de manière sécurisée et type-safe.

## Motivation

**Problèmes résolus :**
1. **Sécurité** : Évite d'exposer des secrets en production (tokens dans `error.config`, stack traces sensibles)
2. **Type safety** : Compatible avec `useUnknownInCatchVariables: true` en TypeScript
3. **DRY** : Évite de dupliquer la logique de logging dans tous les catch
4. **Maintenabilité** : Changement centralisé de la stratégie de log
5. **Compatibilité NestJS** : Préserve les `HttpException` pour les status codes corrects (400, 404, etc.)

## API

### `toError(error: unknown): Error`

Normalise une erreur inconnue en instance d'Error.

```typescript
try {
  // ...
} catch (error) {
  const err = toError(error); // Toujours une instance d'Error
  console.error(err.message);
}
```

### `logError(context: string, error: unknown): void`

Logge une erreur avec le contexte approprié selon l'environnement :
- **Dev** : Stack trace complète
- **Prod** : Message uniquement

```typescript
try {
  await someOperation();
} catch (error) {
  logError('Failed to perform operation', error);
  // Continue execution...
}
```

**Usage typique :** Opérations "best-effort" où l'échec n'est pas critique.

### `logAndThrow(context: string, error: unknown): never`

Logge une erreur ET la relance **EN PRÉSERVANT son type original**.

**IMPORTANT** : Cette fonction préserve les `HttpException` de NestJS pour que les status codes corrects soient renvoyés au client (400, 404, 409, etc.)

```typescript
try {
  const result = await criticalOperation();
  return result;
} catch (error) {
  logAndThrow('Critical operation failed', error);
  // Ne sera jamais atteint (never)
}
```

**Comportement :**
1. Logge l'erreur avec le contexte
2. Si `HttpException` → throw l'original (préserve status code + payload)
3. Si `Error` → throw l'original (préserve stack trace)
4. Sinon → throw une `Error` normalisée

**Usage typique :** Opérations critiques dans les **services** (pas les controllers).

## Exemples d'utilisation

### Opération critique dans un service (avec rethrow)

```typescript
import { logAndThrow } from '../../shared/utils/logger.util';
import { ConflictException } from '@nestjs/common';

// ✅ DANS LE SERVICE
async create(dto: CreateRecipeDto) {
  try {
    return await this.prisma.recipe.create({ data: dto });
  } catch (error) {
    // Si Prisma lance une erreur de contrainte unique
    if (error.code === 'P2002') {
      throw new ConflictException('Une recette avec ce nom existe déjà');
    }
    logAndThrow('Error creating recipe', error);
  }
}

// ✅ DANS LE CONTROLLER - Pas de catch nécessaire !
async create(@Body() dto: CreateRecipeDto) {
  // Le service gère déjà les erreurs
  return this.recipeService.create(dto);
}
```

**Pourquoi préserver les HttpException ?**
- `ConflictException` → Status 409 ✅
- `NotFoundException` → Status 404 ✅
- `BadRequestException` → Status 400 ✅

Sans préservation, tout deviendrait un 500 Internal Server Error ❌
```

### Opération best-effort (sans rethrow)

```typescript
import { logError } from '../../shared/utils/logger.util';

async deleteImage(publicId: string): Promise<void> {
  try {
    await this.cloudinary.delete(publicId);
  } catch (error) {
    // Log mais ne rethrow pas : la suppression est non-critique
    logError('Failed to delete image from Cloudinary', error);
  }
}
```

### Fallback avec gestion d'erreur

```typescript
import { logError } from '../../shared/utils/logger.util';

private loadConfig(): void {
  try {
    const data = readFileSync('config.json', 'utf-8');
    this.config = JSON.parse(data);
  } catch (error) {
    logError('Failed to load config', error);
    // Fallback to default config
    this.config = DEFAULT_CONFIG;
  }
}
```

## Comportement selon l'environnement

### En développement (`NODE_ENV !== 'production'`)

```
Error creating recipe: Error: Unique constraint violation
    at PrismaClient.handleRequestError (/app/node_modules/@prisma/client/runtime/index.js:29:13)
    at PrismaClient.request (/app/node_modules/@prisma/client/runtime/index.js:126:18)
    at async RecipeService.create (/app/src/back/api/recipe/recipe.service.ts:15:12)
    ...
```

Stack trace complète pour faciliter le debug.

### En production (`NODE_ENV === 'production'`)

```
Error creating recipe: Unique constraint violation
```

Message uniquement, sans exposer :
- Chemins de fichiers système
- Configurations internes
- Tokens/secrets dans `error.config`
- Stack trace sensible

## Migration depuis console.error

### Avant ❌

```typescript
catch (error) {
  console.error('Error:', error.message); // Perd la stack en dev
  throw error;
}
```

### Après ✅

```typescript
import { logAndThrow } from '../../shared/utils/logger.util';

catch (error) {
  logAndThrow('Error', error); // Stack en dev, safe en prod
}
```

## Tests

Pour tester le comportement en production localement :

```bash
NODE_ENV=production npm run start:dev
```

Les erreurs seront loggées avec le message uniquement.
