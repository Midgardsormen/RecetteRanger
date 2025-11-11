<script lang="ts">
  import { authStore } from '../stores/auth.store';
  import { apiService } from '../services/api.service';
  import { onMount } from 'svelte';

  let showDropdown = $state(false);
  let menuElement: HTMLDivElement;

  const { isAuthenticated, user, isLoading } = $derived({
    isAuthenticated: $authStore.isAuthenticated,
    user: $authStore.user,
    isLoading: $authStore.isLoading
  });

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  function closeDropdown() {
    showDropdown = false;
  }

  async function handleLogout() {
    try {
      // Supprimer le cookie côté serveur
      await apiService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer le store local même si l'appel API échoue
      authStore.logout();
      closeDropdown();
      window.location.href = '/';
    }
  }

  function goToLogin() {
    window.location.href = '/login';
  }

  function goToRegister() {
    window.location.href = '/register';
  }

  // Fermer le dropdown si on clique en dehors
  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuElement && !menuElement.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="user-menu" bind:this={menuElement}>
  {#if isLoading}
    <div class="user-menu__loading">
      <span class="user-menu__spinner">⏳</span>
    </div>
  {:else if isAuthenticated && user}
    <!-- Utilisateur connecté -->
    <button class="user-menu__button" onclick={toggleDropdown} type="button">
      <div class="user-menu__avatar">
        {#if user.avatarUrl}
          <img src={user.avatarUrl} alt={user.pseudo} />
        {:else}
          <span class="user-menu__avatar-fallback">
            {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
          </span>
        {/if}
      </div>
      <span class="user-menu__name">{user.pseudo}</span>
      <span class="user-menu__chevron" class:user-menu__chevron--open={showDropdown}>▼</span>
    </button>

    {#if showDropdown}
      <div class="user-menu__dropdown">
        <div class="user-menu__dropdown-header">
          <div class="user-menu__dropdown-name">{user.firstName} {user.lastName}</div>
          <div class="user-menu__dropdown-email">{user.email}</div>
          <div class="user-menu__dropdown-role">
            <span class="user-menu__role-badge" class:user-menu__role-badge--admin={user.role === 'ADMIN'}>
              {user.role === 'ADMIN' ? '👑 Admin' : '👤 Utilisateur'}
            </span>
          </div>
        </div>
        <div class="user-menu__dropdown-divider"></div>
        <a href="/profile" class="user-menu__dropdown-item">
          <span class="user-menu__dropdown-icon">⚙️</span>
          Mon profil
        </a>
        <button class="user-menu__dropdown-item" onclick={handleLogout} type="button">
          <span class="user-menu__dropdown-icon">🚪</span>
          Se déconnecter
        </button>
      </div>
    {/if}
  {:else}
    <!-- Utilisateur non connecté -->
    <div class="user-menu__auth-buttons">
      <button class="user-menu__btn user-menu__btn--secondary" onclick={goToRegister} type="button">
        S'inscrire
      </button>
      <button class="user-menu__btn user-menu__btn--outlined-reverse" onclick={goToLogin} type="button">
        Connexion
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  @import '../styles/variables';

  .user-menu {
    position: relative;


    &__loading {
      padding: $spacing-sm;
    }

    &__spinner {
      font-size: $font-size-2xl;
      animation: spin 1s linear infinite;
    }

    &__button {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      background: rgba($color-white, 0.1);
      border: none;
      border-radius: $radius-lg;
      color: $color-white;
      cursor: pointer;
      transition: all $transition-fast $transition-ease;
      font-size: $font-size-sm;

      &:hover {
        background: rgba($color-white, 0.2);
      }
    }

    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: $radius-full;
      overflow: hidden;
      background: rgba($color-white, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__avatar-fallback {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-white;
      text-transform: uppercase;
    }

    &__name {
      font-weight: $font-weight-medium;

      @media (max-width: $breakpoint-md) {
        display: none;
      }
    }

    &__chevron {
      font-size: $font-size-xs;
      transition: transform $transition-fast $transition-ease;

      &--open {
        transform: rotate(180deg);
      }
    }

    &__dropdown {
      position: absolute;
      top: calc(100% + $spacing-sm);
      right: 0;
      background: $color-white;
      border-radius: $radius-lg;
      box-shadow: $shadow-lg;
      min-width: 220px;
      overflow: hidden;
      z-index: $z-index-dropdown;
      animation: slideDown $transition-fast $transition-ease;
    }

    &__dropdown-header {
      padding: $spacing-base;
      @include brand-gradient-primary;
      color: $color-white;
    }

    &__dropdown-name {
      font-weight: $font-weight-semibold;
      font-size: $font-size-sm;
    }

    &__dropdown-email {
      font-size: $font-size-sm;
      opacity: $opacity-90;
      margin-top: $spacing-xs;
    }

    &__dropdown-role {
      margin-top: $spacing-sm;
    }

    &__role-badge {
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;
      padding: $spacing-xs $spacing-sm;
      background: rgba($color-white, 0.2);
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &--admin {
        background: rgba($color-warning, 0.3);
        color: $color-warning;
      }
    }

    &__dropdown-divider {
      height: 1px;
      background: $color-border-primary;
    }

    &__dropdown-item {
      width: 100%;
      padding: $spacing-md $spacing-base;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: background $transition-fast $transition-ease;
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      color: $color-text-primary;
      font-size: $font-size-sm;
      text-decoration: none;

      &:hover {
        background: $color-background-tertiary;
      }
    }

    &__dropdown-icon {
      font-size: $font-size-lg;
    }

    &__auth-buttons {
      display: flex;
      gap: $spacing-sm;
    }

    &__btn {
      padding: $spacing-sm $spacing-base;
      border: 2px solid transparent;
      border-radius: $radius-md;
      cursor: pointer;
      font-weight: $font-weight-medium;
      font-size: $font-size-sm;
      transition: all $transition-fast $transition-ease;

      &--secondary {
        background: $color-white;
        color: $brand-primary;
        border-color: $brand-primary;

        &:hover {
          background: $brand-primary;
          color: $color-white;
          border-color: $brand-primary;
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
          background: $brand-tertiary;
          color: $color-white;
          border-color: $brand-tertiary;
        }
      }

      &--outlined-reverse {
        background: transparent;
        color: $color-dutch-white;
        border-color: $color-dutch-white;

        &:hover {
          background: rgba($color-dutch-white, 0.1);
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
