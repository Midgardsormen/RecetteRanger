<script lang="ts">
  import { Title } from '../../../components/ui';

  let { user }: { user: any } = $props();
</script>

<div class="dashboard">
  <!-- Welcome Section -->
  <div class="dashboard__welcome">
    <Title level={1} align="center"><span>Bienvenue,</span> {user.pseudo} !</Title>
    <p class="dashboard__welcome-subtitle">Gérez vos recettes, planifiez vos repas et organisez vos courses en un seul endroit.</p>
  </div>

  <!-- Quick Links Grid -->
  <div class="dashboard__grid">
    <a href="/recettes" class="dashboard__card dashboard__card--recipes">
      <div class="dashboard__card-content">
        <div class="dashboard__card-icon">📖</div>
        <Title level={2}>Mes Recettes</Title>
        <p class="dashboard__card-text">Parcourez et gérez votre collection de recettes</p>
        <span class="dashboard__card-arrow">→</span>
      </div>
    </a>

    <a href="/plannings" class="dashboard__card dashboard__card--plannings">
      <div class="dashboard__card-content">
        <div class="dashboard__card-icon">📅</div>
        <Title level={2}>Mes Plannings</Title>
        <p class="dashboard__card-text">Planifiez vos repas pour la semaine</p>
        <span class="dashboard__card-arrow">→</span>
      </div>
    </a>

    <a href="/shopping-lists" class="dashboard__card dashboard__card--shopping">
      <div class="dashboard__card-content">
        <div class="dashboard__card-icon">🛒</div>
        <Title level={2}>Mes Listes de Courses</Title>
        <p class="dashboard__card-text">Organisez vos courses efficacement</p>
        <span class="dashboard__card-arrow">→</span>
      </div>
    </a>
  </div>
</div>

<style lang="scss">
  @import '../../../styles/variables';

  // Block: dashboard
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: $spacing-2xl;

    // Element: welcome
    &__welcome {
      @include retro-grain(0.3);
      background: $brand-quaternary;
      background-image: url('/assets/images/ChatGPT Image 11 nov. 2025, 00_10_06.png');
      background-size: cover;
      background-position: center;
      background-blend-mode: overlay;
      position: relative;
      color: $color-white;
      padding: $spacing-lg $spacing-sm;
      border-radius: $radius-2xl;
      text-align: center;
      box-shadow: 0 4px 20px rgba($brand-primary, 0.3);
      @media (min-width: $breakpoint-md) {
        padding:  $spacing-3xl $spacing-md $spacing-2xl;
      }
      @media (min-width: $breakpoint-lg) {
        padding:  $spacing-4xl $spacing-lg $spacing-2xl;
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

      :global {
        .title {
          text-transform: uppercase;
          font-family: $font-family-heading;
          font-weight: $font-weight-bold;
          color: $color-decorative-title;
          text-shadow: $shadow-decorative-title;
          opacity: 0.9;
          display: flex;
          flex-direction: column;
          line-height: 1;
          margin-bottom: $spacing-lg;
          span{
            font-size: $font-size-2xl;
          }
        }
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

    // Element: grid
    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: $spacing-lg;

      @media (max-width: $breakpoint-md) {
        grid-template-columns: 1fr;
      }
    }

    // Element: card
    &__card {
      text-decoration: none;
      color: inherit;

      &--recipes {
        @include retro-grain(0.15);
        background-image: url('/assets/images/52122fb2-7c16-43c4-ab68-d3669ef31c0e.png');
        background-size: cover;
        background-position: center;
        border-radius: $radius-xl;
        padding: $spacing-lg;
        box-shadow: $shadow-md;
        transition: all $transition-base $transition-ease;
        overflow: hidden;

        &:hover {
          transform: translateY(-2px);
          box-shadow: $shadow-lg;
        }
      }

      &--plannings {
        @include retro-grain(0.15);
        background-image: url('/assets/images/a8800c87-1ca0-4225-ab1e-adcb646fbf18.png');
        background-size: cover;
        background-position: center;
        border-radius: $radius-xl;
        padding: $spacing-lg;
        box-shadow: $shadow-md;
        transition: all $transition-base $transition-ease;
        overflow: hidden;

        &:hover {
          transform: translateY(-2px);
          box-shadow: $shadow-lg;
        }
      }

      &--shopping {
        @include retro-grain(0.15);
        background-image: url('/assets/images/375f5d6f-4fd3-4293-8af7-84e87db0b4e7.png');
        background-size: cover;
        background-position: center;
        border-radius: $radius-xl;
        padding: $spacing-lg;
        box-shadow: $shadow-md;
        transition: all $transition-base $transition-ease;
        overflow: hidden;

        &:hover {
          transform: translateY(-2px);
          box-shadow: $shadow-lg;
        }
      }
    }

    // Element: card-content
    &__card-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      z-index: 1;
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
  }
</style>
