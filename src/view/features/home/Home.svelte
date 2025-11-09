<script lang="ts">
  import Layout from '../../layouts/Layout.svelte';
  import { Button, Title, Card } from '../../components/ui';
  import { authStore } from '../../stores/auth.store';
  import { derived } from 'svelte/store';

  // Recevoir les données du SSR
  let { user: ssrUser = null }: { user?: any } = $props();

  // Créer un store dérivé pour l'authentification et l'utilisateur
  const authState = derived(authStore, ($auth) => ({
    isAuthenticated: ssrUser ? true : $auth.isAuthenticated,
    user: ssrUser || $auth.user
  }));

  function goToRegister() {
    window.location.href = '/register';
  }

  function goToLogin() {
    window.location.href = '/login';
  }
</script>

<Layout title="Home" currentPage="/" user={$authState.user}>
<div id="home" class="home">
  {#if $authState.isAuthenticated && $authState.user}
    <!-- Utilisateur connecté - Dashboard -->
    <div class="home__welcome">
      <Title level={1} align="center">Bienvenue, {$authState.user.pseudo} ! 👋</Title>
      <p class="home__welcome-subtitle">Gérez vos recettes, planifiez vos repas et organisez vos courses en un seul endroit.</p>
    </div>

    <div class="home__dashboard">
      <a href="/recettes" class="home__card-link">
        <Card clickable onclick={() => window.location.href = '/recettes'}>
          {#snippet content()}
            <div class="home__card-icon">📖</div>
            <Title level={2}>Mes Recettes</Title>
            <p class="home__card-text">Parcourez et gérez votre collection de recettes</p>
            <span class="home__card-arrow">→</span>
          {/snippet}
        </Card>
      </a>

      <a href="/plannings" class="home__card-link">
        <Card clickable onclick={() => window.location.href = '/plannings'}>
          {#snippet content()}
            <div class="home__card-icon">📅</div>
            <Title level={2}>Mes Plannings</Title>
            <p class="home__card-text">Planifiez vos repas pour la semaine</p>
            <span class="home__card-arrow">→</span>
          {/snippet}
        </Card>
      </a>

      <a href="/shopping-lists" class="home__card-link">
        <Card clickable onclick={() => window.location.href = '/shopping-lists'}>
          {#snippet content()}
            <div class="home__card-icon">🛒</div>
            <Title level={2}>Mes Listes de Courses</Title>
            <p class="home__card-text">Organisez vos courses efficacement</p>
            <span class="home__card-arrow">→</span>
          {/snippet}
        </Card>
      </a>
    </div>
  {:else}
    <!-- Utilisateur non connecté - Landing Page -->
    <div class="home__hero">
      <div class="home__hero-content">
        <Title level={1} align="center">RecetteRanger 🍳</Title>
        <p class="home__hero-subtitle">
          Votre assistant personnel pour gérer vos recettes, planifier vos repas et optimiser vos courses
        </p>
        <div class="home__hero-buttons">
          <Button variant="secondary" size="large" onclick={goToRegister}>
            Commencer gratuitement
          </Button>
          <Button variant="ghost" size="large" onclick={goToLogin}>
            Se connecter
          </Button>
        </div>
      </div>
    </div>

    <div class="home__features">
      <Card>
        {#snippet content()}
          <div class="home__feature">
            <div class="home__feature-icon">📖</div>
            <Title level={3} align="center">Gestion des recettes</Title>
            <p class="home__feature-text">
              Créez et organisez toutes vos recettes préférées au même endroit
            </p>
          </div>
        {/snippet}
      </Card>

      <Card>
        {#snippet content()}
          <div class="home__feature">
            <div class="home__feature-icon">📅</div>
            <Title level={3} align="center">Planification des repas</Title>
            <p class="home__feature-text">
              Planifiez vos menus pour la semaine et gagnez du temps
            </p>
          </div>
        {/snippet}
      </Card>

      <Card>
        {#snippet content()}
          <div class="home__feature">
            <div class="home__feature-icon">🛒</div>
            <Title level={3} align="center">Listes de courses intelligentes</Title>
            <p class="home__feature-text">
              Générez automatiquement vos listes de courses depuis vos plannings
            </p>
          </div>
        {/snippet}
      </Card>
    </div>
  {/if}
</div>
</Layout>

<style lang="scss">
  @import '../../styles/variables';

  // Block: home
  .home {
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;

    // Element: welcome
    &__welcome {
      @include brand-gradient;
      color: $color-white;
      padding: $spacing-2xl;
      border-radius: $radius-2xl;
      text-align: center;
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);

      @media (max-width: $breakpoint-md) {
        padding: $spacing-xl;
      }
    }

    // Element: welcome-subtitle
    &__welcome-subtitle {
      font-size: $font-size-xl;
      opacity: $opacity-90;
      margin: 0;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-base;
      }
    }

    // Element: dashboard
    &__dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: $spacing-lg;

      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
      }
    }

    // Element: card-link
    &__card-link {
      text-decoration: none;
      color: inherit;
    }

    // Element: card-icon
    &__card-icon {
      font-size: $font-size-3xl;
      margin-bottom: $spacing-sm;
    }

    // Element: card-text
    &__card-text {
      margin: 0;
      color: $color-text-secondary;
      flex: 1;
    }

    // Element: card-arrow
    &__card-arrow {
      align-self: flex-end;
      font-size: $font-size-2xl;
      color: $brand-primary;
      transition: transform $transition-base $transition-ease;
    }

    // Element: hero
    &__hero {
      @include brand-gradient;
      color: $color-white;
      padding: $spacing-3xl $spacing-2xl;
      border-radius: $radius-2xl;
      text-align: center;
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);

      @media (max-width: $breakpoint-md) {
        padding: $spacing-2xl $spacing-xl;
      }
    }

    // Element: hero-content
    &__hero-content {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: $spacing-lg;
    }

    // Element: hero-subtitle
    &__hero-subtitle {
      font-size: $font-size-xl;
      opacity: $opacity-90;
      margin: 0;
      line-height: $line-height-relaxed;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-lg;
      }
    }

    // Element: hero-buttons
    &__hero-buttons {
      display: flex;
      gap: $spacing-base;
      justify-content: center;
      margin-top: $spacing-base;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
      }
    }

    // Element: features
    &__features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: $spacing-xl;
      padding: $spacing-xl 0;

      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
      }
    }

    // Element: feature
    &__feature {
      text-align: center;
    }

    // Element: feature-icon
    &__feature-icon {
      font-size: $font-size-4xl;
      margin-bottom: $spacing-base;
    }

    // Element: feature-text
    &__feature-text {
      margin: 0;
      color: $color-text-secondary;
      line-height: $line-height-relaxed;
    }
  }
</style>
