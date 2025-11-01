<script lang="ts">
  import Layout from '../layouts/Layout.svelte';

  let { userName = 'Utilisateur' }: { userName?: string } = $props();
</script>

<Layout title="Home" currentPage="/">
  <div class="home">
    <div class="home__welcome">
      <h1 class="home__welcome-title">Welcome, {userName}!</h1>
      <p class="home__welcome-subtitle">Manage your recipes, plan your meals and organize your shopping in one place.</p>
    </div>

    <div class="home__dashboard">
      <a href="/recettes" class="home__card">
        <div class="home__card-icon">📖</div>
        <h2 class="home__card-title">My Recipes</h2>
        <p class="home__card-text">Browse and manage your recipe collection</p>
        <span class="home__card-arrow">→</span>
      </a>

      <a href="/plannings" class="home__card">
        <div class="home__card-icon">📅</div>
        <h2 class="home__card-title">My Meal Plans</h2>
        <p class="home__card-text">Plan your meals for the week</p>
        <span class="home__card-arrow">→</span>
      </a>

      <a href="/shopping-lists" class="home__card">
        <div class="home__card-icon">🛒</div>
        <h2 class="home__card-title">My Shopping Lists</h2>
        <p class="home__card-text">Organize your shopping efficiently</p>
        <span class="home__card-arrow">→</span>
      </a>
    </div>
  </div>
</Layout>

<style lang="scss">
  // Variables
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $white: #fff;
  $text-gray: #666;
  $shadow-primary: rgba(102, 126, 234, 0.3);
  $shadow-light: rgba(0, 0, 0, 0.08);
  $shadow-hover: rgba(102, 126, 234, 0.2);
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;
  $transition-duration: 0.3s;

  // Block: home
  .home {
    display: flex;
    flex-direction: column;
    gap: $spacing-base * 2;

    // Element: welcome
    &__welcome {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;
      padding: $spacing-base * 3;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px $shadow-primary;

      @media (max-width: $breakpoint-mobile) {
        padding: $spacing-base * 2;
      }
    }

    // Element: welcome-title
    &__welcome-title {
      margin: 0 0 $spacing-base 0;
      font-size: 2.5rem;

      @media (max-width: $breakpoint-mobile) {
        font-size: 2rem;
      }
    }

    // Element: welcome-subtitle
    &__welcome-subtitle {
      font-size: 1.2rem;
      opacity: 0.95;
      margin: 0;

      @media (max-width: $breakpoint-mobile) {
        font-size: 1rem;
      }
    }

    // Element: dashboard
    &__dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: $spacing-base * 1.5;

      @media (max-width: $breakpoint-mobile) {
        grid-template-columns: 1fr;
      }
    }

    // Element: card
    &__card {
      background: $white;
      padding: $spacing-base * 2;
      border-radius: 12px;
      box-shadow: 0 2px 12px $shadow-light;
      text-decoration: none;
      color: inherit;
      transition: all $transition-duration ease;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: $spacing-base * 0.5;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px $shadow-hover;
      }

      &:hover &-arrow {
        transform: translateX(4px);
      }
    }

    // Element: card-icon
    &__card-icon {
      font-size: 3rem;
      margin-bottom: $spacing-base * 0.5;
    }

    // Element: card-title
    &__card-title {
      margin: 0;
      color: $primary-color;
      font-size: 1.5rem;
    }

    // Element: card-text
    &__card-text {
      margin: 0;
      color: $text-gray;
      flex: 1;
    }

    // Element: card-arrow
    &__card-arrow {
      align-self: flex-end;
      font-size: 1.5rem;
      color: $primary-color;
      transition: transform $transition-duration ease;
    }
  }
</style>
