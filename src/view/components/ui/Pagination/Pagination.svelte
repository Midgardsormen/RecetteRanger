<script lang="ts">
  import IconButton from '../IconButton/IconButton.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { getPageRange, hasPreviousPage, hasNextPage } from '../../../utils/pagination.utils';

  interface Props {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemLabel?: string; // 'article', 'recette', 'menu', etc.
    maxVisible?: number; // Nombre maximum de boutons visibles (défaut: 3)
    onPageChange: (page: number) => void;
  }

  let {
    currentPage,
    totalPages,
    totalItems,
    itemLabel = 'élément',
    maxVisible = 3,
    onPageChange,
  }: Props = $props();

  // Calculer la plage de pages à afficher
  const pageRange = $derived(getPageRange(currentPage, totalPages, maxVisible));

  function handlePrevious() {
    if (hasPreviousPage(currentPage)) {
      onPageChange(currentPage - 1);
    }
  }

  function handleNext() {
    if (hasNextPage(currentPage, totalPages)) {
      onPageChange(currentPage + 1);
    }
  }

  function handleGoToPage(page: number) {
    if (page >= 0 && page < totalPages) {
      onPageChange(page);
    }
  }
</script>

{#if totalPages > 1}
  <div class="pagination">
    <IconButton
      variant="secondary"
      size="medium"
      onclick={handlePrevious}
      disabled={!hasPreviousPage(currentPage)}
      ariaLabel="Page précédente"
    >
      <ChevronLeft size={20} />
    </IconButton>

    <div class="pagination__pages">
      {#each pageRange as pageItem, index (pageItem.type === 'page' ? pageItem.value : `ellipsis-${index}`)}
        {#if pageItem.type === 'ellipsis'}
          <span class="pagination__ellipsis">{pageItem.display}</span>
        {:else}
          <button
            class="pagination__page"
            class:pagination__page--active={pageItem.value === currentPage}
            onclick={() => handleGoToPage(pageItem.value!)}
            aria-label="Page {pageItem.display}"
            aria-current={pageItem.value === currentPage ? 'page' : undefined}
          >
            {pageItem.display}
          </button>
        {/if}
      {/each}
    </div>

    <IconButton
      variant="secondary"
      size="medium"
      onclick={handleNext}
      disabled={!hasNextPage(currentPage, totalPages)}
      ariaLabel="Page suivante"
    >
      <ChevronRight size={20} />
    </IconButton>
  </div>

  {#if totalItems !== undefined}
    <p class="pagination__info">
      Page {currentPage + 1} sur {totalPages} • {totalItems} {itemLabel}{totalItems > 1 ? 's' : ''}
    </p>
  {/if}
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $spacing-base;
    margin-top: $spacing-xl;
  }

  .pagination__pages {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  .pagination__ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 40px;
    color: $color-text-tertiary;
    font-weight: $font-weight-bold;
    user-select: none;
    font-size: $font-size-sm;
  }

  .pagination__page {
    width: 40px;
    height: 40px;
    border: 2px solid $color-border-primary;
    background: $color-white;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    font-weight: $font-weight-medium;
    color: $color-text-primary;

    &:hover:not(:disabled) {
      border-color: $brand-primary;
      color: $brand-primary;
    }

    &--active {
      @include brand-gradient-primary;
      color: $color-white;
      border-color: transparent;

      &:hover {
        @include brand-gradient-primary;
      }
    }
  }

  .pagination__info {
    text-align: center;
    color: $color-text-secondary;
    font-size: $font-size-sm;
    margin-top: $spacing-md;
  }
</style>
