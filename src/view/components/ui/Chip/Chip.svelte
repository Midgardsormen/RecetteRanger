<script lang="ts">
  import { chipVariantClasses, chipSizeClasses, defaultChipConfig } from './Chip.config';
  import { handleRemove, handleClick } from './Chip.actions';
  import type { ChipVariant, ChipSize } from './Chip.config';
  import type { Snippet } from 'svelte';

  interface Props {
    /**
     * Variante visuelle du chip
     * @default 'default'
     */
    variant?: ChipVariant;

    /**
     * Taille du chip
     * @default 'md'
     */
    size?: ChipSize;

    /**
     * Si true, affiche un bouton de suppression
     * @default false
     */
    removable?: boolean;

    /**
     * Si true, le chip est cliquable
     * @default false
     */
    clickable?: boolean;

    /**
     * Callback appelé lors du clic sur le bouton de suppression
     */
    onRemove?: () => void;

    /**
     * Callback appelé lors du clic sur le chip (si clickable)
     */
    onClick?: () => void;

    /**
     * Classes CSS additionnelles
     */
    class?: string;

    /**
     * Contenu du chip
     */
    children?: Snippet;
  }

  let {
    variant = defaultChipConfig.variant,
    size = defaultChipConfig.size,
    removable = defaultChipConfig.removable,
    clickable = defaultChipConfig.clickable,
    onRemove,
    onClick,
    class: className = '',
    children,
  }: Props = $props();

  // Calculer les classes CSS
  const classes = $derived(
    [
      'chip',
      chipVariantClasses[variant],
      chipSizeClasses[size],
      clickable && 'chip--clickable',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  );
</script>

{#if clickable}
  <button
    class={classes}
    onclick={(e) => handleClick(e, onClick)}
    type="button"
  >
    <span class="chip__content">
      {@render children?.()}
    </span>
    {#if removable}
      <button
        class="chip__remove"
        onclick={(e) => {
          e.stopPropagation();
          handleRemove(onRemove);
        }}
        type="button"
        aria-label="Supprimer"
      >
        ✕
      </button>
    {/if}
  </button>
{:else}
  <span class={classes}>
    <span class="chip__content">
      {@render children?.()}
    </span>
    {#if removable}
      <button
        class="chip__remove"
        onclick={() => handleRemove(onRemove)}
        type="button"
        aria-label="Supprimer"
      >
        ✕
      </button>
    {/if}
  </span>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Base styles (mobile first)
  .chip {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    border-radius: $radius-full;
    font-weight: $font-weight-medium;
    transition: all $transition-fast;
    border: 1px solid transparent;
  }

  // Content wrapper
  .chip__content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // Remove button
  .chip__remove {
    flex-shrink: 0;
    background: none;
    border: none;
    color: currentColor;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-full;
    transition: all $transition-fast;
    font-size: 1rem;
    line-height: 1;
    opacity: 0.7;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  // Clickable state
  .chip--clickable {
    cursor: pointer;
    background: none;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  // Variants
  .chip--default {
    background: $color-primary-alpha-10;
    border-color: $color-primary-alpha-30;
    color: $color-text-primary;

    .chip__remove {
      color: $color-danger;

      &:hover {
        background: $color-danger-alpha-20;
      }
    }

    &.chip--clickable:hover {
      background: $color-primary-alpha-20;
      border-color: $brand-primary;
    }
  }

  .chip--inverse {
    background: $brand-primary;
    border-color: $brand-primary;
    color: $color-white;

    .chip__remove {
      color: $color-white;

      &:hover {
        background: $color-white-alpha-20;
      }
    }

    &.chip--clickable:hover {
      background: $brand-quaternary;
      border-color: $brand-quaternary;
    }
  }

  // Sizes
  .chip--sm {
    padding: $spacing-2xs $spacing-xs;
    font-size: $font-size-sm;
    gap: $spacing-2xs;

    .chip__remove {
      width: 14px;
      height: 14px;
      font-size: 0.75rem;
    }
  }

  .chip--md {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-base;
    gap: $spacing-xs;

    .chip__remove {
      width: 18px;
      height: 18px;
      font-size: 1rem;
    }
  }

  .chip--lg {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-lg;
    gap: $spacing-xs;

    .chip__remove {
      width: 22px;
      height: 22px;
      font-size: 1.25rem;
    }
  }

  // Responsive (desktop)
  @media (min-width: $breakpoint-md) {
    .chip {
      gap: $spacing-sm;
    }

    .chip--sm {
      gap: $spacing-xs;
    }

    .chip--lg {
      gap: $spacing-sm;
    }
  }
</style>
