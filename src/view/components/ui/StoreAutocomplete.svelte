<script lang="ts">
  import { apiService } from '../../services/api.service';

  interface Store {
    id: string;
    name: string;
    logoUrl?: string | null;
    color?: string | null;
  }

  interface Props {
    id?: string;
    value?: string;
    placeholder?: string;
    onSelect?: (store: Store | null) => void;
    onCreateNew?: (searchValue: string) => void;
    disabled?: boolean;
  }

  let {
    id = 'store-autocomplete',
    value = $bindable(''),
    placeholder = 'Sélectionnez une enseigne...',
    onSelect,
    onCreateNew,
    disabled = false
  }: Props = $props();

  let searchResults = $state<Store[]>([]);
  let showDropdown = $state(false);
  let searchTimeout: ReturnType<typeof setTimeout>;
  let selectedStore = $state<Store | null>(null);
  let searching = $state(false);

  async function searchStores() {
    if (value.length < 1) {
      searchResults = [];
      showDropdown = false;
      return;
    }

    searching = true;
    try {
      const result = await apiService.searchStores({
        search: value,
        limit: 10,
      });
      searchResults = result.stores || [];
      // Afficher le dropdown même si aucun résultat (pour proposer de créer)
      showDropdown = true;
    } catch (err) {
      console.error('Erreur lors de la recherche d\'enseignes:', err);
      searchResults = [];
      showDropdown = true;
    } finally {
      searching = false;
    }
  }

  function handleInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchStores();
    }, 300);
  }

  function handleFocus() {
    // Au focus, rechercher si on a une valeur
    if (value.length > 0) {
      searchStores();
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
    // Petit délai pour permettre le clic sur un résultat
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  }

  function handleCreateNew() {
    showDropdown = false;
    onCreateNew?.(value);
  }
</script>

<div class="store-autocomplete">
  <div class="input-wrapper">
    <input
      {id}
      type="text"
      class="store-input"
      bind:value
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      {placeholder}
      {disabled}
      autocomplete="off"
    />

    {#if value && value.length > 0}
      <button
        type="button"
        class="clear-btn"
        onclick={clearSelection}
        title="Retirer l'enseigne"
      >
        ✕
      </button>
    {/if}

    {#if searching}
      <div class="loading-indicator">⏳</div>
    {/if}
  </div>

  {#if showDropdown}
    <div class="dropdown">
      {#if searchResults.length > 0}
        <ul class="results-list">
          {#each searchResults as store}
            <li class="result-item">
              <button
                type="button"
                class="result-button"
                onclick={() => selectStore(store)}
              >
                <div class="store-info">
                  {#if store.logoUrl}
                    <img src={store.logoUrl} alt={store.name} class="store-logo" />
                  {:else}
                    <div class="store-placeholder" style="background: {store.color || '#667eea'}">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  {/if}
                  <span class="store-name">{store.name}</span>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      {/if}

      {#if !searching && searchResults.length === 0 && onCreateNew && value.length > 0}
        <div class="no-results">
          <p class="no-results-text">Aucune enseigne trouvée pour "{value}"</p>
          <button
            type="button"
            class="create-button"
            onclick={handleCreateNew}
          >
            ➕ Créer l'enseigne "{value}"
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  $primary-color: #667eea;
  $border-color: #e0e0e0;
  $white: #fff;
  $text-dark: #333;
  $shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .store-autocomplete {
    position: relative;
    width: 100%;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .store-input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    border: 2px solid $border-color;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: $primary-color;
    }

    &:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }
  }

  .clear-btn {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #999;
    padding: 0.25rem;
    transition: color 0.2s;

    &:hover {
      color: $text-dark;
    }
  }

  .loading-indicator {
    position: absolute;
    right: 0.75rem;
    font-size: 1rem;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: $white;
    border: 2px solid $border-color;
    border-radius: 8px;
    box-shadow: $shadow;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
  }

  .results-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .result-item {
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }
  }

  .result-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s;

    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }
  }

  .store-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .store-logo {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 4px;
  }

  .store-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $white;
    font-weight: bold;
  }

  .store-placeholder-remove {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    color: #dc2626;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .result-item--remove {
    border-bottom: 2px solid $border-color;
  }

  .result-button--remove {
    &:hover {
      background: rgba(220, 38, 38, 0.05);
    }

    .store-name {
      color: #666;
      font-style: italic;
    }
  }

  .store-name {
    font-size: 1rem;
    color: $text-dark;
  }

  .no-results {
    padding: 1rem;
    text-align: center;
  }

  .no-results-text {
    margin: 0 0 0.75rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .create-button {
    width: 100%;
    padding: 0.75rem 1rem;
    background: linear-gradient(135deg, $primary-color 0%, #764ba2 100%);
    color: $white;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
</style>
