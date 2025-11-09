# Design Tokens - RecetteRanger

Ce fichier contient toutes les variables SCSS centralisées pour l'application RecetteRanger.

## 📁 Fichiers

- `_variables.scss` - Toutes les variables SCSS (couleurs, espacements, typographie, etc.)

## 🎨 Utilisation

### Dans un composant Svelte

```svelte
<style lang="scss">
  @import '../../styles/variables';

  .my-component {
    color: $color-text-primary;
    background: $color-background-primary;
    padding: $spacing-lg;
    border-radius: $radius-lg;
    transition: all $transition-base $transition-ease;

    &:hover {
      background: $color-background-secondary;
    }
  }

  .my-button {
    color: $color-button-primary-text;
    background: $color-button-primary-background;
    border: 2px solid $color-button-primary-border;
    box-shadow: $shadow-md;

    &:hover {
      background: $color-button-primary-hover-background;
      box-shadow: $shadow-lg;
    }
  }
</style>
```

## 📚 Guide des Variables

### 🎨 Couleurs de Texte

| Variable | Valeur | Usage |
|----------|--------|-------|
| `$color-text-primary` | #333 | Texte principal |
| `$color-text-secondary` | #666 | Texte secondaire |
| `$color-text-tertiary` | #999 | Texte tertiaire |
| `$color-text-disabled` | #ccc | Texte désactivé |
| `$color-text-inverse` | #fff | Texte sur fond sombre |
| `$color-text-link` | #667eea | Liens |
| `$color-text-error` | #f56565 | Messages d'erreur |
| `$color-text-success` | #2f855a | Messages de succès |

### 🖼️ Couleurs d'Arrière-plan

| Variable | Usage |
|----------|-------|
| `$color-background-primary` | Fond principal (blanc) |
| `$color-background-secondary` | Fond secondaire (gris clair) |
| `$color-background-tertiary` | Fond tertiaire |
| `$color-background-overlay` | Overlay pour modals |
| `$color-background-success` | Fond pour alertes success |
| `$color-background-danger` | Fond pour alertes danger |
| `$color-background-warning` | Fond pour alertes warning |

### 🔘 Couleurs de Boutons

#### Primary Button
```scss
color: $color-button-primary-text;
background: $color-button-primary-background;
box-shadow: 0 4px 12px $color-button-primary-shadow;
```

#### Secondary Button
```scss
color: $color-button-secondary-text;
background: $color-button-secondary-background;
border: 2px solid $color-button-secondary-border;
```

#### Danger Button
```scss
color: $color-button-danger-text;
background: $color-button-danger-background;
```

#### Success Button
```scss
color: $color-button-success-text;
background: $color-button-success-background;
```

#### Ghost Button
```scss
color: $color-button-ghost-text;
background: $color-button-ghost-background;
```

### 📝 Couleurs de Formulaires

| Variable | Usage |
|----------|-------|
| `$color-input-text` | Texte dans les inputs |
| `$color-input-background` | Fond des inputs |
| `$color-input-border` | Bordure normale |
| `$color-input-border-focus` | Bordure au focus |
| `$color-input-border-hover` | Bordure au hover |
| `$color-input-placeholder` | Texte placeholder |
| `$color-input-error-border` | Bordure en cas d'erreur |
| `$color-input-disabled-background` | Fond quand désactivé |

### 📏 Espacements

| Variable | Valeur | Utilisation |
|----------|--------|-------------|
| `$spacing-xs` | 4px | Très petit espacement |
| `$spacing-sm` | 8px | Petit espacement |
| `$spacing-md` | 12px | Espacement moyen-petit |
| `$spacing-base` | 16px | Espacement de base |
| `$spacing-lg` | 24px | Grand espacement |
| `$spacing-xl` | 32px | Très grand espacement |
| `$spacing-2xl` | 48px | Extra large |
| `$spacing-3xl` | 64px | Énorme |

### 🔄 Border Radius

| Variable | Valeur | Usage |
|----------|--------|-------|
| `$radius-sm` | 4px | Petits éléments |
| `$radius-md` | 6px | Badges, tags |
| `$radius-lg` | 8px | Boutons, inputs |
| `$radius-xl` | 12px | Cartes |
| `$radius-2xl` | 16px | Modals |
| `$radius-full` | 9999px | Cercles, pills |

