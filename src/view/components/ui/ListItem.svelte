<script lang="ts">
  import type { Snippet } from 'svelte';
  import IconButton from './IconButton.svelte';
  import { Pencil, Trash2 } from 'lucide-svelte';

  interface Props {
    imageUrl?: string;
    imagePlaceholder?: string;
    title: string;
    subtitle?: string;
    metadata?: string[];
    badge?: Snippet;
    footer?: Snippet;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    children?: Snippet;
    draggable?: boolean;
    dragHandleSlot?: Snippet;
    checkable?: boolean;
    checked?: boolean;
    onCheck?: (checked: boolean) => void;
    showThumbnail?: boolean;
  }

  let {
    imageUrl,
    imagePlaceholder = '📄',
    title,
    subtitle,
    metadata = [],
    badge,
    footer,
    onEdit,
    onDelete,
    onClick,
    children,
    draggable = false,
    dragHandleSlot,
    checkable = false,
    checked = false,
    onCheck,
    showThumbnail = true
  }: Props = $props();

  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  function handleEdit(e: Event) {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  }

  function handleDelete(e: Event) {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  }

  function handleCheck(e: Event) {
    e.stopPropagation();
    if (onCheck) {
      const target = e.target as HTMLInputElement;
      onCheck(target.checked);
    }
  }
</script>

<div
  class="list-item"
  class:list-item--clickable={!!onClick}
  class:list-item--has-footer={!!footer}
  class:list-item--checked={checkable && checked}
  onclick={handleClick}
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
          onchange={handleCheck}
        />
      </div>
    {/if}

    <!-- Thumbnail -->
    {#if showThumbnail}
      <div class="list-item__thumbnail">
        {#if imageUrl}
          <img src={imageUrl} alt={title} class="list-item__image" />
        {:else}
          <div class="list-item__placeholder">
            {imagePlaceholder}
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
            {#each metadata.slice(0, 5) as item}
              <span class="list-item__badge">{item}</span>
            {/each}
            {#if metadata.length > 5}
              <span class="list-item__badge">+{metadata.length - 5}</span>
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
                onclick={handleEdit}
                ariaLabel="Modifier"
              >
                <Pencil size={18} />
              </IconButton>
            {/if}
            {#if onDelete}
              <IconButton
                variant="danger"
                size="medium"
                onclick={handleDelete}
                ariaLabel="Supprimer"
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
  @use '../../styles/variables' as *;

  .list-item {
    display: flex;
    flex-direction: column;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    transition: all $transition-base ease;

    &--clickable {
      cursor: pointer;

      &:hover {
        border-color: $brand-primary;
        box-shadow: 0 4px 12px $color-black-alpha-08;
        transform: translateY(-2px);
      }

      &:focus-visible {
        outline: none;
        border-color: $brand-primary;
        box-shadow: 0 0 0 3px $color-primary-alpha-20;
      }
    }

    &--checked {
      opacity: 0.6;
      background: $color-gray-50;

      .list-item__title,
      .list-item__content {
        text-decoration: line-through;
        color: $color-text-tertiary;
      }
    }
  }

  .list-item__main {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base;
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
      width: 20px;
      height: 20px;
      cursor: pointer;
      accent-color: $brand-primary;
    }
  }

  .list-item__thumbnail {
    flex-shrink: 0;
    max-width: 150px;
    max-height: 65px;
    border-radius: $radius-lg;
    overflow: visible;
    background: $color-primary-alpha-10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-sm;
  }

  .list-item__image {
    max-width: 150px;
    max-height: 50px;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .list-item__placeholder {
    font-size: $font-size-2xl;
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
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: $line-height-normal;
    min-height: 2.8em; // 1.4 line-height * 2 lines
  }

  .list-item__subtitle {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    gap: $spacing-sm;
  }

  .list-item__footer {
    display: flex;
    padding: $spacing-sm $spacing-base $spacing-base $spacing-base;
    border-top: 1px solid $color-border-primary;
    width: 100%;
  }

  // Responsive
  @media (max-width: $breakpoint-sm) {
    .list-item__main {
      padding: $spacing-md;
    }

    .list-item__thumbnail {
      max-width: 120px;
      max-height: 50px;
    }

    .list-item__image {
      max-width: 120px;
      max-height: 40px;
    }

    .list-item__placeholder {
      font-size: $font-size-xl;
    }

    .list-item__title {
      font-size: $font-size-sm;
    }

    .list-item__subtitle {
      font-size: $font-size-xs;
    }

    .list-item__footer {
      padding: $spacing-sm $spacing-md $spacing-md $spacing-md;
    }
  }
</style>
