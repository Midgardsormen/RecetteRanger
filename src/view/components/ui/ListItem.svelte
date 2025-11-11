<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    imageUrl?: string;
    imagePlaceholder?: string;
    title: string;
    subtitle?: string;
    metadata?: string[];
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
  onclick={handleClick}
  role={onClick ? 'button' : undefined}
  tabindex={onClick ? 0 : undefined}
>
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

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $text-light: #999;
  $border-color: #e0e0e0;
  $shadow-light: rgba(0, 0, 0, 0.08);
  $spacing-base: 1rem;
  $transition-duration: 0.3s;

  .list-item {
    display: flex;
    align-items: center;
    gap: $spacing-base;
    padding: $spacing-base;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 12px;
    transition: all $transition-duration ease;

    &--clickable {
      cursor: pointer;

      &:hover {
        border-color: $primary-color;
        box-shadow: 0 4px 12px $shadow-light;
        transform: translateY(-2px);
      }

      &:focus-visible {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
      }
    }
  }

  .list-item__thumbnail {
    flex-shrink: 0;
    max-width: 150px;
    max-height: 65px;
    border-radius: 8px;
    overflow: visible;
    background: rgba(102, 126, 234, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  .list-item__image {
    max-width: 150px;
    max-height: 50px;
    width: auto;
    height: auto;
    object-fit: contain;
  }

  .list-item__placeholder {
    font-size: 2rem;
  }

  .list-item__content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 0.25;
  }

  .list-item__title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: $text-dark;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.4;
    min-height: 2.8em; // 1.4 line-height * 2 lines
  }

  .list-item__subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: $text-gray;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-item__metadata {
    display: flex;
    flex-wrap: nowrap;
    gap: $spacing-base * 0.375;
    overflow: hidden;
  }

  .list-item__badge {
    padding: $spacing-base * 0.2 $spacing-base * 0.4;
    background: rgba(102, 126, 234, 0.1);
    color: $primary-color;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .list-item__actions {
    flex-shrink: 0;
    display: flex;
    gap: $spacing-base * 0.5;
  }

  .list-item__action {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-size: 1.125rem;
    cursor: pointer;
    transition: all $transition-duration ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px $shadow-light;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }

    &--edit {
      &:hover {
        border-color: $primary-color;
        background: rgba(102, 126, 234, 0.1);
      }
    }

    &--delete {
      &:hover {
        border-color: $danger-color;
        background: rgba(245, 101, 101, 0.1);
      }
    }
  }

  // Responsive
  @media (max-width: 640px) {
    .list-item {
      padding: $spacing-base * 0.75;
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
      font-size: 1.5rem;
    }

    .list-item__title {
      font-size: 0.9rem;
    }

    .list-item__subtitle {
      font-size: 0.8rem;
    }

    .list-item__action {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }
  }
</style>
