<script lang="ts">
  import { Drawer } from '../../components/ui';

  let { currentPage = '', isOpen = false, onClose, user = null }: { currentPage?: string; isOpen?: boolean; onClose?: () => void; user?: any } = $props();

  const navItems = [
    { href: '/', label: 'Accueil', icon: '🏠' },
    { href: '/recettes', label: 'Recettes', icon: '📖' },
    { href: '/ingredients', label: 'Ingrédients', icon: '🥗' },
    { href: '/articles', label: 'Articles', icon: '🧴' },
    { href: '/stores', label: 'Enseignes', icon: '🏪' },
    { href: '/plannings', label: 'Plannings', icon: '📅' },
    { href: '/shopping-lists', label: 'Liste de course', icon: '🛒' }
  ];



  // Check if user is authenticated
  const isAuthenticated = $derived(user !== null);

  function handleNavClick() {
    // Close drawer on mobile when clicking a link
    if (onClose) {
      onClose();
    }
  }
</script>

{#if isAuthenticated}
  <!-- Desktop horizontal navigation (visible >= 1024px) -->
  <nav class="nav-horizontal">
    <ul class="nav-horizontal__list">
      {#each navItems as item, index}
        <li class="nav-horizontal__item" class:nav-horizontal__item--gap={index === 2}>
          <a
            href={item.href}
            class="nav-horizontal__link"
            class:nav-horizontal__link--active={currentPage === item.href}
            aria-current={currentPage === item.href ? 'page' : undefined}
          >
            <span class="nav-horizontal__label">{item.label}</span>
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
{/if}

<style lang="scss">
  @import '../../styles/_variables';

  // Desktop Horizontal Navigation
  .nav-horizontal {
    @include retro-grain(0.3);
    position: sticky;
    top: 64px; // Stick below header
    background: $brand-secondary;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: $z-index-sticky;
    padding: 0 $spacing-lg;

    // Hide on mobile/tablet
    @media (max-width: $breakpoint-lg) {
      display: none;
    }

    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr) 200px repeat(3, 1fr);
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      max-width: $max-width-container;
      margin: 0 auto;
    }

    &__link {
      display: block;
      align-items: center;
      padding: $spacing-base $spacing-sm;
      color: $color-text-inverse;
      text-decoration: none;
      border-radius: $radius-md;
      transition: all $transition-base;
      font-weight: $font-weight-medium;
      text-transform: uppercase;
      white-space: nowrap;
      text-align: center;
      border: 5px solid transparent;
      font-family: $font-family-heading;
      text-shadow: $shadow-decorative-navigation;
      
      opacity: 0.9;
      &:hover {
        border-bottom: 5px solid $color-permanent-geranium-lake;
        color:$color-dutch-white;
        text-shadow: $shadow-decorative-navigation-hover;
      }

      &--active {
        border-bottom: 5px solid $color-permanent-geranium-lake;
        color: $color-dutch-white;
        text-shadow: $shadow-decorative-navigation-hover;
      }
    }

    &__label {
      font-size: $font-size-lg;
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
