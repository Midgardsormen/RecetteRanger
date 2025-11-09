<script lang="ts">
  import { Drawer } from '../../components/ui';

  let { currentPage = '', isOpen = false, onClose }: { currentPage?: string; isOpen?: boolean; onClose?: () => void } = $props();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/recettes', label: 'Recipes', icon: '📖' },
    { href: '/ingredients', label: 'Ingredients', icon: '🥗' },
    { href: '/articles', label: 'Articles', icon: '🧴' },
    { href: '/stores', label: 'Stores', icon: '🏪' },
    { href: '/plannings', label: 'Meal Plans', icon: '📅' },
    { href: '/shopping-lists', label: 'Shopping Lists', icon: '🛒' }
  ];

  function handleNavClick() {
    // Close drawer on mobile when clicking a link
    if (onClose) {
      onClose();
    }
  }
</script>

<!-- Desktop sidebar (visible >= 1024px) -->
<nav class="sidebar">
  <ul class="sidebar__list">
    {#each navItems as item}
      <li class="sidebar__item">
        <a
          href={item.href}
          class="sidebar__link"
          class:sidebar__link--active={currentPage === item.href}
          aria-current={currentPage === item.href ? 'page' : undefined}
        >
          <span class="sidebar__icon">{item.icon}</span>
          <span class="sidebar__label">{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<!-- Mobile/Tablet drawer (visible < 1024px) -->
<Drawer
  {isOpen}
  position="left"
  variant="navigation"
  onClose={onClose || (() => {})}
>
  <nav class="mobile-nav">
    <ul class="mobile-nav__list">
      {#each navItems as item}
        <li class="mobile-nav__item">
          <a
            href={item.href}
            class="mobile-nav__link"
            class:mobile-nav__link--active={currentPage === item.href}
            aria-current={currentPage === item.href ? 'page' : undefined}
            onclick={handleNavClick}
          >
            <span class="mobile-nav__icon">{item.icon}</span>
            <span class="mobile-nav__label">{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</Drawer>

<style lang="scss">
  @import '../../styles/_variables';

  // Desktop Sidebar - Vertical navigation on the left
  .sidebar {
    position: fixed;
    left: 0;
    top: 64px; // Below header
    bottom: 0;
    width: 250px;
    background: linear-gradient(135deg, $brand-primary 0%, $brand-secondary 100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    padding: $spacing-lg 0;
    z-index: $z-index-sidebar;

    // Hide on mobile/tablet
    @media (max-width: $breakpoint-lg) {
      display: none;
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      flex: 1;
    }

    &__item {
      padding: 0 $spacing-base;
    }

    &__link {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-base;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: $radius-md;
      transition: all $transition-base;
      font-weight: $font-weight-medium;
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: $color-white;
        transform: translateX(4px);
      }

      &--active {
        background: $color-white;
        color: $brand-primary;
        font-weight: $font-weight-semibold;
      }
    }

    &__icon {
      font-size: $font-size-xl;
      flex-shrink: 0;
    }

    &__label {
      font-size: $font-size-base;
    }
  }

  // Mobile Navigation (inside Drawer with navigation variant)
  .mobile-nav {
    display: flex;
    flex-direction: column;
    min-height: 100%;

    &__list {
      list-style: none;
      margin: 0;
      padding: $spacing-lg 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      flex: 1;
    }

    &__item {
      padding: 0 $spacing-base;
    }

    &__link {
      display: flex;
      align-items: center;
      gap: $spacing-base;
      padding: $spacing-base;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: $radius-md;
      transition: all $transition-base;
      font-weight: $font-weight-medium;
      background: rgba(255, 255, 255, 0.1);

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        color: $color-white;
        transform: translateX(4px);
      }

      &--active {
        background: $color-white;
        color: $brand-primary;
        font-weight: $font-weight-semibold;
      }
    }

    &__icon {
      font-size: $font-size-xl;
      flex-shrink: 0;
    }

    &__label {
      font-size: $font-size-base;
    }
  }
</style>
