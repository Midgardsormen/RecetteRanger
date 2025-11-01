<script lang="ts">
  import UserMenu from '../../components/UserMenu.svelte';

  let { currentPage = '' }: { currentPage?: string } = $props();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/recettes', label: 'Recipes', icon: '📖' },
    { href: '/plannings', label: 'Meal Plans', icon: '📅' },
    { href: '/shopping-lists', label: 'Shopping Lists', icon: '🛒' }
  ];
</script>

<nav id="navigation" class="navigation">
  <div class="navigation__container">
    <div class="navigation__brand">
      <h1 class="navigation__brand-title">RecetteRanger</h1>
    </div>
    <ul class="navigation__list">
      {#each navItems as item}
        <li class="navigation__item">
          <a
            href={item.href}
            class="navigation__link"
            class:navigation__link--active={currentPage === item.href}
            aria-current={currentPage === item.href ? 'page' : undefined}
          >
            <span class="navigation__icon">{item.icon}</span>
            <span class="navigation__label">{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
    <div class="navigation__user">
      <UserMenu />
    </div>
  </div>
</nav>

<style lang="scss">
  // Variables
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $white: #fff;
  $white-transparent-90: rgba(255, 255, 255, 0.9);
  $white-transparent-20: rgba(255, 255, 255, 0.2);
  $white-transparent-10: rgba(255, 255, 255, 0.1);
  $shadow-color: rgba(0, 0, 0, 0.1);
  $max-width: 1200px;
  $spacing-base: 1rem;
  $breakpoint-mobile: 768px;
  $transition-duration: 0.3s;

  // Block: navigation
  .navigation {
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    box-shadow: 0 2px 8px $shadow-color;
    position: sticky;
    top: 0;
    z-index: 100;

    // Element: container
    &__container {
      max-width: $max-width;
      margin: 0 auto;
      padding: $spacing-base $spacing-base * 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: $spacing-base * 2;

      @media (max-width: $breakpoint-mobile) {
        flex-wrap: wrap;
        gap: $spacing-base;
        padding: $spacing-base;
      }
    }

    // Element: user
    &__user {
      margin-left: auto;

      @media (max-width: $breakpoint-mobile) {
        margin-left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }

    // Element: brand
    &__brand {
      // No specific styles
    }

    // Element: brand-title
    &__brand-title {
      color: $white;
      font-size: 1.5rem;
      margin: 0;
      font-weight: 700;
    }

    // Element: list
    &__list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: $spacing-base * 0.5;

      @media (max-width: $breakpoint-mobile) {
        flex-wrap: wrap;
        justify-content: center;
      }
    }

    // Element: item
    &__item {
      // No specific styles needed for li
    }

    // Element: link
    &__link {
      display: flex;
      align-items: center;
      gap: $spacing-base * 0.5;
      padding: $spacing-base * 0.75 $spacing-base * 1.25;
      color: $white-transparent-90;
      text-decoration: none;
      border-radius: 8px;
      transition: all $transition-duration ease;
      font-weight: 500;
      background: $white-transparent-10;

      &:hover {
        background: $white-transparent-20;
        color: $white;
        transform: translateY(-2px);
      }

      // Modifier: active
      &--active {
        background: $white;
        color: $primary-color;
        font-weight: 600;
      }

      @media (max-width: $breakpoint-mobile) {
        padding: $spacing-base * 0.5 $spacing-base;
        font-size: 0.9rem;
      }
    }

    // Element: icon
    &__icon {
      font-size: 1.2rem;

      @media (max-width: $breakpoint-mobile) {
        font-size: 1.5rem;
      }
    }

    // Element: label
    &__label {
      @media (max-width: $breakpoint-mobile) {
        display: none;
      }
    }
  }
</style>
