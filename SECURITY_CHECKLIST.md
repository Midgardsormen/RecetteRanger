# Security Checklist - RecetteRanger

## ✅ Secrets & Configuration
- [x] Aucun secret commité dans Git
- [x] `.env` dans `.gitignore`
- [x] `.env.example` avec valeurs d'exemple (sans secrets réels)
- [x] JWT_SECRET obligatoire (pas de fallback non sécurisé)
- [x] CORS configuré pour production via `ALLOWED_ORIGINS`
- [x] PORT configurable via variable d'environnement
- [x] NODE_ENV utilisé pour HTTPS sur les cookies

## ✅ Auth & Sécurité API
- [x] Mots de passe hashés avec bcrypt (coût: 10 rounds)
- [x] Hashing à tous les points d'entrée (inscription, update, changement MDP)
- [x] passwordHash jamais exposé dans les DTOs de sortie
- [x] ValidationPipe global activé
- [x] Prisma uniquement (pas de raw SQL)
- [x] Logs sensibles nettoyés (error.message au lieu de error complet)
- [x] Pas de middleware qui logge body/headers

## ✅ Protection CSRF (Double Submit Cookie)

**Configuration actuelle :**
- [x] Package `csrf-csrf` v4 installé et configuré
- [x] Middleware CSRF appliqué globalement sur toutes les routes
- [x] Token CSRF généré via endpoint `/auth/csrf-token`
- [x] Frontend récupère et envoie automatiquement le token dans header `X-CSRF-Token`
- [x] Méthodes GET/HEAD/OPTIONS exemptées automatiquement
- [x] Cookie différent en dev/prod (`psifi.x-csrf-token` dev, `__Host-psifi.x-csrf-token` prod)
- [x] Session identifier lié au JWT cookie (pas à l'IP)

**Pourquoi CSRF est nécessaire malgré `sameSite: lax` ?**

`sameSite: lax` est une **défense en profondeur**, pas une protection complète :
- ⚠️ Implémentation navigateur incohérente (Chrome vs Firefox/Safari)
- ⚠️ Contournements possibles (method override, navigation top-level POST)
- ⚠️ Bugs navigateur historiques
- ⚠️ Subdomains cookies

**Standard OWASP recommandé : Token CSRF + sameSite = défense en profondeur**

**Fonctionnement (Double Submit Cookie Pattern) :**
1. **Génération** : Le serveur génère un token et le stocke dans un cookie CSRF
   - **Production** : `__Host-psifi.x-csrf-token` (préfixe `__Host-` exige HTTPS + Secure + Path=/)
   - **Development** : `psifi.x-csrf-token` (sans préfixe car HTTP local)
2. **Transmission** : Le client récupère le token via `/auth/csrf-token`
3. **Validation** : Le client envoie le token dans le header `X-CSRF-Token` pour toutes requêtes mutantes (POST/PUT/DELETE/PATCH)
4. **Vérification** : Le middleware compare le token du cookie avec celui du header
5. **Session binding** : Le token est lié à la session utilisateur (JWT cookie `access_token`)

**Avantages du Double Submit Cookie :**
- ✅ Stateless (pas de stockage serveur)
- ✅ Scalable (compatible load balancing)
- ✅ Moderne (recommandé OWASP)
- ✅ Compatible avec JWT en cookies
- ✅ Session-bound (token invalide si JWT change au login/logout)

**Configuration du secret CSRF (OBLIGATOIRE) :**
```bash
# .env - OBLIGATOIRE en dev et prod
CSRF_SECRET="[GÉNÉRER 32+ CARACTÈRES ALÉATOIRES]"
```

⚠️ **Le serveur ne démarrera pas sans `CSRF_SECRET`** (pas de fallback pour éviter les secrets faibles).

⚠️ **CSRF_SECRET doit être différent de JWT_SECRET** (secret dédié requis).

**Générer un CSRF_SECRET sécurisé :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Pourquoi le token est lié au JWT cookie ?**

Utiliser `req.ip` comme session identifier pose problème :
- IP changeante (mobile 4G/Wi-Fi) → tokens invalides → UX dégradée
- NAT partagé (même IP pour plusieurs users) → moins sécurisé

Utiliser le JWT cookie `access_token` :
- ✅ Token CSRF invalide si l'utilisateur se déconnecte/reconnecte
- ✅ Pas de problème d'IP changeante
- ✅ Chaque session a son propre token CSRF
- ✅ Utilisateurs anonymes : fallback sur `req.ip` puis `'anon'`

## ✅ Rate Limiting Anti-Brute Force

### Configuration actuelle

**Rate limiting global :**
- 60 requêtes par minute par IP sur toutes les routes
- Actif via `ThrottlerGuard` global

**Limites spécifiques sur l'authentification :**
- `/auth/login` : **5 tentatives par minute par IP**
- `/auth/register` : **3 inscriptions par heure par IP**

### ⚠️ CRITIQUE : Trust Proxy configuré

Dans `main.ts`, le trust proxy est activé en production :

```typescript
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}
```

**Pourquoi c'est critique :**
Sans `trust proxy`, sur Render/Heroku/etc., **tous les utilisateurs ont la même IP** (celle du proxy).
Le rate limiter bloquerait alors **TOUS les utilisateurs ensemble** après 5 tentatives globales !

Avec `trust proxy`, chaque utilisateur a sa propre IP → rate limiting individuel ✅

## ✅ Headers de sécurité (Helmet)

**Configuration actuelle :**
- [x] Helmet installé et configuré dans `main.ts`
- [x] CSP (Content Security Policy) adaptée à l'application
- [x] `upgradeInsecureRequests` activé uniquement en production
- [x] `crossOriginEmbedderPolicy` désactivé pour Cloudinary
- [x] Directives de sécurité : `baseUri`, `frameAncestors`

**Ressources externes autorisées :**
- Google Fonts : `fonts.googleapis.com`, `fonts.gstatic.com`
- Cloudinary : `res.cloudinary.com` (images)
- CropperJS CDN : `cdnjs.cloudflare.com`
- SVG inline : `data:` (Select.svelte)
- Blob URLs : previews d'upload

### ⚠️ Points de surveillance au déploiement

**1. Erreurs CSP en dev (Vite/Svelte HMR)**
Si vous voyez des erreurs CSP liées à Vite HMR ou source maps en développement :
- Vous pouvez temporairement ajouter `'unsafe-eval'` à `scriptSrc` en dev uniquement
- **NE JAMAIS ajouter `'unsafe-eval'` en production**
- Si ça ne casse rien, ignorez ces warnings

**2. Vérification des headers en production (30 secondes)**
Après déploiement, vérifiez avec :
```bash
curl -I https://votre-domaine.com
```

**Vous DEVEZ voir :**
- ✅ `Content-Security-Policy: ...upgrade-insecure-requests...`
- ✅ `X-Frame-Options: DENY`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Strict-Transport-Security: max-age=...` (HSTS)

**Vous NE DEVEZ PAS voir :**
- ❌ `Cross-Origin-Embedder-Policy` (bloquerait Cloudinary)

Si vous voyez un header COEP inattendu, modifiez `main.ts` :
```typescript
app.use(helmet());
app.use(helmet.crossOriginEmbedderPolicy({ policy: "unsafe-none" }));
```

### Variables d'environnement Production

```bash
NODE_ENV=production
PORT=3000  # ou le port fourni par l'hébergeur
DATABASE_URL="postgresql://user:password@host:5432/db"  # Neon
JWT_SECRET="[GÉNÉRER 32+ CARACTÈRES ALÉATOIRES]"
CSRF_SECRET="[GÉNÉRER 32+ CARACTÈRES ALÉATOIRES]"
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
ALLOWED_ORIGINS="https://votredomaine.com,https://www.votredomaine.com"
```

**Générer des secrets sécurisés (JWT_SECRET et CSRF_SECRET) :**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## ✅ Mode Privé / Non-référencé

### Configuration actuelle

**Protection anti-indexation (triple couche)**
- [x] `public/robots.txt` : bloque tous les robots (`User-agent: * / Disallow: /`)
- [x] Meta robots dans `<head>` : `<meta name="robots" content="noindex, nofollow">`
  - `src/view/index.html:6` (template principal)
  - `src/back/services/svelte-render.service.ts:23` (fallback)
- [x] Header HTTP `X-Robots-Tag: noindex, nofollow` sur toutes les routes
  - `src/back/shared/middleware/robots-header.middleware.ts`
  - Appliqué globalement dans `app.module.ts:84`
- [x] Pas de sitemap généré

**Protection par authentification (UX optimisée)**
- [x] Pages SSR : `@UseGuards(JwtAuthRedirectGuard)` → redirige vers `/login` (302)
  - `src/back/api/auth/guards/jwt-auth-redirect.guard.ts`
  - Home, recipes, ingredients, stores, plannings, shopping-lists, profile, users, admin
- [x] API REST : `@UseGuards(JwtAuthGuard)` → renvoie 401
  - `/api/ingredients/*`, `/api/recipes/*`, `/api/stores/*`, etc.
- [x] API navigation protégée (non utilisée par pages publiques)
- [x] Routes publiques (minimum strict) :
  - `/login`, `/register` (auth nécessaire)
  - `/auth/csrf-token`, `/auth/logout` (endpoints auth)
  - `/privacy-policy`, `/legal-notice` (obligation légale RGPD)

**Options avancées (non implémentées)**
- [ ] Basic Auth au niveau hébergeur (Render/Heroku)
- [ ] Whitelist IP (si besoin de restreindre davantage)
- [ ] Authentification à deux facteurs (2FA)

Voir détails complets dans `PRIVATE_MODE.md`.

## ✅ Upload de fichiers

### Configuration actuelle

**Multer >= 2.0.0** (patch CVE DoS)
- [x] Multer 2.x installé explicitement (CVE DoS patches)
- [x] Limites volumétriques : 10MB max, 1 fichier, 10 champs, 20 parts
- [x] Pas de `fileFilter` (validation via ParseFilePipe pour 400 propres)

**Validation ParseFilePipe (Controller)**
- [x] `MaxFileSizeValidator` (10MB)
- [x] `FileTypeValidator` avec regex stricte `/^image\/(jpeg|png|webp)$/`
- [x] `fileIsRequired: true`
- [x] Génère des `BadRequestException` (400) au lieu de 500 techniques

**Validation Magic Bytes (Service)**
- [x] Détection JPEG : `FF D8 FF`
- [x] Détection PNG : `89 50 4E 47 0D 0A 1A 0A`
- [x] Détection WebP : `RIFF` (0-3) + `WEBP` (8-11) ✅ Robuste
- [x] Vérification cohérence mimetype déclaré vs détecté
- [x] Défense en profondeur contre le spoofing

**Protection CSRF pour uploads**
- [x] Header `X-CSRF-Token` obligatoire pour tous les uploads
- [x] Frontend : `apiService.uploadFormData()` ajoute automatiquement le header
- [x] Validation côté serveur via middleware CSRF
- [x] Erreur 403 si token manquant/invalide

**Authentification**
- [x] Routes uploads protégées par `@UseGuards(JwtAuthGuard)`
- [x] Rate limiting 5 req/min appliqué

Voir détails complets dans `UPLOAD_SECURITY.md`.

## 📝 Notes supplémentaires

### Validation des mots de passe
- Minimum 8 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial (@$!%*?&)

### Cookies
- `httpOnly: true` → Protection XSS
- `secure: true` en production → HTTPS uniquement
- `sameSite: 'lax'` → Protection CSRF
- Durée: 7 jours

### Logs
Tous les logs d'erreur sont sécurisés avec un helper centralisé type-safe :
- **En développement** : Stack trace complète (`error`) pour faciliter le debug
- **En production** : `error.message` uniquement pour éviter d'exposer :
  - Tokens/secrets dans `error.config`
  - Stack traces avec données sensibles
  - Headers HTTP complets

**Helper centralisé** (`src/back/shared/utils/logger.util.ts`) :
```typescript
import { logError, logAndThrow } from '../../shared/utils/logger.util';

// Pour logger sans rethrow (ex: opérations best-effort)
catch (error) {
  logError('Context message', error);
}

// Pour logger ET rethrow (comportement par défaut)
catch (error) {
  logAndThrow('Context message', error);
}
```

**Avantages de cette approche :**
- ✅ Type-safe : Compatible avec `useUnknownInCatchVariables: true`
- ✅ DRY : Pas de duplication du code de log
- ✅ Maintenable : Changement centralisé si besoin
- ✅ Sécurisé : Protection automatique en production
- ✅ **Compatible NestJS** : Préserve les `HttpException` pour les status codes corrects

**IMPORTANT - Préservation des HttpException :**
Le helper `logAndThrow` préserve les exceptions NestJS (`HttpException`) pour que les bons status codes soient renvoyés :
- `BadRequestException` → 400
- `NotFoundException` → 404
- `ConflictException` → 409
- etc.

Sans cette préservation, toutes les erreurs deviendraient des 500 Internal Server Error.

**Note sur les opérations "best-effort" :**
Certaines opérations comme `deleteIngredientImage` loggent mais ne rethrow pas, car leur échec n'est pas critique pour l'utilisateur.

**Bonne pratique - Controllers vs Services :**
- **Services** : Utilisez `logAndThrow` pour ajouter du contexte
- **Controllers** : Laissez les erreurs remonter (pas de catch redondant)

### Amélioration future (optionnel)
Pour une gestion plus professionnelle des logs, considérez :
- **NestJS Logger** : Logger natif avec niveaux configurables
- **Winston** ou **Pino** : Loggers structurés avec rotation de fichiers
- **Sentry** / **LogRocket** : Monitoring d'erreurs en production avec contexte
