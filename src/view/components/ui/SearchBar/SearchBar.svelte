<script lang="ts">
  import { Search, X } from 'lucide-svelte';
  import IconButton from '../IconButton/IconButton.svelte';
  import { SEARCH_BAR_DEFAULTS, SEARCH_BAR_ICON_SIZES, SEARCH_BAR_CLEAR_BUTTON } from './SearchBar.config';

  interface Props {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    oninput?: (e: Event) => void;
  }

  let {
    value = $bindable(SEARCH_BAR_DEFAULTS.value),
    placeholder = SEARCH_BAR_DEFAULTS.placeholder,
    disabled = SEARCH_BAR_DEFAULTS.disabled,
    oninput
  }: Props = $props();
</script>

<div class="search-bar">
  <Search class="search-bar__icon" size={SEARCH_BAR_ICON_SIZES.search} />
  <input
    type="text"
    class="search-bar__input"
    {placeholder}
    {disabled}
    bind:value
    {oninput}
  />
  {#if value}
    <div class="search-bar__clear-wrapper">
      <IconButton
        variant="primary"
        size="small"
        onclick={() => value = ''}
        ariaLabel={SEARCH_BAR_CLEAR_BUTTON.ariaLabel}
      >
        <X size={SEARCH_BAR_ICON_SIZES.clear} />
      </IconButton>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

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
    padding: $spacing-sm $spacing-base;
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

  .search-bar__clear-wrapper {
    margin-right: $spacing-sm;
    flex-shrink: 0;
  }
</style>
