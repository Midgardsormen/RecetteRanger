<script lang="ts">
  import type { Snippet } from 'svelte';

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
    children
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
</script>

<div
  class="list-item"
  class:list-item--clickable={!!onClick}
  class:list-item--has-footer={!!footer}
  onclick={handleClick}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
>
  <div class="list-item__main">
    <!-- Thumbnail -->
    <div class="list-item__thumbnail">
      {#if imageUrl}
        <img src={imageUrl} alt={title} class="list-item__image" />
      {:else}
        <div class="list-item__placeholder">
          {imagePlaceholder}
        </div>
      {/if}
    </div>

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
              <button
                class="list-item__action list-item__action--edit"
                onclick={handleEdit}
                title="Modifier"
                type="button"
              >
                ✏️
              </button>
            {/if}
            {#if onDelete}
              <button
                class="list-item__action list-item__action--delete"
                onclick={handleDelete}
                title="Supprimer"
                type="button"
              >
                🗑️
              </button>
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
  }

  .list-item__main {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base;
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

  .list-item__action {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    font-size: $font-size-lg;
    cursor: pointer;
    transition: all $transition-base ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px $color-black-alpha-08;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px $color-primary-alpha-20;
    }

    &--edit {
      &:hover {
        border-color: $brand-primary;
        background: $color-primary-alpha-10;
      }
    }

    &--delete {
      &:hover {
        border-color: $color-danger;
        background: $color-danger-alpha-10;
      }
    }
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

    .list-item__action {
      width: 36px;
      height: 36px;
      font-size: $font-size-base;
    }

    .list-item__footer {
      padding: $spacing-sm $spacing-md $spacing-md $spacing-md;
    }
  }
</style>
