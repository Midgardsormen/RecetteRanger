<script lang="ts">
  import { Button, Title } from '../../../components/ui';

  function goToRegister() {
    window.location.href = '/register';
  }

  function goToLogin() {
    window.location.href = '/login';
  }
</script>

<div class="landing">
  <!-- Hero Section -->
  <div class="landing__hero">
    <div class="landing__hero-content">
      <p class="landing__hero-subtitle">
        Votre assistant personnel pour gérer vos recettes, planifier vos repas et optimiser vos courses
      </p>
      <div class="landing__hero-buttons">
        <Button variant="primary-inverse" size="large" onclick={goToRegister}>
          Commencer gratuitement
        </Button>
        <Button variant="outlined-inverse" size="large" onclick={goToLogin}>
          Se connecter
        </Button>
      </div>
    </div>
  </div>

  <!-- Features Section -->
  <div class="landing__features">
    <div class="landing__feature">
      <img src="/assets/images/52122fb2-7c16-43c4-ab68-d3669ef31c0e.png" alt="Gestion des recettes" class="landing__feature-img" />
      <div class="landing__feature-content">
        <Title level={3} align="center">Gestion des recettes</Title>
        <p class="landing__feature-text">
          Créez et organisez<br/>toutes vos recettes préférées au même endroit
        </p>
      </div>
    </div>

    <div class="landing__feature">
      <img src="/assets/images/a8800c87-1ca0-4225-ab1e-adcb646fbf18.png" alt="Planification des repas" class="landing__feature-img" />
      <div class="landing__feature-content">
        <Title level={3} align="center">Planification des repas</Title>
        <p class="landing__feature-text">
          Planifiez vos menus pour la semaine<br/>et gagnez du temps
        </p>
      </div>
    </div>

    <div class="landing__feature">
      <img src="/assets/images/375f5d6f-4fd3-4293-8af7-84e87db0b4e7.png" alt="Listes de courses intelligentes" class="landing__feature-img" />
      <div class="landing__feature-content">
        <Title level={3} align="center">Listes de courses intelligentes</Title>
        <p class="landing__feature-text">
          Générez automatiquement<br/>vos listes de courses depuis vos plannings
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: landing
  .landing {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    // Element: hero
    &__hero {
      @include retro-grain(0.3);
      background: $brand-quaternary;
      background-image: url('/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png');
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      position: relative;
      color: $color-white;
      padding: $spacing-4xl $spacing-sm $spacing-lg;
      border-radius: $radius-2xl;
      text-align: center;
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);

      @media (min-width: $breakpoint-md) {
        padding: 8rem $spacing-md $spacing-xl ;
      }
      @media (min-width: $breakpoint-lg) {
        padding: 8rem  $spacing-lg $spacing-2xl;
      }

      // Overlay pour contrôler l'opacité de l'image
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: $brand-quaternary;
        opacity: 0.85;
        border-radius: $radius-2xl;
        z-index: 0;
      }

      // S'assurer que le contenu est au-dessus de l'overlay
      > * {
        position: relative;
        z-index: 1;
      }
    }

    // Element: hero-content
    &__hero-content {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-lg;
      @media (min-width: $breakpoint-md) {
        max-width: 70%;
      }
      @media (min-width: $breakpoint-lg) {
        max-width: 50%;
      }
    }

    // Element: hero-subtitle
    &__hero-subtitle {
      font-size: $font-size-xl;
      opacity: $opacity-90;
      margin: 0;
      padding-top: $spacing-md;
      text-transform: uppercase;
      font-family: $font-family-heading;
      font-size: $title-size-1;
      font-weight: $font-weight-bold;
      color: $color-decorative-title;
      text-shadow: $shadow-decorative-title;
      opacity: 0.8;
      display: flex;
      flex-direction: column;
      line-height: $line-height-tight;
      @media (max-width: $breakpoint-md) {
        font-size: $font-size-lg;
      }
    }

    // Element: hero-buttons
    &__hero-buttons {
      display: flex;
      gap: $spacing-base;
      justify-content: center;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
      }
    }

    // Element: features
    &__features {
      display: grid;
      grid-template-columns: 1fr;
      gap: $spacing-lg;

      @media (min-width: $breakpoint-md) {
        grid-template-columns: repeat(3, 1fr);
        gap: $spacing-base;
      }

      @media (min-width: $breakpoint-lg) {
        gap: $spacing-xl;
      }
    }

    // Element: feature
    &__feature {
      text-align: center;
      border-radius: $radius-xl;
      box-shadow: $shadow-md;
      overflow: hidden;
      position: relative;
      background-color: $brand-tertiary;
      opacity: 0.8;
    }

    // Element: feature-img
    &__feature-img {
      width: 100%;
      height: 300px;
      display: block;
      object-fit: cover;
      opacity: 0.3;

      @media (min-width: $breakpoint-md) {
        height: 400px;
      }

      @media (min-width: $breakpoint-lg) {
        height: 500px;
      }
    }

    // Element: feature-content
    &__feature-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: $spacing-lg;
      :global(.title){
          text-transform: uppercase;
          font-family: $font-family-heading;
          font-size: $title-size-1;
          font-weight: $font-weight-bold;
          color: $color-decorative-title;
          text-shadow: $shadow-decorative-title;
          opacity: 0.9;
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: $spacing-lg;
      }
    }

    // Element: feature-text
    &__feature-text {
      margin: 0;
      color: $color-text-inverse;
      line-height: $line-height-tight;
      font-weight: $font-weight-bold;
      text-shadow: $text-shadow-sharp-md;
      font-size: $font-size-lg;
    }
  }
</style>
