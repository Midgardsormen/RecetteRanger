<script lang="ts">
  import type { StoreAutocompleteProps, Store } from '../../../types/ui.types';
  import IconButton from '../IconButton/IconButton.svelte';
  import Spinner from '../Spinner/Spinner.svelte';
  import Button from '../Button.svelte';
  import { X, Plus } from 'lucide-svelte';
  import { searchStores as searchStoresAction, getStoreInitial } from './StoreAutocomplete.actions';
  import {
    STORE_AUTOCOMPLETE_DEFAULTS,
    STORE_AUTOCOMPLETE_SEARCH,
    STORE_AUTOCOMPLETE_UI,
    STORE_AUTOCOMPLETE_MESSAGES
  } from './StoreAutocomplete.config';

  let {
    id = STORE_AUTOCOMPLETE_DEFAULTS.id,
    value = $bindable(STORE_AUTOCOMPLETE_DEFAULTS.value),
    placeholder = STORE_AUTOCOMPLETE_DEFAULTS.placeholder,
    onSelect,
    onCreateNew,
    disabled = STORE_AUTOCOMPLETE_DEFAULTS.disabled
  }: StoreAutocompleteProps = $props();

  let searchResults = $state<Store[]>([]);
  let showDropdown = $state(false);
  let searchTimeout: ReturnType<typeof setTimeout>;
  let selectedStore = $state<Store | null>(null);
  let searching = $state(false);

  async function handleSearch() {
    if (value.length < STORE_AUTOCOMPLETE_SEARCH.minSearchLength) {
      searchResults = [];
      showDropdown = false;
      return;
    }

    searching = true;
    try {
      searchResults = await searchStoresAction(value);
      showDropdown = true;
    } catch (err) {
      searchResults = [];
      showDropdown = true;
    } finally {
      searching = false;
    }
  }

  function handleInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleSearch();
    }, STORE_AUTOCOMPLETE_SEARCH.debounceDelay);
  }

  function handleFocus() {
    if (value.length > 0) {
      handleSearch();
    }
  }

  function selectStore(store: Store) {
    selectedStore = store;
    value = store.name;
    showDropdown = false;
    searchResults = [];
    onSelect?.(store);
  }

  function clearSelection() {
    selectedStore = null;
    value = '';
    searchResults = [];
    onSelect?.(null);
  }

  function handleBlur() {
    setTimeout(() => {
      showDropdown = false;
    }, STORE_AUTOCOMPLETE_SEARCH.blurDelay);
  }

  function handleCreateNew() {
    showDropdown = false;
    onCreateNew?.(value);
  }
</script>

<div class="store-autocomplete">
  <div class="store-autocomplete__input-wrapper">
    <input
      {id}
      type="text"
      class="store-autocomplete__input"
      bind:value
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      {placeholder}
      {disabled}
      autocomplete="off"
    />

    {#if value && value.length > 0}
      <div class="store-autocomplete__clear">
        <IconButton
          variant="ghost"
          size="small"
          onclick={clearSelection}
          ariaLabel={STORE_AUTOCOMPLETE_MESSAGES.clearButton}
        >
          <X size={18} />
        </IconButton>
      </div>
    {/if}

    {#if searching}
      <div class="store-autocomplete__spinner">
        <Spinner size="sm" variant="primary" />
      </div>
    {/if}
  </div>

  {#if showDropdown}
    <div class="store-autocomplete__dropdown">
      {#if searchResults.length > 0}
        <ul class="store-autocomplete__results">
          {#each searchResults as store}
            <li class="store-autocomplete__result-item">
              <button
                type="button"
                class="store-autocomplete__result-button"
                onclick={() => selectStore(store)}
              >
                <div class="store-autocomplete__store-info">
                  {#if store.logoUrl}
                    <img
                      src={store.logoUrl}
                      alt={store.name}
                      class="store-autocomplete__store-logo"
                    />
                  {:else}
                    <div
                      class="store-autocomplete__store-placeholder"
                      style:background-color={store.color || 'var(--brand-primary)'}
                    >
                      {getStoreInitial(store.name)}
                    </div>
                  {/if}
                  <span class="store-autocomplete__store-name">{store.name}</span>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      {/if}

      {#if !searching && searchResults.length === 0 && onCreateNew && value.length > 0}
        <div class="store-autocomplete__no-results">
          <p class="store-autocomplete__no-results-text">
            {STORE_AUTOCOMPLETE_MESSAGES.noResults(value)}
          </p>
          <Button
            variant="primary"
            size="medium"
            fullWidth
            onclick={handleCreateNew}
          >
            <Plus size={16} />
            {STORE_AUTOCOMPLETE_MESSAGES.createNew(value)}
          </Button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .store-autocomplete {
    position: relative;
    width: 100%;

    &__input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    &__input {
      width: 100%;
      padding: $spacing-md $spacing-3xl $spacing-md $spacing-base;
      border: $border-width-base solid $color-border-primary;
      border-radius: $radius-lg;
      font-size: $font-size-base;
      font-family: inherit;
      color: $color-text-primary;
      background: $color-white;
      transition: border-color $transition-slow $transition-ease;

      &:focus {
        outline: none;
        border-color: $brand-primary;
        box-shadow: $shadow-focus-primary;
      }

      &::placeholder {
        color: $color-input-placeholder;
      }

      &:disabled {
        background: $color-input-disabled-background;
        cursor: not-allowed;
        opacity: $opacity-60;
      }
    }

    &__clear {
      position: absolute;
      right: $spacing-md;
    }

    &__spinner {
      position: absolute;
      right: $spacing-md;
    }

    &__dropdown {
      position: absolute;
      top: calc(100% + $spacing-sm);
      left: 0;
      right: 0;
      background: $color-white;
      border: $border-width-base solid $color-border-primary;
      border-radius: $radius-lg;
      box-shadow: $shadow-dropdown;
      max-height: 300px;
      overflow-y: auto;
      z-index: $z-index-dropdown;
    }

    &__results {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    &__result-item {
      border-bottom: $border-width-thin solid $color-border-primary;

      &:last-child {
        border-bottom: none;
      }
    }

    &__result-button {
      width: 100%;
      padding: $spacing-md $spacing-base;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background $transition-base $transition-ease;

      &:hover {
        background: $color-primary-alpha-10;
      }
    }

    &__store-info {
      display: flex;
      align-items: center;
      gap: $spacing-md;
    }

    &__store-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
      border-radius: $radius-sm;
      flex-shrink: 0;
    }

    &__store-placeholder {
      width: 32px;
      height: 32px;
      border-radius: $radius-sm;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-white;
      font-weight: $font-weight-bold;
      flex-shrink: 0;
    }

    &__store-name {
      font-size: $font-size-base;
      color: $color-text-primary;
    }

    &__no-results {
      padding: $spacing-base;
      text-align: center;
    }

    &__no-results-text {
      margin: 0 0 $spacing-md 0;
      color: $color-text-secondary;
      font-size: $font-size-sm;
    }
  }
</style>
