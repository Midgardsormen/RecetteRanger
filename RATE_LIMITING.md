# Rate Limiting - Protection Anti-Brute Force

## Configuration actuelle

### Throttler global

**Limite par défaut :** 60 requêtes par minute par IP sur toutes les routes

Configuration dans `app.module.ts` :
```typescript
ThrottlerModule.forRoot([
  {
    name: 'default',
    ttl: 60000, // 60 secondes
    limit: 60,  // 60 requêtes max
  },
])
```

### Limites spécifiques sur l'authentification

#### `/auth/login` - Protection contre le brute-force de mots de passe

**Limite : 5 tentatives par minute par IP**

```typescript
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('login')
async login(@Body() loginDto: LoginDto) {
  // ...
}
```

**Scénario de protection :**
- Un attaquant essaie de deviner le mot de passe d'un utilisateur
- Après 5 tentatives en 1 minute → **Status 429** (Too Many Requests)
- L'attaquant doit attendre 1 minute avant de réessayer
- Protection efficace contre les attaques par dictionnaire

#### `/auth/register` - Protection contre la création de comptes en masse

**Limite : 3 inscriptions par heure par IP**

```typescript
@Throttle({ default: { limit: 3, ttl: 3600000 } })
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  // ...
}
```

**Scénario de protection :**
- Un spam bot essaie de créer des centaines de comptes
- Après 3 créations en 1 heure → **Status 429**
- Le bot doit attendre 1 heure avant de créer plus de comptes
- Protection contre le spam et les abus

## ⚠️ CRITIQUE : Trust Proxy

### Pourquoi c'est indispensable en production

Dans `main.ts`, le trust proxy est activé **uniquement en production** :

```typescript
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
```

### Le problème sans trust proxy

Sur **Render, Heroku, Vercel** ou tout autre hébergeur avec reverse proxy :

```
Internet → Reverse Proxy (Render) → Votre app NestJS
          IP: 10.0.0.1          IP: 127.0.0.1
```

**Sans `trust proxy` :**
- Tous les utilisateurs ont la même IP : `10.0.0.1` (IP du proxy Render)
- Le rate limiter compte **toutes les requêtes ensemble**
- Après 5 requêtes `/auth/login` **au total** → Plus personne ne peut se connecter ! ❌

**Avec `trust proxy` :**
- NestJS lit le header `X-Forwarded-For` du proxy
- Chaque utilisateur a sa vraie IP : `1.2.3.4`, `5.6.7.8`, etc.
- Le rate limiter compte les requêtes **par utilisateur** ✅

### Comment ça fonctionne

1. Un utilisateur depuis `1.2.3.4` envoie une requête
2. Le proxy Render ajoute le header :
   ```
   X-Forwarded-For: 1.2.3.4
   ```
3. Avec `trust proxy: 1`, Express lit ce header
4. Le throttler voit l'IP `1.2.3.4` au lieu de `10.0.0.1`

### Sécurité du trust proxy

La valeur `1` signifie : "Faire confiance au **premier** proxy devant l'app"

```typescript
app.set('trust proxy', 1);  // ✅ Fait confiance au proxy Render
```

**Ne JAMAIS utiliser :**
```typescript
app.set('trust proxy', true);  // ❌ Fait confiance à tous les proxies (dangereux)
```

Un attaquant pourrait forger le header `X-Forwarded-For` pour contourner le rate limiting.

## Réponses HTTP

### Requête normale
```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "wrong"
}
```

**Réponse :**
```http
HTTP/1.1 401 Unauthorized
```

### Trop de tentatives
```http
POST /auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "wrong"
}
```

**Réponse (après 5 tentatives) :**
```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1234567890

{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Tester en local

### Simuler le rate limiting

```bash
# Tentative 1-5 : OK (401 ou 200)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test","password":"wrong"}'

# Tentative 6 : Rate limited (429)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test","password":"wrong"}'
```

### Tester avec des IPs différentes

En local, vous pouvez forger le header `X-Forwarded-For` :

```bash
# IP 1.1.1.1 (5 tentatives)
curl -X POST http://localhost:3000/auth/login \
  -H "X-Forwarded-For: 1.1.1.1" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test","password":"wrong"}'

# IP 2.2.2.2 (5 tentatives indépendantes)
curl -X POST http://localhost:3000/auth/login \
  -H "X-Forwarded-For: 2.2.2.2" \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test","password":"wrong"}'
