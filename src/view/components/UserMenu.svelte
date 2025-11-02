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
        </div>
        <div class="user-menu__dropdown-divider"></div>
        <button class="user-menu__dropdown-item" onclick={handleLogout} type="button">
          <span class="user-menu__dropdown-icon">🚪</span>
          Se déconnecter
        </button>
      </div>
    {/if}
  {:else}
    <!-- Utilisateur non connecté -->
    <div class="user-menu__auth-buttons">
      <button class="user-menu__btn user-menu__btn--secondary" onclick={goToLogin} type="button">
        Connexion
      </button>
      <button class="user-menu__btn user-menu__btn--primary" onclick={goToRegister} type="button">
        S'inscrire
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .user-menu {
    position: relative;

    &__loading {
      padding: 0.5rem;
    }

    &__spinner {
      font-size: 1.5rem;
      animation: spin 1s linear infinite;
    }

    &__button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }

    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.2);
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
      font-size: 0.85rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
    }

    &__name {
      font-weight: 500;

      @media (max-width: 768px) {
        display: none;
      }
    }

    &__chevron {
      font-size: 0.7rem;
      transition: transform 0.2s ease;

      &--open {
        transform: rotate(180deg);
      }
    }

    &__dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 220px;
      overflow: hidden;
      z-index: 1000;
      animation: slideDown 0.2s ease;
    }

    &__dropdown-header {
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    &__dropdown-name {
      font-weight: 600;
      font-size: 0.95rem;
    }

    &__dropdown-email {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 0.25rem;
    }

    &__dropdown-divider {
      height: 1px;
      background: #e0e0e0;
    }

    &__dropdown-item {
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #333;
      font-size: 0.95rem;

      &:hover {
        background: #f5f5f5;
      }
    }

    &__dropdown-icon {
      font-size: 1.1rem;
    }

    &__auth-buttons {
      display: flex;
      gap: 0.5rem;
    }

    &__btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s ease;

      &--secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }

      &--primary {
        background: white;
        color: #667eea;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
