# Mode Privé - RecetteRanger

## 🔒 Configuration

RecetteRanger est configuré en **mode privé / non-référencé** :

- ✅ Aucune indexation par les moteurs de recherche
- ✅ Accès uniquement après authentification
- ✅ Pages publiques limitées au strict nécessaire

## Protection anti-indexation

### 1. robots.txt

**Fichier** : `public/robots.txt`

```txt
# RecetteRanger - Application privée
# Interdiction d'indexation pour tous les robots

User-agent: *
Disallow: /
```

Ce fichier bloque **tous les robots** (Google, Bing, etc.) d'indexer n'importe quelle page.

### 2. Meta robots

**Fichier** : `src/view/index.html:6`

```html
<meta name="robots" content="noindex, nofollow">
```

Cette balise indique aux moteurs de recherche de :
- **noindex** : Ne pas indexer cette page
- **nofollow** : Ne pas suivre les liens sur cette page

**Également dans** : `src/back/services/svelte-render.service.ts:23` (template fallback)

### 3. Header HTTP X-Robots-Tag

**Fichier** : `src/back/shared/middleware/robots-header.middleware.ts`

```typescript
res.setHeader('X-Robots-Tag', 'noindex, nofollow');
```

Ce header HTTP ajoute une couche supplémentaire de protection :
- ✅ Fonctionne même si le HTML n'est pas parsé
- ✅ Appliqué sur toutes les routes (pages + API)
- ✅ Protection maximale contre l'indexation

**Appliqué globalement** : `src/back/app.module.ts:84`

### 4. Pas de sitemap

Aucun fichier `sitemap.xml` n'est généré, ce qui confirme l'intention de non-référencement.

## Protection par authentification

### Routes publiques (minimum nécessaire)

