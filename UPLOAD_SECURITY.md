# Sécurité des Uploads - RecetteRanger

## Configuration Actuelle

### ✅ Validations en place

#### 1. Validation Multi-couches (Defense-in-depth)

**Couche 1 : Multer (upload.module.ts)**
- Limite de taille : **10MB max par fichier**
- Nombre de fichiers : **1 par requête**
- Nombre de champs : **10 max**
- Nombre de parties multipart : **20 max**
- ⚠️ **Version Multer >= 2.0.0** (patch CVE DoS)
- ✅ Pas de `fileFilter` (validation faite via ParseFilePipe pour des 400 propres)

**Couche 2 : Controller avec ParseFilePipe (upload.controller.ts)**
- Validation de taille : `MaxFileSizeValidator` (10MB)
- Validation MIME type : `FileTypeValidator` avec regex stricte `/^image\/(jpeg|png|webp)$/`
- `fileIsRequired: true` pour rejeter les requêtes sans fichier
- ✅ Génère des **BadRequestException (400)** au lieu de 500

**Couche 3 : Service (upload.service.ts)**
- **Validation des magic bytes** (détection du vrai type de fichier) :
  - JPEG : `FF D8 FF`
  - PNG : `89 50 4E 47 0D 0A 1A 0A`
  - WebP : `RIFF` (0-3) + `WEBP` (8-11) ✅ **Détection complète RIFF + WEBP**
- Vérification de cohérence entre mimetype déclaré et magic bytes détectés
- Défense en profondeur contre le spoofing

**Couche 4 : Cloudinary**
- Validation supplémentaire côté Cloudinary
- Stockage sécurisé sur CDN
- Transformations automatiques (optimisation, redimensionnement)

#### 2. Types de fichiers autorisés

✅ **Images uniquement** :
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)

❌ **Tout autre type est rejeté** :
- GIF (animations non supportées)
- SVG (risque XSS)
- BMP, TIFF, etc.
- Fichiers exécutables déguisés

#### 3. Limites de taille

- **Maximum par fichier** : 10MB
- **Recommandation utilisateur** : < 5MB pour des performances optimales
- Rejet automatique si dépassement

#### 4. Protection contre le spoofing

✅ **Validation des magic bytes** :
- JPEG : `FF D8 FF`
- PNG : `89 50 4E 47 0D 0A 1A 0A`
- WebP : `52 49 46 46 xx xx xx xx 57 45 42 50`

Si un fichier `.exe` est renommé en `.jpg`, il sera **rejeté** car les magic bytes ne correspondent pas.

#### 5. Protection CSRF

✅ **Token CSRF obligatoire** pour tous les uploads
- Header `X-CSRF-Token` requis dans la requête
- Token récupéré depuis `/auth/csrf-token`
- Validation côté serveur via middleware CSRF
- **Frontend** : `apiService.uploadFormData()` ajoute automatiquement le header

#### 6. Authentification requise

✅ Tous les endpoints d'upload sont protégés par `@UseGuards(JwtAuthGuard)`
- Seuls les utilisateurs authentifiés peuvent uploader
- Rate limiting appliqué (5 requêtes/min par IP)

## Architecture de sécurité

```
Client Upload (FormData avec X-CSRF-Token)
    ↓
[Rate Limiting] → Bloque si > 5 req/min
    ↓
[CSRF Middleware] → Vérifie X-CSRF-Token
    ↓
[JWT Auth Guard] → Vérifie authentification
    ↓
[Multer Interceptor] → Limites volumétriques (10MB, 1 fichier, etc.)
    ↓
[ParseFilePipe] → Validation 1 (taille + mimetype strict) → 400 si échec
    ↓
[Upload Service] → Validation 2 (magic bytes + cohérence) → 400 si échec
    ↓
[Cloudinary] → Validation 3 + Stockage sécurisé
    ↓
URLs avec transformations retournées
```

## Points de sécurité couverts

### ✅ Implémenté

1. **Multer >= 2.0.0** : Patch CVE DoS ✅
2. **ParseFilePipe** : Validation 400 propres (au lieu de 500) ✅
3. **Types de fichiers autorisés** : Images uniquement (JPEG, PNG, WebP)
4. **Validation mimetype stricte** : Regex `/^image\/(jpeg|png|webp)$/` (pas `image/*`)
5. **Taille max** : 10MB (ParseFilePipe + Service)
6. **Nombre max** : 1 fichier par requête (Multer limits)
7. **Refus des non-images** : Magic bytes validation (WebP corrigé)
8. **Defense-in-depth** : 4 couches de validation
9. **Protection CSRF** : Token obligatoire pour uploads ✅
10. **Authentification** : JWT requis
11. **Rate limiting** : 5 req/min
12. **Stockage sécurisé** : Cloudinary CDN
13. **Optimisation automatique** : Transformations Cloudinary

### 🔶 Recommandations futures (si ouverture publique)

#### 1. Scan antivirus

Si l'application devient publique avec uploads ouverts :

