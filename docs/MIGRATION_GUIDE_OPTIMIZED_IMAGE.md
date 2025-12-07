# Guide de Migration : OptimizedImage

## 🎯 Objectif

Remplacer toutes les balises `<img>` par le composant `OptimizedImage` pour bénéficier de :
- ✅ **srcset automatique** (4 tailles responsive)
- ✅ **Lazy loading** par défaut
- ✅ **Formats optimisés** (WebP/JPG via Cloudinary)
- ✅ **Cache long terme** (1 an)
- ✅ **Placeholder skeleton** pendant le chargement

## 📝 Syntaxe

### Avant
```svelte
<img src={imageUrl} alt="Description" />
```

### Après
```svelte
<OptimizedImage
  src={imageUrl}
  alt="Description"
  aspectRatio="square"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

## 🔧 Props du Composant

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `src` | `string` | **requis** | URL de l'image (Cloudinary ou autre) |
| `alt` | `string` | **requis** | Texte alternatif pour l'accessibilité |
| `aspectRatio` | `'square'` \| `'16:9'` \| `'4:3'` \| `'free'` | `'square'` | Aspect ratio de l'image |
| `sizes` | `string` | auto | Attribut sizes pour le responsive |
| `loading` | `'lazy'` \| `'eager'` | `'lazy'` | Mode de chargement |
| `eager` | `boolean` | `false` | Force le chargement immédiat (above-the-fold) |
| `objectFit` | `'cover'` \| `'contain'` \| ... | `'cover'` | Mode d'ajustement |
| `rounded` | `boolean` | `false` | Coins arrondis |
| `className` | `string` | `''` | Classes CSS additionnelles |
| `placeholder` | `Snippet` | skeleton | Placeholder personnalisé |

## 📐 Choisir l'Aspect Ratio

### Ingrédients & Articles → `square` (1:1)
```svelte
<OptimizedImage
  src={ingredient.imageUrl}
  alt={ingredient.label}
  aspectRatio="square"
/>
```

### Recettes → `16:9`
```svelte
<OptimizedImage
  src={recipe.imageUrl}
  alt={recipe.label}
  aspectRatio="16:9"
/>
```

### Logos d'enseignes → `free`
```svelte
<OptimizedImage
  src={store.logoUrl}
  alt={store.name}
  aspectRatio="free"
/>
```

## 📏 Attribut `sizes` : Guide

L'attribut `sizes` indique au navigateur quelle taille d'image charger selon la largeur de l'écran.

### Images pleine largeur (100vw)
```svelte
sizes="100vw"
```

### Images demi-largeur (50vw) sur desktop, pleine largeur sur mobile
```svelte
sizes="(max-width: 768px) 100vw, 50vw"
```

### Images en grille (3 colonnes desktop, 1 colonne mobile)
```svelte
sizes="(max-width: 768px) 100vw, 33vw"
```

### Images fixes (ex: 300px max)
```svelte
sizes="(max-width: 640px) 80px, 100px"
```

## 🚀 Exemples de Migration

### 1. ListItem (Liste d'ingrédients)

#### Avant
```svelte
<img src={imageUrl} alt={title} class="list-item__image" />
```

#### Après
```svelte
<OptimizedImage
  src={imageUrl}
  alt={title || 'Image'}
  aspectRatio="square"
  sizes="(max-width: 640px) 80px, 100px"
  loading="lazy"
  objectFit="contain"
  className="list-item__image"
/>
```

### 2. Card (Carte de recette)

#### Avant
```svelte
<img src={recipe.imageUrl} alt={recipe.label} class="recipe-card__image" />
```

#### Après
```svelte
<OptimizedImage
  src={recipe.imageUrl}
  alt={recipe.label}
  aspectRatio="16:9"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  objectFit="cover"
  rounded
/>
```

### 3. RecipeDetail (Image hero en haut de page)

#### Avant
```svelte
<img src={recipe.imageUrl} alt={recipe.label} class="recipe-hero" />
```

#### Après
```svelte
<OptimizedImage
  src={recipe.imageUrl}
  alt={recipe.label}
  aspectRatio="16:9"
  sizes="(max-width: 1200px) 100vw, 1200px"
  eager={true}  <!-- Image above-the-fold, chargement immédiat -->
  objectFit="cover"
  rounded
