# Images Directory Structure

Cette structure d'images est utilisée par l'application RecetteRanger. Les chemins sont définis dans `src/view/constants/images.ts`.

## Structure

```
images/
├── logo.svg                    # Logo principal de l'application
├── logo-dark.svg              # Logo pour le mode sombre
├── icon.svg                   # Icône de l'application (favicon)
├── logo-text.svg              # Logo avec texte
├── placeholders/              # Images par défaut
│   ├── recipe-placeholder.png
│   ├── ingredient-placeholder.png
│   ├── avatar-placeholder.png
│   └── placeholder.png
├── icons/                     # Icônes diverses
│   ├── categories/           # Icônes de catégories de recettes
│   │   ├── appetizer.svg
│   │   ├── main-course.svg
│   │   ├── dessert.svg
│   │   ├── breakfast.svg
│   │   └── snack.svg
│   └── features/             # Icônes de fonctionnalités
│       ├── shopping-list.svg
│       ├── meal-plan.svg
│       ├── ingredients.svg
│       └── recipes.svg
├── illustrations/             # Illustrations pour états vides
│   ├── no-recipes.svg
│   ├── no-ingredients.svg
│   ├── no-shopping-lists.svg
│   └── welcome.svg
└── backgrounds/               # Images de fond
    ├── hero.jpg
    └── pattern.svg
```

## Utilisation

Les images sont référencées via le fichier `src/view/constants/images.ts` :

```typescript
import { IMAGES, getRecipeImage } from '@/constants';

// Utilisation directe
<img src={IMAGES.logo.main} alt="RecetteRanger" />

// Avec fonction helper
<img src={getRecipeImage(recipe.imageUrl)} alt={recipe.name} />
```

## Formats recommandés

- **Logos et icônes** : SVG (vectoriel, redimensionnable)
- **Placeholders** : PNG ou WebP
- **Illustrations** : SVG de préférence
- **Backgrounds** : JPG ou WebP (optimisés)

## Optimisation

- Compresser les images avant de les ajouter
- Utiliser des formats modernes (WebP, AVIF) quand possible
- Les SVG doivent être optimisés (SVGO)
- Les images doivent être en résolution appropriée (pas de sur-dimensionnement)
