<script lang="ts">
  import type { ListItemProps } from '../../../types/ui.types';
  import IconButton from '../IconButton';
  import { Pencil, Trash2, FileText } from 'lucide-svelte';
  import { LIST_ITEM_DEFAULTS, LIST_ITEM_METADATA_LIMIT, LIST_ITEM_ARIA_LABELS } from './ListItem.config';
  import { handleClick, handleEdit, handleDelete, handleCheck } from './ListItem.actions';

  let {
    imageUrl,
    imagePlaceholder,
    title,
    subtitle,
    metadata = LIST_ITEM_DEFAULTS.metadata,
    badge,
    footer,
    onEdit,
    onDelete,
    onClick,
    children,
    draggable = LIST_ITEM_DEFAULTS.draggable,
    dragHandleSlot,
    checkable = LIST_ITEM_DEFAULTS.checkable,
    checked = LIST_ITEM_DEFAULTS.checked,
    onCheck,
    showThumbnail = LIST_ITEM_DEFAULTS.showThumbnail,
    layout = LIST_ITEM_DEFAULTS.layout
  }: ListItemProps = $props();
</script>

<div
  class="list-item"
  class:list-item--clickable={!!onClick}
  class:list-item--has-footer={!!footer}
  class:list-item--checked={checkable && checked}
  class:list-item--column={layout === 'column'}
  onclick={() => handleClick(onClick)}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
