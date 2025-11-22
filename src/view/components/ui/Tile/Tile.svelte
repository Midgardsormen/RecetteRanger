<script lang="ts">
  import type { TileProps } from '../../../types/ui.types';
  import { handleClick as handleTileClick, handleKeydown as handleTileKeydown } from './Tile.actions';
  import { TILE_DEFAULTS, TILE_ICON_SIZE } from './Tile.config';

  let {
    title,
    subtitle,
    icon,
    clickable = TILE_DEFAULTS.clickable,
    selected = TILE_DEFAULTS.selected,
    disabled = TILE_DEFAULTS.disabled,
    onclick,
    children
  }: TileProps = $props();
</script>

<div
  class="tile"
  class:tile--clickable={clickable}
  class:tile--selected={selected}
  class:tile--disabled={disabled}
  role={clickable ? 'button' : undefined}
  tabindex={clickable && !disabled ? 0 : undefined}
  onclick={() => handleTileClick(disabled, clickable, onclick)}
  onkeydown={(e) => handleTileKeydown(e, disabled, clickable, onclick)}
>
  {#if icon}
    <div class="tile__icon">
      {@render icon()}
    </div>
  {/if}

  <div class="tile__content">
    {#if title}
      <h4 class="tile__title">{title}</h4>
    {/if}
    {#if subtitle}
      <p class="tile__subtitle">{subtitle}</p>
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .tile {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-lg;
    background: $color-white;
    border: $border-width-base solid $color-border-primary;
    border-radius: $radius-xl;
    transition: all $transition-base $transition-ease;

    &--clickable {
      cursor: pointer;

      &:hover:not(&--disabled) {
        border-color: $brand-primary;
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }

      &:active:not(&--disabled) {
        transform: translateY(0);
      }

      &:focus-visible {
        outline: $outline-width solid $brand-primary;
        outline-offset: $outline-offset;
      }
    }

    &--selected {
      background: $color-primary-alpha-10;
      border-color: $brand-primary;
      box-shadow: $shadow-focus-primary;

      &:hover:not(&--disabled) {
        background: $color-primary-alpha-15;
      }
    }

    &--disabled {
      opacity: $opacity-50;
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .tile__icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-2xl;
    line-height: 1;
  }

  .tile__content {
    flex: 1;
    min-width: 0;
  }

  .tile__title {
    margin: 0 0 $spacing-xs 0;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    line-height: $line-height-tight;
  }

  .tile__subtitle {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-normal;
  }
</style>
