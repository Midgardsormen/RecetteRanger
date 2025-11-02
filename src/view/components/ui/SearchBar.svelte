<script lang="ts">
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
  <div class="search-bar__icon">🔍</div>
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
      ✕
    </button>
  {/if}
</div>

<style lang="scss">
  $primary-color: #667eea;
  $white: #fff;
  $text-dark: #333;
  $text-light: #999;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 12px;
    transition: all 0.2s;

    &:focus-within {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .search-bar__icon {
    padding-left: $spacing-base;
    font-size: 1.2rem;
    color: $text-light;
    pointer-events: none;
  }

  .search-bar__input {
    flex: 1;
    padding: $spacing-base * 0.75 $spacing-base;
    border: none;
    background: transparent;
    font-size: 1rem;
    font-family: inherit;
    color: $text-dark;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $text-light;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .search-bar__clear {
    padding: $spacing-base * 0.5;
    margin-right: $spacing-base * 0.5;
    border: none;
    background: rgba(102, 126, 234, 0.1);
    color: $primary-color;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 1.2rem;
    line-height: 1;

    &:hover {
      background: rgba(102, 126, 234, 0.2);
    }
  }
</style>
