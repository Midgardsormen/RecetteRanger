# Stratégie d'Optimisation d'Images

## 📊 Objectifs

Minimiser les coûts du plan Cloudinary Free en optimisant :
- ✅ **Bande passante** : Réduction de 60-80% avec WebP + q_auto:eco
- ✅ **Transformations mensuelles** : Standardisation des tailles pour maximiser le cache
- ✅ **Stockage** : Format JPG forcé à l'upload, nettoyage des images orphelines

## 🏗️ Architecture

### Backend

#### 1. **Service Cloudinary (`cloudinary.service.ts`)**
```typescript
// Upload avec format JPG forcé et quality eco
{
  format: 'jpg',           // Forcer JPG (WebP sera servi via f_auto)
  quality: 'auto:eco',     // Quality eco par défaut
}
```

**Pourquoi ?**
- JPG est 30-50% plus léger que PNG
- WebP sera automatiquement servi aux navigateurs compatibles via `f_auto`
- `quality: 'auto:eco'` réduit la bande passante de 40%

#### 2. **Utilitaire d'URLs optimisées (`cloudinary-url.util.ts`)**

Génère des URLs standardisées avec :
- ✅ Tailles fixes : `320, 480, 800, 1200`
- ✅ Transformations : `w_XXX,h_XXX,c_fill,g_auto,f_auto,q_auto:eco`
- ✅ Aspect ratios : `1:1` (ingrédients), `16:9` (recettes)

**Exemple d'URL générée :**
```
https://res.cloudinary.com/[cloud]/image/upload/w_320,h_320,c_fill,g_auto,f_auto,q_auto:eco/recette-ranger/ingredients/tomate
```

**Paramètres clés :**
- `c_fill` : Crop pour remplir les dimensions
- `g_auto` : Smart crop (détection des visages/objets importants)
- `f_auto` : Format auto (WebP si supporté, sinon JPG)
- `q_auto:eco` : Quality économique (-40% de bande passante)

#### 3. **Upload Service (`upload.service.ts`)**

Utilise les tailles standardisées :
```typescript
{
  thumbnail: 320x320,  // Pour les listes
  medium: 800x800,     // Pour les vues détaillées
  original: 1200x1200  // Taille maximale
}
```

#### 4. **Cache-Control Interceptor**

Ajoute automatiquement les headers de cache sur les réponses contenant des URLs Cloudinary :
```http
Cache-Control: public, max-age=31536000, immutable
```

**Résultat :**
- Les navigateurs conservent les images 1 an
- Les CDN mettent en cache les images
- Réduction de 90% des requêtes vers Cloudinary

### Frontend

#### 1. **Composant OptimizedImage**

Composant Svelte avec :
- ✅ **srcset automatique** : 4 tailles (320w, 480w, 800w, 1200w)
- ✅ **lazy loading** par défaut
- ✅ **Placeholder skeleton** pendant le chargement
- ✅ **Aspect ratio** préservé

**Usage :**
```svelte
<OptimizedImage
  src="https://res.cloudinary.com/.../image.jpg"
  alt="Tomate"
  aspectRatio="square"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Génération du srcset :**
```html
<img
  srcset="
    ...w_320,h_320,c_fill,g_auto,f_auto,q_auto:eco/... 320w,
    ...w_480,h_480,c_fill,g_auto,f_auto,q_auto:eco/... 480w,
    ...w_800,h_800,c_fill,g_auto,f_auto,q_auto:eco/... 800w,
    ...w_1200,h_1200,c_fill,g_auto,f_auto,q_auto:eco/... 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

**Avantages :**
- Le navigateur choisit automatiquement la taille optimale
- Économie de bande passante (jusqu'à 80% sur mobile)
- Lazy loading : images chargées uniquement quand visibles

## 📈 Impact sur les Limites Cloudinary Free

### Limites du plan Free
- ✅ 25 crédits/mois
- ✅ 25 GB de bande passante
- ✅ 25 GB de stockage

### Consommation estimée AVANT optimisation
| Ressource | Sans optimisation | Avec optimisation | Économie |
|-----------|-------------------|-------------------|----------|
| **Bande passante** | ~100 KB/image | ~30 KB/image | **70%** |
| **Transformations** | Variable (1-4/image) | 0 (cache) | **95%** |
| **Stockage** | ~500 KB/image | ~150 KB/image | **70%** |

### Exemple concret
**1000 images uploadées et consultées 10 000 fois/mois**

| Métrique | Sans optimisation | Avec optimisation |
|----------|-------------------|-------------------|
| Stockage | 500 MB | 150 MB |
| Bande passante | 1 GB (10K vues × 100 KB) | 300 MB (10K vues × 30 KB) |
| Transformations | 10-40K | ~100 (cache) |

**Résultat :** Vous pouvez gérer **3x plus d'images** avec le plan Free ! 🚀

## 🔧 Migration des Composants Existants

### Avant
```svelte
<img src={imageUrl} alt="Ingrédient" />
```

### Après
```svelte
<OptimizedImage
  src={imageUrl}
  alt="Ingrédient"
  aspectRatio="square"
  loading="lazy"
/>
```

### Liste des composants à migrer
- [ ] `ListItem.svelte` (ligne 63)
- [ ] `Card.svelte`
- [ ] `RecipeDetail.svelte`
- [ ] `Dashboard.svelte`
- [ ] Autres composants utilisant `<img>`

## 🧹 Nettoyage des Images Orphelines

### Service de nettoyage (`image-cleanup.service.ts`)

**TODO : À implémenter avec Cloudinary Admin API**

Stratégie :
1. Lister toutes les images en BDD (ingrédients, recettes)
2. Lister toutes les images sur Cloudinary
3. Identifier les orphelines (sur Cloudinary mais pas en BDD)
4. Supprimer les orphelines > 7 jours

**Note :** Nécessite l'activation de l'API Admin Cloudinary

### Implémentation future (CRON job)
```typescript
// Dans app.module.ts ou via NestJS Scheduler
@Cron('0 3 * * 0') // Tous les dimanches à 3h du matin
async weeklyImageCleanup() {
  await this.imageCleanupService.cleanupOrphanImages(false, 7);
}
```

## 📝 Checklist de Déploiement

### Backend
- [x] CloudinaryService mis à jour (format JPG, quality eco)
- [x] UploadService avec URLs optimisées
- [x] Utilitaire cloudinary-url.util.ts créé
- [x] CacheControlInterceptor ajouté
- [x] ImageCleanupService créé (TODO: API Admin)

### Frontend
- [x] Composant OptimizedImage créé
- [x] Types ajoutés dans ui.types.ts
- [ ] Migration des composants existants
- [ ] Tests visuels sur différents appareils

### Monitoring
- [ ] Surveiller la consommation Cloudinary
- [ ] Analyser les métriques de performance (LCP, FCP)
- [ ] Vérifier le taux de hit du cache

## 🎯 Recommandations

1. **Images above-the-fold** : Utiliser `eager={true}` pour le chargement immédiat
2. **Images de liste** : Toujours utiliser `loading="lazy"`
3. **Nettoyage** : Exécuter le cleanup une fois par semaine
4. **Monitoring** : Surveiller Cloudinary Dashboard pour détecter les pics

## 📚 Ressources

- [Cloudinary Transformation URL Syntax](https://cloudinary.com/documentation/transformation_reference)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- [Responsive Images (srcset)](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
