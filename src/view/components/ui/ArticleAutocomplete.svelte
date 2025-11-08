<script lang="ts">
  import { apiService } from '../../services/api.service';
  import { Input } from './form';

  interface Article {
    id: string;
    label: string;
    aisle: string;
    units: string[];
    isFood: boolean;
  }

  interface Props {
    id: string;
    label?: string;
    placeholder?: string;
    value?: string;
    isFood?: boolean; // Filtre: true = alimentaire only, false = non-alimentaire only, undefined = tous
    onSelect: (article: Article | null) => void;
    onCreate?: (label: string, isFood: boolean) => Promise<void>;
    allowCreate?: boolean;
  }

  let {
    id,
    label = '',
    placeholder = 'Rechercher un article...',
    value = $bindable(''),
    isFood,
    onSelect,
    onCreate,
    allowCreate = false
  }: Props = $props();

  let suggestions = $state<Article[]>([]);
  let showSuggestions = $state(false);
  let loading = $state(false);
  let selectedIndex = $state(-1);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function searchArticles(query: string) {
    if (!query || query.length < 2) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    loading = true;
    try {
      const result = await apiService.searchIngredients({
        search: query,
        limit: 10,
        isFood: isFood
      });

      suggestions = result.data;
      showSuggestions = true;
      selectedIndex = -1;
    } catch (err) {
      console.error('Erreur recherche articles:', err);
      suggestions = [];
    } finally {
      loading = false;
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Debounce search
    debounceTimer = setTimeout(() => {
      searchArticles(value);
    }, 300);
  }

  function selectArticle(article: Article) {
    value = article.label;
    showSuggestions = false;
    suggestions = [];
    onSelect(article);
  }

  async function handleCreateNew() {
    if (!allowCreate || !onCreate || !value.trim()) return;

    const createAsFood = isFood !== undefined ? isFood : true;
    await onCreate(value.trim(), createAsFood);

    showSuggestions = false;
    suggestions = [];
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1 + (allowCreate ? 1 : 0));
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectArticle(suggestions[selectedIndex]);
        } else if (allowCreate && selectedIndex === suggestions.length) {
          handleCreateNew();
        }
        break;
      case 'Escape':
        showSuggestions = false;
        selectedIndex = -1;
        break;
    }
  }

  function handleBlur() {
    // Delay to allow click on suggestion
    setTimeout(() => {
      showSuggestions = false;
      selectedIndex = -1;
    }, 200);
  }

  function handleFocus() {
    if (value.length >= 2) {
      searchArticles(value);
    }
  }
</script>

<div class="article-autocomplete">
  {#if label}
    <label for={id} class="label">{label}</label>
  {/if}

  <div class="autocomplete-wrapper">
    <Input
      {id}
      type="text"
      {placeholder}
      {value}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onblur={handleBlur}
      onfocus={handleFocus}
      autocomplete="off"
    />

    {#if showSuggestions && (suggestions.length > 0 || (allowCreate && value.trim()))}
      <div class="suggestions-dropdown">
        {#each suggestions as article, index}
          <button
            type="button"
            class="suggestion-item"
            class:selected={index === selectedIndex}
            onclick={() => selectArticle(article)}
          >
            <span class="suggestion-label">{article.label}</span>
            <span class="suggestion-aisle">{article.aisle}</span>
          </button>
        {/each}

        {#if allowCreate && value.trim() && !suggestions.find(s => s.label.toLowerCase() === value.toLowerCase())}
          <button
            type="button"
            class="suggestion-item create-new"
            class:selected={selectedIndex === suggestions.length}
            onclick={handleCreateNew}
          >
            <span class="create-icon">+</span>
            <span class="suggestion-label">Créer "{value}"</span>
          </button>
        {/if}
      </div>
    {/if}

    {#if loading}
      <div class="loading-indicator">
        <span class="spinner"></span>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .article-autocomplete {
    position: relative;
    width: 100%;
  }

  .label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-color);
  }

  .autocomplete-wrapper {
    position: relative;
  }

  .suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
  }

  .suggestion-item {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: white;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s;

    &:hover,
    &.selected {
      background: #f3f4f6;
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    &:last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    .suggestion-label {
      flex: 1;
      font-size: 0.95rem;
      color: var(--text-color);
    }

    .suggestion-aisle {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    &.create-new {
      border-top: 1px solid var(--border-color);
      color: var(--primary-color);
      font-weight: 500;

      .create-icon {
        font-size: 1.2rem;
        font-weight: bold;
      }
    }
  }

  .loading-indicator {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid var(--border-color);
      border-top-color: var(--primary-color);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
