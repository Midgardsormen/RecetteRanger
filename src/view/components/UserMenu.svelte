<script lang="ts">
  import { authStore } from '../stores/auth.store';
  import { apiService } from '../services/api.service';
  import { Button, NotificationBadge } from './ui';
  import { onMount } from 'svelte';
  import { Settings, Crown, LogOut, User as UserIcon, Shield } from 'lucide-svelte';

  let { user: userProp = null }: { user?: any } = $props();

  let showDropdown = $state(false);
  let menuElement: HTMLDivElement;
  let pendingUsersCount = $state(0);

  // Utiliser le prop user en priorité, sinon le store
  const { isAuthenticated, user, isLoading } = $derived({
    isAuthenticated: userProp ? true : $authStore.isAuthenticated,
    user: userProp || $authStore.user,
    isLoading: userProp ? false : $authStore.isLoading
  });

  const isAdmin = $derived(user?.role === 'ADMIN');

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

  // Fetch pending users count for admins
  async function fetchPendingCount() {
    if (isAdmin) {
      try {
        const response = await fetch('/api/users/pending/count');
        if (response.ok) {
          const data = await response.json();
          pendingUsersCount = data.count;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre d\'utilisateurs en attente:', error);
      }
    }
  }

  // Fermer le dropdown si on clique en dehors
  onMount(() => {
    // Fetch pending count on mount
    fetchPendingCount();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    function handleClickOutside(event: MouseEvent) {
      if (menuElement && !menuElement.contains(event.target as Node)) {
        closeDropdown();
      }
    }

    // Listen for user status changes
    function handleUserStatusChanged() {
      fetchPendingCount();
    }

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('user-status-changed', handleUserStatusChanged);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('user-status-changed', handleUserStatusChanged);
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
    <button
      class="user-menu__button"
      onclick={toggleDropdown}
      type="button"
      title={isAdmin && pendingUsersCount > 0 ? `${pendingUsersCount} demande${pendingUsersCount > 1 ? 's' : ''} d'inscription en attente` : ''}
    >
      <div class="user-menu__avatar-container">
        <div class="user-menu__avatar">
          {#if user.avatarUrl}
            <img src={user.avatarUrl} alt={user.pseudo} />
          {:else}
            <span class="user-menu__avatar-fallback">
              {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
            </span>
          {/if}
        </div>
        {#if isAdmin}
          <NotificationBadge
            count={pendingUsersCount}
            size="medium"
            variant="danger"
            position="top-right"
            animate={true}
          />
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
              {#if user.role === 'ADMIN'}
                <Crown size={14} />
                Admin
              {:else}
                <UserIcon size={14} />
                Utilisateur
              {/if}
            </span>
          </div>
        </div>
        <div class="user-menu__dropdown-divider"></div>
        <a href="/profile" class="user-menu__dropdown-item">
          <Settings size={18} class="user-menu__dropdown-icon" />
          Mon profil
        </a>
        {#if user.role === 'ADMIN'}
          <a href="/admin" class="user-menu__dropdown-item user-menu__dropdown-item--admin">
            <Shield size={18} class="user-menu__dropdown-icon" />
            Administration
          </a>
        {/if}
        <button class="user-menu__dropdown-item" onclick={handleLogout} type="button">
          <LogOut size={18} class="user-menu__dropdown-icon" />
          Se déconnecter
        </button>
      </div>
    {/if}
  {:else}
    <!-- Utilisateur non connecté -->
    <div class="user-menu__auth-buttons">
      <Button variant="primary-inverse" size="small" onclick={goToRegister}>
        S'inscrire
      </Button>
      <Button variant="outlined-inverse" size="small" onclick={goToLogin}>
        Connexion
      </Button>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../styles/variables' as *;

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
      background: $color-white-alpha-10;
      border: none;
      border-radius: $radius-lg;
      color: $color-white;
      cursor: pointer;
      transition: all $transition-fast $transition-ease;
      font-size: $font-size-sm;

      &:hover {
        background: $color-white-alpha-20;
      }
    }

    &__avatar-container {
      position: relative;
    }

    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: $radius-full;
      overflow: hidden;
      background: $color-white-alpha-20;
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
      background: $color-white-alpha-20;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-semibold;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &--admin {
        background: $color-warning-alpha-30;
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

      &--admin {
        background: rgba($color-danger, 0.05);
        font-weight: $font-weight-semibold;

        &:hover {
          background: rgba($color-danger, 0.1);
        }
      }
    }

    &__dropdown-icon {
      flex-shrink: 0;
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

      &--primary-inverse {
        background: $color-button-primary-inverse-background;
        color: $color-button-primary-inverse-text;

        &:hover {
          background: $color-button-primary-inverse-hover-background;
          color: $color-button-primary-inverse-hover-text;
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
          background: $color-button-primary-inverse-active-background;
          color: $color-button-primary-inverse-hover-text;
        }
      }

      &--secondary-inverse {
        background: $color-button-secondary-inverse-background;
        color: $color-button-secondary-inverse-text;
        border-color: $color-button-secondary-inverse-border;

        &:hover {
          background: $color-button-secondary-inverse-hover-background;
          color: $color-button-secondary-inverse-hover-text;
          border-color: $color-button-secondary-inverse-hover-border;
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
          background: $color-button-secondary-inverse-active-background;
          color: $color-button-secondary-inverse-active-text;
          border-color: $color-button-secondary-inverse-active-border;
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

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
