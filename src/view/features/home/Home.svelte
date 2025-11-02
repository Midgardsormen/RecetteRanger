<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { authStore } from '../../stores/auth.store';

  // Recevoir les données du SSR
  let { user: ssrUser = null }: { user?: any } = $props();

  // Utiliser les données SSR ou le store client
  const { isAuthenticated, user } = $derived({
    isAuthenticated: ssrUser ? true : $authStore.isAuthenticated,
    user: ssrUser || $authStore.user
  });

  function goToRegister() {
    window.location.href = '/register';
  }

  function goToLogin() {
    window.location.href = '/login';
  }
</script>

<Layout title="Home" currentPage="/" {user}>
<div id="home" class="home">
  {#if isAuthenticated && user}
    <!-- Utilisateur connecté - Dashboard -->
    <div class="home__welcome">
      <h1 class="home__welcome-title">Bienvenue, {user.pseudo} ! 👋</h1>
      <p class="home__welcome-subtitle">Gérez vos recettes, planifiez vos repas et organisez vos courses en un seul endroit.</p>
    </div>

    <div class="home__dashboard">
      <a href="/recettes" class="home__card">
        <div class="home__card-icon">📖</div>
        <h2 class="home__card-title">Mes Recettes</h2>
        <p class="home__card-text">Parcourez et gérez votre collection de recettes</p>
        <span class="home__card-arrow">→</span>
      </a>

      <a href="/plannings" class="home__card">
        <div class="home__card-icon">📅</div>
        <h2 class="home__card-title">Mes Plannings</h2>
        <p class="home__card-text">Planifiez vos repas pour la semaine</p>
        <span class="home__card-arrow">→</span>
      </a>

      <a href="/shopping-lists" class="home__card">
        <div class="home__card-icon">🛒</div>
        <h2 class="home__card-title">Mes Listes de Courses</h2>
        <p class="home__card-text">Organisez vos courses efficacement</p>
        <span class="home__card-arrow">→</span>
      </a>
    </div>
  {:else}
    <!-- Utilisateur non connecté - Landing Page -->
    <div class="home__hero">
      <div class="home__hero-content">
        <h1 class="home__hero-title">
          RecetteRanger 🍳
        </h1>
        <p class="home__hero-subtitle">
          Votre assistant personnel pour gérer vos recettes, planifier vos repas et optimiser vos courses
        </p>
        <div class="home__hero-buttons">
          <button class="home__btn home__btn--primary" onclick={goToRegister}>
            Commencer gratuitement
          </button>
          <button class="home__btn home__btn--secondary" onclick={goToLogin}>
            Se connecter
          </button>
        </div>
      </div>
    </div>

    <div class="home__features">
      <div class="home__feature">
        <div class="home__feature-icon">📖</div>
        <h3 class="home__feature-title">Gestion des recettes</h3>
        <p class="home__feature-text">
          Créez et organisez toutes vos recettes préférées au même endroit
        </p>
      </div>

      <div class="home__feature">
        <div class="home__feature-icon">📅</div>
        <h3 class="home__feature-title">Planification des repas</h3>
        <p class="home__feature-text">
          Planifiez vos menus pour la semaine et gagnez du temps
        </p>
      </div>

      <div class="home__feature">
        <div class="home__feature-icon">🛒</div>
        <h3 class="home__feature-title">Listes de courses intelligentes</h3>
        <p class="home__feature-text">
          Générez automatiquement vos listes de courses depuis vos plannings
        </p>
      </div>
    </div>
  {/if}
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
    gap: $spacing-base * 3;

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

    // Element: hero
    &__hero {
      background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
      color: $white;
      padding: $spacing-base * 5 $spacing-base * 3;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px $shadow-primary;

      @media (max-width: $breakpoint-mobile) {
        padding: $spacing-base * 3 $spacing-base * 2;
      }
    }

    // Element: hero-content
    &__hero-content {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: $spacing-base * 1.5;
    }

    // Element: hero-title
    &__hero-title {
      margin: 0;
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;

      @media (max-width: $breakpoint-mobile) {
        font-size: 2.5rem;
      }
    }

    // Element: hero-subtitle
    &__hero-subtitle {
      font-size: 1.3rem;
      opacity: 0.95;
      margin: 0;
      line-height: 1.6;

      @media (max-width: $breakpoint-mobile) {
        font-size: 1.1rem;
      }
    }

    // Element: hero-buttons
    &__hero-buttons {
      display: flex;
      gap: $spacing-base;
      justify-content: center;
      margin-top: $spacing-base;

      @media (max-width: $breakpoint-mobile) {
        flex-direction: column;
      }
    }

    // Element: btn
    &__btn {
      padding: $spacing-base * 0.875 $spacing-base * 2;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all $transition-duration ease;

      &--primary {
        background: $white;
        color: $primary-color;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
      }

      &--secondary {
        background: rgba(255, 255, 255, 0.2);
        color: $white;
        border: 2px solid $white;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    // Element: features
    &__features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: $spacing-base * 2;
      padding: $spacing-base * 2 0;

      @media (max-width: $breakpoint-mobile) {
        grid-template-columns: 1fr;
      }
    }

    // Element: feature
    &__feature {
      background: $white;
      padding: $spacing-base * 2;
      border-radius: 12px;
      box-shadow: 0 2px 12px $shadow-light;
      text-align: center;
      transition: all $transition-duration ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px $shadow-hover;
      }
    }

    // Element: feature-icon
    &__feature-icon {
      font-size: 4rem;
      margin-bottom: $spacing-base;
    }

    // Element: feature-title
    &__feature-title {
      margin: 0 0 $spacing-base 0;
      color: $primary-color;
      font-size: 1.4rem;
    }

    // Element: feature-text
    &__feature-text {
      margin: 0;
      color: $text-gray;
      line-height: 1.6;
    }
  }
</style>
