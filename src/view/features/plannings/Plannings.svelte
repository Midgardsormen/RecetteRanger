<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';

  let { plannings = [], user = null }: { plannings?: any[], user?: any } = $props();
</script>

<Layout title="Mes plannings" currentPage="/plannings" {user}>
<div id="plannings" class="plannings">
  <header class="plannings__header">
    <h1 class="plannings__title">📅 Mes plannings</h1>
    <button class="plannings__btn">+ Créer un planning</button>
  </header>

  {#if plannings.length === 0}
    <div class="plannings__empty">
      <div class="plannings__empty-icon">📅</div>
      <h2 class="plannings__empty-title">Aucun planning pour le moment</h2>
      <p class="plannings__empty-text">Planifiez vos repas de la semaine pour mieux vous organiser!</p>
      <button class="plannings__btn">Créer mon premier planning</button>
    </div>
  {:else}
    <div class="plannings__grid">
      {#each plannings as planning}
        <div class="plannings__card">
          <h3>{planning.nom}</h3>
          <p>{planning.description}</p>
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

  // Block: plannings
  .plannings {
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