/>
```

### 4. Dashboard (Images en grille)

#### Avant
```svelte
{#each recipes as recipe}
  <img src={recipe.imageUrl} alt={recipe.label} />
{/each}
```

#### Après
```svelte
{#each recipes as recipe}
  <OptimizedImage
    src={recipe.imageUrl}
    alt={recipe.label}
    aspectRatio="16:9"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
    objectFit="cover"
  />
{/each}
```

## ⚡ Images Above-the-Fold

Pour les images visibles immédiatement (sans scroll), utiliser `eager={true}` :

```svelte
<OptimizedImage
  src={hero.imageUrl}
  alt="Hero"
  eager={true}  <!-- Pas de lazy loading -->
/>
```

**Règle :** Uniquement les 1-2 premières images de la page !

## 🎨 Placeholder Personnalisé

Par défaut, un skeleton gris animé s'affiche. Pour le personnaliser :

```svelte
<OptimizedImage
  src={imageUrl}
  alt="Ingrédient"
>
  {#snippet placeholder()}
    <div class="custom-placeholder">
      🍅 Chargement...
    </div>
  {/snippet}
</OptimizedImage>
```

## ✅ Checklist de Migration

### Composants à migrer (par priorité)

#### 🔥 Haute priorité
- [x] `ListItem.svelte` (✅ Migré)
- [ ] `Card.svelte`
- [ ] `RecipeDetail.svelte`
- [ ] `Recipes.svelte`

#### 📋 Moyenne priorité
- [ ] `Dashboard.svelte`
- [ ] `Ingredients.svelte`
- [ ] `Articles.svelte`

#### 🔧 Basse priorité
- [ ] `Profile.svelte`
- [ ] `Stores.svelte`
- [ ] Autres composants

### Étapes de migration

1. **Import du composant**
   ```svelte
   import { OptimizedImage } from '../../components/ui';
   ```

2. **Remplacer `<img>` par `<OptimizedImage>`**
   - Conserver l'attribut `src`
   - Conserver l'attribut `alt`
   - Ajouter `aspectRatio` (square, 16:9, 4:3, free)
   - Ajouter `sizes` approprié
   - Ajouter `loading="lazy"` (sauf above-the-fold)

3. **Tester visuellement**
   - Desktop (1920px, 1440px, 1024px)
   - Tablet (768px)
   - Mobile (375px, 414px)

4. **Vérifier les performances**
   - Network tab : vérifier que les images chargées sont bien dimensionnées
   - Lighthouse : vérifier le score LCP (Largest Contentful Paint)

## 🐛 Problèmes Courants

### L'image ne s'affiche pas
✅ Vérifier que l'URL est bien une URL Cloudinary
✅ Vérifier que `alt` est défini

### L'image est déformée
✅ Utiliser `objectFit="contain"` au lieu de `"cover"`
✅ Vérifier l'`aspectRatio`

### L'image est trop petite/grande
✅ Ajuster l'attribut `sizes`
✅ Vérifier les styles CSS parents

### Le placeholder ne disparaît pas
✅ Vérifier la console pour les erreurs de chargement
✅ Vérifier que l'URL est valide

## 📊 Monitoring Post-Migration

Après la migration, surveiller :
- **Cloudinary Dashboard** : Consommation de bande passante
- **Lighthouse** : Score de performance (LCP, FCP)
- **Network tab** : Taille des images chargées
- **Coverage tab** : Pourcentage d'images lazy-loadées

## 🎯 Objectif Final

**Économie attendue :**
- 📉 **70% de bande passante** en moins
- 📉 **95% de transformations** en moins (grâce au cache)
- ⚡ **LCP < 2.5s** (score Lighthouse 90+)

---

**Besoin d'aide ?** Consulter la [documentation complète](./IMAGE_OPTIMIZATION_STRATEGY.md)