```

**Note :** En local (`NODE_ENV !== 'production'`), le trust proxy n'est **pas activé**.
Le header `X-Forwarded-For` ne sera donc **pas lu**.

## Ajuster les limites

### Trop restrictif ?

Si vos utilisateurs légitimes sont bloqués :

```typescript
// Plus permissif
@Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 tentatives/min
```

### Pas assez restrictif ?

Si vous subissez des attaques :

```typescript
// Plus strict
@Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 tentatives/5min
```

## Monitoring

### Headers de réponse

Le throttler ajoute automatiquement des headers :

```http
X-RateLimit-Limit: 5         # Limite max
X-RateLimit-Remaining: 3     # Tentatives restantes
X-RateLimit-Reset: 1234567890 # Timestamp de reset
```

### Logs

Quand un utilisateur est rate-limité, NestJS logge :

```
ThrottlerException: Too Many Requests
```

Vous pouvez ajouter un custom interceptor pour logger les IP bloquées.

## Production Checklist

- [x] `@nestjs/throttler` installé
- [x] ThrottlerModule configuré dans AppModule
- [x] ThrottlerGuard activé globalement
- [x] Limites spécifiques sur `/auth/login` et `/auth/register`
- [x] **Trust proxy activé en production** (`app.set('trust proxy', 1)`)
- [x] Documentation Swagger mise à jour (status 429)

## Routes exemptées (SkipThrottle)

Certaines routes publiques **ne devraient pas** être rate-limitées :

### Pages SSR publiques

```typescript
@Controller()
@SkipThrottle() // Toutes les routes de ce controller
export class AppController {
  @Get('login')
  @Get('register')
  @Get('privacy-policy')
  @Get('legal-notice')
}
```

**Pourquoi ?**
- Pages publiques accessibles à tous
- Le SSR peut faire plusieurs appels internes
- Pas de risque de sécurité (pas d'action sensible)

### Exemples d'autres routes à skip

```typescript
// Health check (monitoring)
@SkipThrottle()
@Get('health')
healthCheck() { return { status: 'ok' }; }

// Assets statiques (gérés par Nest)
@SkipThrottle()
@Get('assets/*')

// Webhooks externes (ont leur propre auth)
@SkipThrottle()
@Post('webhooks/stripe')
```

## Scaling multi-instances

### Render Free Tier (1 instance) ✅

Le storage en mémoire fonctionne parfaitement :

```typescript
ThrottlerModule.forRoot([
  {
    name: 'default',
    ttl: minutes(1),
    limit: 60,
    // Storage: mémoire par défaut ✅
  },
])
```

### Render avec auto-scaling (>1 instance) ⚠️

**Problème :** Chaque instance a ses propres compteurs en mémoire.

```
Instance 1 : User fait 60 requêtes → OK (compteur: 60/60)
Instance 2 : Same user fait 60 requêtes → OK (compteur: 60/60)
Total: 120 requêtes alors que la limite est 60 ❌
```

**Solution : Redis storage**

```bash
npm install @nestjs/throttler-storage-redis ioredis
```

```typescript
import { ThrottlerStorageRedisService } from '@nestjs/throttler-storage-redis';
import Redis from 'ioredis';

ThrottlerModule.forRoot({
  throttlers: [
    {
      name: 'default',
      ttl: minutes(1),
      limit: 60,
    },
  ],
  storage: new ThrottlerStorageRedisService(
    new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    })
  ),
})
```

**Avantages Redis :**
- ✅ Compteurs partagés entre toutes les instances
- ✅ Limite effective même avec 10+ instances
- ✅ Persiste entre les redémarrages

**Quand migrer vers Redis ?**
- Vous passez à un plan payant avec auto-scaling
- Vous voyez des utilisateurs dépasser les limites
- Vous avez >1 instance en production

**Note :** Sur Render Free Tier (1 instance), **ne faites rien** - la config actuelle est optimale.

## Lisibilité du code

### Avant (millisecondes brutes)

```typescript
ttl: 60000,     // 🤔 60 secondes ? 1 minute ?
ttl: 3600000,   // 🤔 3600 secondes ? 1 heure ?
```

### Après (helpers)

```typescript
import { minutes, hours, seconds } from '@nestjs/throttler';

ttl: seconds(30),  // ✅ Clair
ttl: minutes(5),   // ✅ Lisible
ttl: hours(1),     // ✅ Évident
```

**Helpers disponibles :**
- `milliseconds(n)` - n millisecondes
- `seconds(n)` - n secondes
- `minutes(n)` - n minutes
- `hours(n)` - n heures
- `days(n)` - n jours

## Ressources

- [Documentation NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [Express Trust Proxy](https://expressjs.com/en/guide/behind-proxies.html)
- [Throttler Storage Redis](https://www.npmjs.com/package/@nestjs/throttler-storage-redis)