>
  <div class="list-item__main">
    <!-- Drag handle (if draggable) -->
    {#if draggable && dragHandleSlot}
      <div class="list-item__drag-handle">
        {@render dragHandleSlot()}
      </div>
    {/if}

    <!-- Checkbox (if checkable) -->
    {#if checkable}
      <div class="list-item__checkbox">
        <input
          type="checkbox"
          {checked}
          onchange={(e) => handleCheck(e, onCheck)}
        />
      </div>
    {/if}

    <!-- Thumbnail -->
    {#if showThumbnail}
      <div class="list-item__thumbnail">
        {#if imageUrl}
          <img src={imageUrl} alt={title} class="list-item__image" />
        {:else if imagePlaceholder}
          <div class="list-item__placeholder">
            {@render imagePlaceholder()}
          </div>
        {:else}
          <div class="list-item__placeholder-icon">
            <FileText size={24} />
          </div>
        {/if}
      </div>
    {/if}

    <!-- Content -->
    <div class="list-item__content">
      {#if children}
        {@render children()}
      {:else}
        <h3 class="list-item__title">{title}</h3>
        {#if subtitle}
          <p class="list-item__subtitle">{subtitle}</p>
        {/if}
        {#if metadata.length > 0}
          <div class="list-item__metadata">
            {#each metadata.slice(0, LIST_ITEM_METADATA_LIMIT) as item}
              <span class="list-item__badge">{item}</span>
            {/each}
            {#if metadata.length > LIST_ITEM_METADATA_LIMIT}
              <span class="list-item__badge">+{metadata.length - LIST_ITEM_METADATA_LIMIT}</span>
            {/if}
          </div>
        {/if}
      {/if}
    </div>

    <!-- Badge and Actions side column -->
    {#if badge || onEdit || onDelete}
      <div class="list-item__side">
        <!-- Badge -->
        {#if badge}
          <div class="list-item__badge-slot">
            {@render badge()}
          </div>
        {/if}

        <!-- Actions -->
        {#if onEdit || onDelete}
          <div class="list-item__actions">
            {#if onEdit}
              <IconButton
                variant="ghost"
                size="medium"
                onclick={(e) => handleEdit(e, onEdit)}
                ariaLabel={LIST_ITEM_ARIA_LABELS.edit}
              >
                <Pencil size={18} />
              </IconButton>
            {/if}
            {#if onDelete}
              <IconButton
                variant="danger"
                size="medium"
                onclick={(e) => handleDelete(e, onDelete)}
                ariaLabel={LIST_ITEM_ARIA_LABELS.delete}
              >
                <Trash2 size={18} />
              </IconButton>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Footer -->
  {#if footer}
    <div class="list-item__footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .list-item {
    display: flex;
    flex-direction: column;
    background: $color-white;
    border: $border-width-base solid $color-border-primary;
    border-radius: $radius-lg;
    transition: all $transition-base $transition-ease;
    min-width: 0; // Permet au list-item de rétrécir dans son conteneur flex parent
    width: 100%;

    &--clickable {
      cursor: pointer;

      &:hover {
        border-color: $brand-primary;
        box-shadow: $shadow-list-item-hover;
        transform: $transform-hover-lift-sm;
      }

      &:focus-visible {
        outline: none;
        border-color: $brand-primary;
        box-shadow: $shadow-list-item-focus;
      }
    }

    &--checked {
      opacity: $opacity-60;
      background: $color-gray-50;

      .list-item__title,
      .list-item__content {
        text-decoration: line-through;
        color: $color-text-tertiary;
      }
    }

    &--column {
      .list-item__main {
        flex-direction: column;
        align-items: stretch;
      }

      .list-item__side {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        align-self: stretch;
      }
    }
  }

  .list-item__main {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-md;
    min-width: 0; // Permet au conteneur de rétrécir
    width: 100%;

    @media (min-width: $breakpoint-sm) {
      padding: $spacing-base;
    }
  }

  .list-item__drag-handle {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: $color-text-tertiary;
    padding: $spacing-xs;

    &:active {
      cursor: grabbing;
    }
  }

  .list-item__checkbox {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    input[type="checkbox"] {
      width: $list-item-checkbox-size;
      height: $list-item-checkbox-size;
      cursor: pointer;
      accent-color: $brand-primary;
    }
  }

  .list-item__thumbnail {
    flex-shrink: 0;
    max-width: $list-item-thumbnail-max-width-sm;
    max-height: $list-item-thumbnail-max-height-sm;
    border-radius: $radius-lg;
    overflow: visible;
    background: $color-primary-alpha-10;
    display: flex;
    align-items: center;
    justify-content: center;
    

    @media (min-width: $breakpoint-sm) {
      max-width: $list-item-thumbnail-max-width;
      max-height: $list-item-thumbnail-max-height;
    }
  }

  .list-item__image {
    max-width: $list-item-image-max-width-sm;
    max-height: $list-item-image-max-height-sm;
    width: auto;
    height: auto;
    object-fit: contain;

    @media (min-width: $breakpoint-sm) {
      max-width: $list-item-image-max-width;
      max-height: $list-item-image-max-height;
    }
  }

  .list-item__placeholder,
  .list-item__placeholder-icon {
    font-size: $font-size-xl;
    color: $brand-primary;

    @media (min-width: $breakpoint-sm) {
      font-size: $font-size-2xl;
    }
  }

  .list-item__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .list-item__title {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: $line-height-normal;
    min-height: $list-item-title-min-height;

    @media (min-width: $breakpoint-sm) {
      font-size: $font-size-base;
    }
  }

  .list-item__subtitle {
    margin: 0;
    font-size: $font-size-xs;
    color: $color-text-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (min-width: $breakpoint-sm) {
      font-size: $font-size-sm;
    }
  }

  .list-item__metadata {
    display: flex;
    flex-wrap: nowrap;
    gap: $spacing-sm;
    overflow: hidden;
  }

  .list-item__badge {
    padding: $spacing-xs $spacing-sm;
    background: $color-primary-alpha-10;
    color: $brand-primary;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
    white-space: nowrap;
  }

  .list-item__side {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-sm;
    justify-content: flex-start;
  }

  .list-item__badge-slot {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .list-item__actions {
    display: flex;
    gap: $spacing-xs;
    flex-shrink: 0;

    @media (min-width: $breakpoint-sm) {
      gap: $spacing-sm;
    }
  }

  .list-item__footer {
    display: flex;
    padding: $spacing-sm $spacing-md $spacing-md $spacing-md;
    border-top: $border-width-thin solid $color-border-primary;
    width: 100%;

    @media (min-width: $breakpoint-sm) {
      padding: $spacing-sm $spacing-base $spacing-base $spacing-base;
    }
  }
</style>