**Auth (nécessaire pour se connecter)** :
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/auth/csrf-token` - Obtenir le token CSRF
- `/auth/logout` - Se déconnecter

**Pages légales (obligation légale RGPD)** :
- `/privacy-policy` - Politique de confidentialité
- `/legal-notice` - Mentions légales

### Routes protégées (nécessitent authentification)

**Pages SSR** :
- `/` - Page d'accueil (Dashboard)
- `/recipes` - Liste des recettes
- `/ingredients` - Liste des ingrédients
- `/stores` - Liste des magasins
- `/meal-planning` - Planification des repas
- `/shopping-lists` - Listes de courses
- `/profile` - Profil utilisateur
- `/users` - Gestion des utilisateurs (admin)
- `/admin` - Administration (admin)

**API** :
- `/api/ingredients/*` - CRUD ingrédients
- `/api/recipes/*` - CRUD recettes
- `/api/stores/*` - CRUD magasins
- `/api/meal-plans/*` - Planification
- `/api/shopping-lists/*` - Listes de courses
- `/api/upload/*` - Upload d'images
- `/api/users/*` - Gestion utilisateurs
- `/api/navigation/*` - Configuration navigation

Toutes ces routes utilisent `@UseGuards(JwtAuthGuard)`.

## Mécanisme de protection

### Backend (NestJS)

**Pour les pages SSR** (meilleure UX) :

```typescript
// Exemple : src/back/modules/home/home.controller.ts
@Controller()
export class HomeController {
  @Get()
  @UseGuards(JwtAuthRedirectGuard) // ← Redirige vers /login si non auth
  async getHomePage(@Request() req, @Res() res: Response) {
    const user = req.user; // Garanti d'exister
    // ...
  }
}
```

Le `JwtAuthRedirectGuard` :
1. Vérifie la présence du cookie `access_token`
2. Valide le JWT et vérifie l'expiration (7 jours)
3. Si échec → **302 Redirect vers `/login`** (UX améliorée)
4. Sauvegarde l'URL demandée pour redirection post-login

**Pour les API** (RESTful standard) :

```typescript
// Exemple : src/back/api/ingredients/ingredient.controller.ts
@Controller('api/ingredients')
@UseGuards(JwtAuthGuard) // ← Renvoie 401 si non auth
export class IngredientController {
  // ...
}
```

Le `JwtAuthGuard` :
1. Même validation que ci-dessus
2. Si échec → **401 Unauthorized** (standard REST)

### Frontend (redirection)

Lorsqu'une requête retourne 401 :
- Le store `authStore` déconnecte automatiquement l'utilisateur
- Redirection vers `/login`

```typescript
// src/view/services/api.service.ts:139
if (response.status === 401) {
  authStore.logout();
  throw new Error('Session expirée, veuillez vous reconnecter');
}
```

## Flux d'authentification

### Pages SSR (home, recipes, etc.)

```
Utilisateur non authentifié
    ↓
Tente d'accéder à "/"
    ↓
JwtAuthRedirectGuard vérifie le cookie
    ↓
Pas de cookie valide → 302 Redirect "/login?redirect=%2F"
    ↓
Utilisateur voit la page login
    ↓
Utilisateur se connecte
    ↓
Cookie JWT défini (httpOnly, secure, sameSite)
    ↓
Redirection vers "/" automatique
    ↓
JwtAuthRedirectGuard valide → Page affichée
```

### API (AJAX/fetch)

```
Appel API depuis le frontend
    ↓
JwtAuthGuard vérifie le cookie
    ↓
Pas de cookie valide → 401 Unauthorized
    ↓
Frontend (api.service.ts) détecte 401
    ↓
authStore.logout() + Error thrown
    ↓
Composant Svelte gère l'erreur
    ↓
Navigation vers "/login"
```

## Sécurité complémentaire

### Rate limiting

Toutes les routes ont un rate limiting :
- **Global** : 60 requêtes/minute par IP
- **Login** : 5 tentatives/minute par IP
- **Register** : 3 inscriptions/heure par IP

Cela protège contre le brute force même sans authentification.

### CSRF

Toutes les requêtes mutantes (POST/PUT/PATCH/DELETE) nécessitent un token CSRF :
- Header `X-CSRF-Token` requis
- Token lié à la session JWT
- Protection double contre les attaques CSRF

### Headers de sécurité (Helmet)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=...
Content-Security-Policy: ...
```

## Options avancées (optionnelles)

### 1. Basic Auth au niveau de l'hébergeur

Pour une protection supplémentaire, vous pouvez ajouter un Basic Auth au niveau de l'hébergeur (Render, Heroku, etc.).

**Avantages** :
- Double protection
- Empêche même les tentatives de connexion non autorisées
- Très simple à configurer

**Inconvénients** :
- Expérience utilisateur moins fluide (popup navigateur)
- Deux mots de passe à retenir

**Exemple Render** :
- Settings → Environment → Add Basic Auth
- Username: `recetteranger`
- Password: `[mot de passe fort]`

### 2. Whitelist IP

Si vous savez que seuls certains IPs doivent accéder à l'application :

```typescript
// src/back/main.ts (à ajouter)
import { Request, Response, NextFunction } from 'express';

const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(',') || [];

if (ALLOWED_IPS.length > 0) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip;
    if (ALLOWED_IPS.includes(clientIp)) {
      return next();
    }
    res.status(403).send('Access denied');
  });
}
```

**Variable d'environnement** :
```bash
ALLOWED_IPS="192.168.1.100,203.0.113.42"
```

⚠️ **Attention** : Ne pas utiliser avec un hébergeur qui change les IPs dynamiquement.

### 3. Authentification à deux facteurs (2FA)

Pour une sécurité maximale, vous pourriez ajouter une authentification à deux facteurs :

- **TOTP** (Google Authenticator, Authy)
- **SMS** (Twilio, etc.)
- **Email** (code de vérification)

Non implémenté actuellement, mais possible avec des packages comme `otplib` ou `speakeasy`.

## Vérification

### Test 1 : robots.txt

```bash
curl https://votre-domaine.com/robots.txt
```

Résultat attendu :
```
User-agent: *
Disallow: /
```

### Test 2 : Header X-Robots-Tag

```bash
curl -I https://votre-domaine.com/
```

Résultat attendu :
```
X-Robots-Tag: noindex, nofollow
```

### Test 3 : Meta robots

```bash
curl https://votre-domaine.com/login | grep robots
```

Résultat attendu :
```html
<meta name="robots" content="noindex, nofollow">
```

### Test 4 : Protection authentification

```bash
# Sans authentification (page SSR)
curl -I https://votre-domaine.com/

# Résultat attendu : 302 Redirect vers /login
```

```bash
# Sans authentification (API)
curl -I https://votre-domaine.com/api/ingredients

# Résultat attendu : 401 Unauthorized
```

### Test 5 : Pages publiques accessibles

```bash
curl -I https://votre-domaine.com/login
# Résultat attendu : 200 OK

curl -I https://votre-domaine.com/register
# Résultat attendu : 200 OK
```

## Checklist de déploiement

**Protection anti-indexation** :
- [x] `robots.txt` déployé dans `public/`
- [x] Meta `robots` dans le `<head>` (template principal + fallback)
- [x] Header HTTP `X-Robots-Tag: noindex, nofollow` sur toutes les routes
- [x] Pas de sitemap généré

**Protection par authentification** :
- [x] Pages SSR protégées par `JwtAuthRedirectGuard` (redirection UX)
- [x] API protégées par `JwtAuthGuard` (401 standard)
- [x] Pages publiques limitées : login, register, privacy-policy, legal-notice
- [x] Navigation API protégée (non utilisée par les pages publiques)

**Sécurité complémentaire** :
- [x] Rate limiting actif (60 req/min global, 5 login/min, 3 register/h)
- [x] CSRF actif (token obligatoire sur mutations)
- [x] Headers de sécurité (Helmet + CSP)

**Tests** :
- [ ] Test robots.txt : `curl https://domaine/robots.txt`
- [ ] Test header X-Robots-Tag : `curl -I https://domaine/`
- [ ] Test meta robots : `curl https://domaine/login | grep robots`
- [ ] Test redirection SSR : `curl -I https://domaine/` → 302
- [ ] Test API protection : `curl -I https://domaine/api/ingredients` → 401
- [ ] Test pages publiques : `curl -I https://domaine/login` → 200

**Options avancées (non implémentées)** :
- [ ] Basic Auth au niveau hébergeur
- [ ] Whitelist IP
- [ ] 2FA (TOTP/SMS/Email)

## Ressources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Google : Blocking with robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Meta robots tag specification](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
