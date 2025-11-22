<script lang="ts">
  import { Input } from '../form';
  import { Spinner } from '../';
  import { searchArticles, handleKeyNavigation } from './actions';
  import { AUTOCOMPLETE_CONFIG } from './config';
  import { isValueInSuggestions, getMaxIndex, isCreateIndex } from '../../../utils';
  import type { ArticleAutocompleteProps, Article } from '../../../types';

  let {
    id,
    label = '',
    placeholder = 'Rechercher un article...',
    value = $bindable(''),
    isFood,
    onSelect,
    onCreate,
    allowCreate = false
  }: ArticleAutocompleteProps = $props();

  let suggestions = $state<Article[]>([]);
  let showSuggestions = $state(false);
  let loading = $state(false);
  let selectedIndex = $state(-1);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function performSearch(query: string) {
    if (!query || query.length < AUTOCOMPLETE_CONFIG.MIN_QUERY_LENGTH) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    loading = true;
    try {
      suggestions = await searchArticles(query, isFood);
      showSuggestions = true;
      selectedIndex = -1;
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
      performSearch(value);
    }, AUTOCOMPLETE_CONFIG.DEBOUNCE_DELAY);
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

    const maxIndex = getMaxIndex(suggestions.length, allowCreate);
    const newIndex = handleKeyNavigation(event, selectedIndex, maxIndex);

    if (newIndex !== selectedIndex) {
      selectedIndex = newIndex;
      return;
    }

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectArticle(suggestions[selectedIndex]);
        } else if (allowCreate && isCreateIndex(selectedIndex, suggestions.length)) {
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
    }, AUTOCOMPLETE_CONFIG.BLUR_DELAY);
  }

  function handleFocus() {
    if (value.length >= AUTOCOMPLETE_CONFIG.MIN_QUERY_LENGTH) {
      performSearch(value);
    }
  }

  const showCreateOption = $derived(
    allowCreate && value.trim() && !isValueInSuggestions(value, suggestions)
  );
</script>

<div class="article-autocomplete">
  {#if label}
    <label for={id} class="article-autocomplete__label">{label}</label>
  {/if}

  <div class="article-autocomplete__wrapper">
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

    {#if showSuggestions && (suggestions.length > 0 || showCreateOption)}
      <div class="article-autocomplete__dropdown">
        {#each suggestions as article, index}
          <button
            type="button"
            class="article-autocomplete__item"
            class:article-autocomplete__item--selected={index === selectedIndex}
            onclick={() => selectArticle(article)}
          >
            <span class="article-autocomplete__item-label">{article.label}</span>
            <span class="article-autocomplete__item-aisle">{article.aisle}</span>
          </button>
        {/each}

        {#if showCreateOption}
          <button
            type="button"
            class="article-autocomplete__item article-autocomplete__item--create"
            class:article-autocomplete__item--selected={selectedIndex === suggestions.length}
            onclick={handleCreateNew}
          >
            <span class="article-autocomplete__create-icon">+</span>
            <span class="article-autocomplete__item-label">Créer "{value}"</span>
          </button>
        {/if}
      </div>
    {/if}

    {#if loading}
      <div class="article-autocomplete__loading">
        <Spinner size="sm" />
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .article-autocomplete {
    position: relative;
    width: 100%;

    &__label {
      display: block;
      margin-bottom: $spacing-sm;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
    }

    &__wrapper {
      position: relative;
    }

    &__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: $spacing-xs;
      background: $color-white;
      border: 2px solid $color-border-primary;
      border-radius: $radius-md;
      box-shadow: $shadow-md;
      max-height: 250px;
      overflow-y: auto;
      z-index: $z-index-dropdown;

      @media (min-width: $breakpoint-md) {
        max-height: 300px;
      }
    }

    &__item {
      width: 100%;
      padding: $spacing-md $spacing-base;
      border: none;
      background: $color-white;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      transition: background $transition-base $transition-ease;

      &:hover,
      &--selected {
        background: $color-gray-50;
      }

      &:first-child {
        border-top-left-radius: $radius-md;
        border-top-right-radius: $radius-md;
      }

      &:last-child {
        border-bottom-left-radius: $radius-md;
        border-bottom-right-radius: $radius-md;
      }

      &-label {
        flex: 1;
        font-size: $font-size-sm;
        color: $color-text-primary;
      }

      &-aisle {
        font-size: $font-size-xs;
        color: $color-text-secondary;
      }

      &--create {
        border-top: 2px solid $color-border-primary;
        color: $brand-primary;
        font-weight: $font-weight-medium;
      }
    }

    &__create-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }

    &__loading {
      position: absolute;
      right: $spacing-base;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
  }
</style>
