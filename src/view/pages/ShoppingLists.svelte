<script lang="ts">
  import Layout from '../layouts/Layout.svelte';

  let { listes = [] }: { listes?: any[] } = $props();
</script>

<Layout title="Shopping Lists" currentPage="/shopping-lists">
  <div class="shopping-lists">
    <header class="shopping-lists__header">
      <h1 class="shopping-lists__title">🛒 Shopping Lists</h1>
      <button class="shopping-lists__btn">+ New List</button>
    </header>

    {#if listes.length === 0}
      <div class="shopping-lists__empty">
        <div class="shopping-lists__empty-icon">🛒</div>
        <h2 class="shopping-lists__empty-title">No shopping lists</h2>
        <p class="shopping-lists__empty-text">Create your shopping lists to never forget anything when shopping!</p>
        <button class="shopping-lists__btn">Create my first list</button>
      </div>
    {:else}
      <div class="shopping-lists__grid">
        {#each listes as liste}
          <div class="shopping-lists__card">
            <h3>{liste.nom}</h3>
            <p>{liste.description}</p>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</Layout>

<style lang="scss">
  // Variables
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $shadow-primary: rgba(102, 126, 234, 0.3);
  $shadow-light: rgba(0, 0, 0, 0.08);
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;
  $transition-duration: 0.3s;

  // Block: shopping-lists
  .shopping-lists {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

    // Element: header
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-base;
    }

    // Element: title
    &__title {
      margin: 0;
      color: $text-dark;
      font-size: 2rem;

      @media (max-width: $breakpoint-mobile) {
        font-size: 1.5rem;
      }
    }

    // Element: btn
    &__btn {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;
      border: none;
      padding: $spacing-base * 0.75 $spacing-base * 1.5;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all $transition-duration ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px $shadow-primary;
      }
    }

    // Element: empty
    &__empty {
      text-align: center;
      padding: $spacing-base * 4 $spacing-base * 2;
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 12px $shadow-light;
    }

    // Element: empty-icon
    &__empty-icon {
      font-size: 4rem;
      margin-bottom: $spacing-base;
    }

    // Element: empty-title
    &__empty-title {
      color: $text-dark;
      margin: 0 0 $spacing-base * 0.5 0;
    }

    // Element: empty-text
    &__empty-text {
      color: $text-gray;
      margin: 0 0 $spacing-base * 2 0;
    }
  }
</style>
