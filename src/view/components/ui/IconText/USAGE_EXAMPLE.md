# IconText Component - Usage Example

## Migration depuis l'ancienne version

### ❌ Ancienne utilisation (avec string/emoji)
```svelte
<IconText
  icon="🍕"
  title="Pizza"
  description="Délicieuse pizza italienne"
  variant="primary"
  size="medium"
/>
```

### ✅ Nouvelle utilisation (avec lucide-svelte)
```svelte
<script>
  import IconText from '$lib/components/ui/IconText';
  import { Pizza } from 'lucide-svelte';
</script>

<IconText
  title="Pizza"
  description="Délicieuse pizza italienne"
  variant="primary"
  size="medium"
>
  {#snippet icon()}
    <Pizza size={20} />
  {/snippet}
</IconText>
```

## Exemples d'utilisation

### Basic Usage
```svelte
<script>
  import IconText from '$lib/components/ui/IconText';
  import { Heart } from 'lucide-svelte';
</script>

<IconText title="Favoris">
  {#snippet icon()}
    <Heart size={20} />
  {/snippet}
</IconText>
```

### With Description
```svelte
<script>
  import IconText from '$lib/components/ui/IconText';
  import { ShoppingCart } from 'lucide-svelte';
</script>

<IconText
  title="Panier"
  description="3 articles"
  variant="info"
>
  {#snippet icon()}
    <ShoppingCart size={20} />
  {/snippet}
</IconText>
```

### Different Variants
```svelte
<script>
  import IconText from '$lib/components/ui/IconText';
  import { Check, AlertTriangle, Info, X } from 'lucide-svelte';
</script>

<!-- Success -->
<IconText title="Succès" variant="success">
  {#snippet icon()}
    <Check size={20} />
  {/snippet}
</IconText>

<!-- Warning -->
<IconText title="Attention" variant="warning">
  {#snippet icon()}
    <AlertTriangle size={20} />
  {/snippet}
</IconText>

<!-- Danger -->
<IconText title="Erreur" variant="danger">
  {#snippet icon()}
    <X size={20} />
  {/snippet}
</IconText>

<!-- Info -->
<IconText title="Information" variant="info">
  {#snippet icon()}
    <Info size={20} />
  {/snippet}
</IconText>
```

### Different Sizes
```svelte
<script>
  import IconText from '$lib/components/ui/IconText';
  import { Star } from 'lucide-svelte';
</script>

<!-- Small -->
<IconText title="Petit" size="small">
  {#snippet icon()}
    <Star size={16} />
  {/snippet}
</IconText>

<!-- Medium (default) -->
<IconText title="Moyen" size="medium">
  {#snippet icon()}
    <Star size={20} />
  {/snippet}
</IconText>

<!-- Large -->
<IconText title="Grand" size="large">
  {#snippet icon()}
    <Star size={24} />
  {/snippet}
</IconText>
```

### Disabled State
```svelte
<script>
  import IconText from '$lib/components/ui/IconText';
  import { Lock } from 'lucide-svelte';
</script>

<IconText
  title="Fonctionnalité verrouillée"
  disabled={true}
>
  {#snippet icon()}
    <Lock size={20} />
  {/snippet}
</IconText>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Snippet` | **required** | Snippet contenant l'icône (lucide-svelte) |
| `title` | `string` | **required** | Titre à afficher |
| `description` | `string` | `undefined` | Description optionnelle |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'primary'` | Variante de couleur |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Taille du composant |
| `disabled` | `boolean` | `false` | État désactivé |
| `class` | `string` | `''` | Classes CSS additionnelles |

## Recommended Icon Sizes

- **small**: `size={16}`
- **medium**: `size={20}`
- **large**: `size={24}`