```bash
npm install clamav.js
```

```typescript
// upload.service.ts
import * as clamav from 'clamav.js';

async scanFile(buffer: Buffer): Promise<boolean> {
  try {
    const scanner = await clamav.createScanner();
    const result = await scanner.scanBuffer(buffer);
    return result.isClean;
  } catch (error) {
    logError('Scan antivirus échoué', error);
    // En cas d'erreur du scanner, rejeter l'upload par sécurité
    return false;
  }
}
```

**Coût** : ClamAV est gratuit mais nécessite un daemon ClamAV installé sur le serveur.

#### 2. Analyse d'image avec Sharp

Validation supplémentaire que l'image est bien parsable :

```bash
npm install sharp
```

```typescript
import sharp from 'sharp';

async validateImageContent(buffer: Buffer): Promise<void> {
  try {
    const metadata = await sharp(buffer).metadata();

    // Vérifier que les dimensions sont raisonnables
    if (metadata.width > 10000 || metadata.height > 10000) {
      throw new BadRequestException('Dimensions d\'image trop grandes');
    }

    // Vérifier le format
    if (!['jpeg', 'png', 'webp'].includes(metadata.format)) {
      throw new BadRequestException('Format d\'image invalide');
    }
  } catch (error) {
    throw new BadRequestException('Image invalide ou corrompue');
  }
}
```

**Avantage** : Détecte les images corrompues ou malformées qui pourraient causer des problèmes.

#### 3. Content Moderation API

Pour détecter le contenu inapproprié (nudité, violence, etc.) :

```typescript
// Cloudinary a une API de modération intégrée
const result = await this.cloudinaryService.uploadImage(file, folder, {
  moderation: 'aws_rek', // Amazon Rekognition
  // ou 'webpurify', 'google_video_intelligence', etc.
});

if (result.moderation && result.moderation[0].status === 'rejected') {
  await this.cloudinaryService.deleteImage(result.publicId);
  throw new BadRequestException('Image rejetée par la modération de contenu');
}
```

**Coût** : Variable selon le provider (AWS Rekognition, etc.)

#### 4. Logging et monitoring

Ajouter du logging détaillé des uploads :

```typescript
async processIngredientImage(file: any, userId: string) {
  logInfo('Upload démarré', {
    userId,
    filename: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    ip: req.ip,
  });

  // ... traitement ...

  logInfo('Upload réussi', {
    userId,
    publicId: result.publicId,
    url: result.url,
  });
}
```

#### 5. Quotas par utilisateur

Limiter le nombre d'uploads par utilisateur :

```typescript
// Dans le service ou un middleware
async checkUserUploadQuota(userId: string): Promise<void> {
  const count = await this.prisma.ingredient.count({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
  });

  if (count >= 50) { // 50 uploads/jour max
    throw new BadRequestException('Quota d\'upload quotidien dépassé');
  }
}
```

## Tests de sécurité

### Test 1 : Fichier exécutable renommé

```bash
# Créer un faux .exe et le renommer en .jpg
echo "fake exe" > malicious.exe
mv malicious.exe malicious.jpg

# Tenter l'upload
curl -X POST http://localhost:3000/api/upload/ingredient-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@malicious.jpg"

# Résultat attendu : 400 Bad Request "Fichier invalide ou corrompu"
```

### Test 2 : Fichier trop volumineux

```bash
# Créer un fichier de 11MB
dd if=/dev/zero of=large.jpg bs=1M count=11

# Tenter l'upload
curl -X POST http://localhost:3000/api/upload/ingredient-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@large.jpg"

# Résultat attendu : 400 Bad Request "Fichier trop volumineux"
```

### Test 3 : Type MIME invalide

```bash
# Tenter d'uploader un SVG
curl -X POST http://localhost:3000/api/upload/ingredient-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@image.svg"

# Résultat attendu : 400 Bad Request "Type de fichier non autorisé"
```

### Test 4 : Upload sans authentification

```bash
curl -X POST http://localhost:3000/api/upload/ingredient-image \
  -F "image=@valid.jpg"

# Résultat attendu : 401 Unauthorized
```

## Checklist de déploiement

Avant le déploiement en production :

- [x] Validation des types MIME (Multer + Service)
- [x] Validation de la taille (10MB max)
- [x] Validation des magic bytes
- [x] Authentification JWT requise
- [x] Rate limiting activé (5 req/min)
- [x] Variables Cloudinary configurées en production
- [ ] Tests de sécurité exécutés et validés
- [ ] Monitoring des uploads en place
- [ ] Documentation utilisateur créée
- [ ] (Optionnel) Scan antivirus si publique
- [ ] (Optionnel) Content moderation si publique
- [ ] (Optionnel) Quotas utilisateur si publique

## Ressources

- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Cloudinary Security](https://cloudinary.com/documentation/security)
- [Multer Security Best Practices](https://github.com/expressjs/multer#security-considerations)
- [File Type Validation with Magic Bytes](https://en.wikipedia.org/wiki/List_of_file_signatures)
