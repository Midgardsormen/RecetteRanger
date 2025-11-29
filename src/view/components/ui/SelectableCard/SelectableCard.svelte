<script lang="ts">
  import { selectableCardVariantClasses, defaultSelectableCardConfig } from './SelectableCard.config';
  import { handleRemove } from './SelectableCard.actions';
  import type { SelectableCardVariant } from './SelectableCard.config';
  import { IconButton } from '../index';
  import { X } from 'lucide-svelte';

  interface Props {
    /**
     * Titre affiché dans le header
     */
    title: string;

    /**
     * Variante visuelle de la carte
     * @default 'default'
     */
    variant?: SelectableCardVariant;

    /**
     * Si true, affiche un bouton de suppression
     * @default true
     */
    removable?: boolean;

    /**
     * Callback appelé lors du clic sur le bouton de suppression
     */
    onRemove?: () => void;

    /**
     * Classes CSS additionnelles
     */
    class?: string;
  }

  let {
    title,
    variant = defaultSelectableCardConfig.variant,
    removable = defaultSelectableCardConfig.removable,
    onRemove,
    class: className = '',
    children,
  }: Props = $props();

  // Calculer les classes CSS
  const classes = $derived(
    [
      'selectable-card',
      selectableCardVariantClasses[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ')
  );

  // Déterminer le variant du IconButton selon le variant de la carte
  const iconButtonVariant = $derived(variant === 'inverse' ? 'ghost-inverse' : 'danger');
</script>

<div class={classes}>
  <div class="selectable-card__header">
    <span class="selectable-card__title">{title}</span>
    {#if removable}
      <IconButton
        variant={iconButtonVariant}
        size="small"
        onclick={() => handleRemove(onRemove)}
        ariaLabel="Supprimer"
        class="selectable-card__remove"
      >
        <X size={16} />
      </IconButton>
    {/if}
  </div>
  <div class="selectable-card__content">
    {@render children?.()}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Base styles (mobile first)
  .selectable-card {
    padding: $spacing-md;
    border-radius: $radius-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    transition: all $transition-base;
  }

  // Header
  .selectable-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-sm;
  }

  .selectable-card__title {
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    font-size: $font-size-base;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // Override IconButton border-radius to be fully rounded
  :global(.selectable-card__remove) {
    border-radius: $radius-full !important;
  }

  // Content
  .selectable-card__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  // Variants
  .selectable-card--default {
    background: $color-primary-alpha-05;
    border: 2px solid $color-border-primary;

    .selectable-card__title {
      color: $color-text-primary;
    }
  }

  .selectable-card--inverse {
    background: $brand-primary;
    border: 2px solid $color-white;

    .selectable-card__title {
      color: $color-white;
    }

    // Override form elements in inverse variant
    :global(label) {
      color: $color-white !important;
    }

    :global(.form-label) {
      color: $color-white;
    }

    // Les inputs, selects et textareas gardent leur couleur normale car ils ont un fond blanc
    :global(input:not([type="checkbox"])),
    :global(select),
    :global(textarea) {
      border-color: $color-white-alpha-30;
    }

    // Checkbox garde son accent color normal
    :global(input[type="checkbox"]) {
      // Le checkbox garde son apparence normale
    }
  }

  // Responsive (desktop)
  @media (min-width: $breakpoint-md) {
    .selectable-card {
      padding: $spacing-lg;
    }

    .selectable-card__title {
      font-size: $font-size-lg;
    }
  }
</style>
