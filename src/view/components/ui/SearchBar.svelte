<script lang="ts">
  import { Search, X } from 'lucide-svelte';

  interface Props {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    oninput?: (e: Event) => void;
  }

  let {
    value = $bindable(''),
    placeholder = 'Rechercher...',
    disabled = false,
    oninput
  }: Props = $props();
</script>

<div class="search-bar">
  <Search class="search-bar__icon" size={20} />
  <input
    type="text"
    class="search-bar__input"
    {placeholder}
    {disabled}
    bind:value
    {oninput}
  />
  {#if value}
    <button
      type="button"
      class="search-bar__clear"
      onclick={() => value = ''}
      aria-label="Effacer la recherche"
    >
      <X size={18} />
    </button>
  {/if}
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-xl;
    transition: all $transition-base $transition-ease;

    &:focus-within {
      border-color: $brand-primary;
      box-shadow: $shadow-focus-primary;
    }
  }

  :global(.search-bar__icon) {
    margin-left: $spacing-base;
    color: $color-text-tertiary;
    pointer-events: none;
    flex-shrink: 0;
  }

  .search-bar__input {
    flex: 1;
    padding: $spacing-md $spacing-base;
    border: none;
    background: transparent;
    font-size: $font-size-base;
    font-family: inherit;
    color: $color-text-primary;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $color-input-placeholder;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .search-bar__clear {
    padding: $spacing-xs;
    margin-right: $spacing-sm;
    border: none;
    background: rgba($brand-primary, 0.1);
    color: $brand-primary;
    border-radius: $radius-full;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    flex-shrink: 0;

    &:hover {
      background: rgba($brand-primary, 0.2);
    }

    :global(svg) {
      flex-shrink: 0;
    }
  }
</style>