### ⚡ Transitions

```scss
// Durées
$transition-fast: 0.15s;
$transition-base: 0.2s;
$transition-slow: 0.3s;

// Types
$transition-ease: ease;
$transition-ease-in: ease-in;
$transition-ease-out: ease-out;

// Exemple
transition: all $transition-base $transition-ease;
```

### 🎭 Ombres

| Variable | Utilisation |
|----------|-------------|
| `$shadow-sm` | Éléments subtils |
| `$shadow-md` | Cartes, boutons |
| `$shadow-lg` | Cartes au hover |
| `$shadow-xl` | Modals |
| `$shadow-focus-primary` | Focus sur input primary |
| `$shadow-focus-danger` | Focus sur input erreur |

### 📱 Breakpoints

```scss
// Mobile
@media (max-width: $breakpoint-sm) { }  // 640px

// Tablet
@media (max-width: $breakpoint-md) { }  // 768px

// Desktop
@media (max-width: $breakpoint-lg) { }  // 1024px

// Large Desktop
@media (max-width: $breakpoint-xl) { }  // 1280px
```

### 🔤 Typographie

#### Tailles de police
```scss
font-size: $font-size-xs;    // 12px - Très petit
font-size: $font-size-sm;    // 14px - Petit
font-size: $font-size-base;  // 16px - Normal
font-size: $font-size-lg;    // 18px - Grand
font-size: $font-size-xl;    // 20px - Très grand
font-size: $font-size-2xl;   // 24px - Titres
```

#### Poids de police
```scss
font-weight: $font-weight-light;     // 300
font-weight: $font-weight-normal;    // 400
font-weight: $font-weight-medium;    // 500
font-weight: $font-weight-semibold;  // 600
font-weight: $font-weight-bold;      // 700
```

## 🎯 Exemples d'Utilisation

### Carte avec hover
```scss
.card {
  background: $color-card-background;
  border: 1px solid $color-card-border;
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  transition: all $transition-base $transition-ease;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }
}
```

### Input avec états
```scss
.input {
  background: $color-input-background;
  border: 2px solid $color-input-border;
  color: $color-input-text;
  padding: $spacing-md $spacing-base;
  border-radius: $radius-lg;
  transition: border-color $transition-base;

  &:hover {
    border-color: $color-input-border-hover;
  }

  &:focus {
    outline: none;
    border-color: $color-input-border-focus;
    box-shadow: $shadow-focus-primary;
  }

  &.error {
    border-color: $color-input-error-border;
    box-shadow: $shadow-focus-danger;
  }

  &:disabled {
    background: $color-input-disabled-background;
    color: $color-input-disabled-text;
    cursor: not-allowed;
  }
}
```

### Bouton avec variantes
```scss
.button {
  padding: $spacing-md $spacing-lg;
  border-radius: $radius-lg;
  font-weight: $font-weight-semibold;
  transition: all $transition-base;

  &--primary {
    color: $color-button-primary-text;
    background: $color-button-primary-background;
    border: none;

    &:hover {
      background: $color-button-primary-hover-background;
      box-shadow: 0 4px 12px $color-button-primary-shadow;
    }
  }

  &--secondary {
    color: $color-button-secondary-text;
    background: $color-button-secondary-background;
    border: 2px solid $color-button-secondary-border;

    &:hover {
      background: $color-button-secondary-hover-background;
    }
  }
}
```

## ✨ Bonnes Pratiques

1. **Toujours utiliser les variables** au lieu de valeurs en dur
2. **Ne pas créer de nouvelles couleurs** sans ajouter au fichier de variables
3. **Utiliser les espacements standardisés** pour la cohérence
4. **Respecter les transitions** définies pour une expérience fluide
5. **Utiliser les breakpoints** pour le responsive design

## 🔄 Migration

Si vous avez du code existant avec des valeurs en dur, remplacez-les progressivement :

**Avant :**
```scss
.old-component {
  color: #333;
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
}
```

**Après :**
```scss
.new-component {
  color: $color-text-primary;
  background: $color-background-primary;
  padding: $spacing-md $spacing-base;
  border-radius: $radius-lg;
}
```
