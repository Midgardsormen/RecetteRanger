<script lang="ts">
  /**
   * Logo Component
   *
   * Application logo with multiple variants for different contexts.
   * Features responsive sizing and decorative shadow effects.
   */

  import type { LogoProps } from '../../../types/ui.types';
  import { IMAGES } from '../../../constants';
  import { LOGO_DEFAULTS, LOGO_ALT_TEXT } from './Logo.config';

  let {
    variant = LOGO_DEFAULTS.variant,
    href = LOGO_DEFAULTS.href,
  }: LogoProps = $props();
</script>

<a {href} class="logo logo--{variant}">
  <div class="logo__wrapper">
    <img src={IMAGES.logo.main} alt={LOGO_ALT_TEXT} class="logo__image" />
  </div>
  <span class="logo__text">RecetteRanger</span>
</a>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: opacity $transition-base;
    background: $brand-cream;
    border-radius: $radius-full;
    z-index: 100;

    // Mobile-first: Logo centré et plus grand pour les pages internes
    position: absolute;
    top: 0;
    left: 100px;
    transform: translateX(-50%);
    width: 85px;
    height: 85px;
    box-shadow:
      2px 2px 0 $brand-red,
      4px 4px 0 $brand-red,
      0 4px 12px $color-black-alpha-20,
      0 2px 5px $color-black-alpha-15;
    flex-shrink: 0; // Empêche le logo de rétrécir

    // Tablet: taille augmentée
    @media (min-width: $breakpoint-md) {
      width: 110px;
      height: 110px;
      left: 50%;
      box-shadow:
        2.5px 2.5px 0 $brand-red,
        5px 5px 0 $brand-red,
        0 5px 15px $color-black-alpha-20,
        0 2.5px 5px $color-black-alpha-15;
    }

    // Desktop: taille augmentée
    @media (min-width: $breakpoint-lg) {
      width: 130px;
      height: 130px;
      box-shadow:
        3px 3px 0 $brand-red,
        6px 6px 0 $brand-red,
        0 6px 18px $color-black-alpha-20,
        0 3px 6px $color-black-alpha-15;
    }

    &:hover {
      opacity: $opacity-90;
    }

    // Variant: Landing page (non-authenticated homepage)
    &--landing {
      // Mobile: centré pour éviter le chevauchement avec le burger menu
      position: absolute;
      top: 0;
      width: 140px;
      height: 140px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow:
        4px 4px 0 $brand-red,
        8px 8px 0 $brand-red,
        0 8px 24px $color-black-alpha-20,
        0 4px 8px $color-black-alpha-15;

      // Small mobile: centré
      @media (min-width: $breakpoint-sm) {
        width: 150px;
        height: 150px;
      }

      // Tablet
      @media (min-width: $breakpoint-md) {
        width: 200px;
        height: 200px;
      }

      // Desktop
      @media (min-width: $breakpoint-lg) {
        width: 220px;
        height: 220px;
      }

      .logo__image {
        // Mobile
        width: 120px;
        height: 120px;

        // Tablet
        @media (min-width: $breakpoint-md) {
          width: 160px;
          height: 160px;
        }

        // Desktop
        @media (min-width: $breakpoint-lg) {
          width: 180px;
          height: 180px;
        }
      }
    }

    // Variant: Home page (authenticated user)
    // Taille intermédiaire entre default et landing
    &--home {
      // Mobile: centré pour éviter le chevauchement avec le burger menu
      position: absolute;
      top: 0;
      width: 110px;
      height: 110px;
      left: 100px;
      
      transform: translateX(-50%);
      box-shadow:
        2.5px 2.5px 0 $brand-red,
        5px 5px 0 $brand-red,
        0 5px 15px $color-black-alpha-20,
        0 2.5px 5px $color-black-alpha-15;

      // Small mobile: centré
      @media (min-width: $breakpoint-sm) {
        left: 50%;
        width: 120px;
        height: 120px;
      }

      // Tablet
      @media (min-width: $breakpoint-md) {
        width: 150px;
        height: 150px;
        box-shadow:
          3px 3px 0 $brand-red,
          6px 6px 0 $brand-red,
          0 6px 18px $color-black-alpha-20,
          0 3px 6px $color-black-alpha-15;
      }

      // Desktop
      @media (min-width: $breakpoint-lg) {
        width: 180px;
        height: 180px;
      }

      .logo__image {
        // Mobile
        width: 90px;
        height: 90px;

        // Tablet
        @media (min-width: $breakpoint-md) {
          width: 110px;
          height: 110px;
        }

        // Desktop
        @media (min-width: $breakpoint-lg) {
          width: 140px;
          height: 140px;
        }
      }
    }

    // Variant: Public pages (legal, privacy, etc.)
    &--public {
      position: absolute;
      top: 0;
      width: 80px;
      height: 80px;
      left: 0;
      box-shadow:
        1.5px 1.5px 0 $brand-red,
        3px 3px 0 $brand-red,
        0 3px 10px $color-black-alpha-20,
        0 1.5px 4px $color-black-alpha-15;

      // Tablet: centré horizontalement
      @media (min-width: $breakpoint-md) {
        width: 120px;
        height: 120px;
        box-shadow:
          2.5px 2.5px 0 $brand-red,
          5px 5px 0 $brand-red,
          0 5px 15px $color-black-alpha-20,
          0 2.5px 5px $color-black-alpha-15;
        left: 50%;
        transform: translateX(-50%);
      }

      // Desktop: taille augmentée
      @media (min-width: $breakpoint-lg) {
        width: 160px;
        height: 160px;
        box-shadow:
          3px 3px 0 $brand-red,
          6px 6px 0 $brand-red,
          0 7px 20px $color-black-alpha-20,
          0 3.5px 7px $color-black-alpha-15;
      }

      .logo__image {
        // Mobile
        width: 60px;
        height: 60px;

        // Tablet
        @media (min-width: $breakpoint-md) {
          width: 85px;
          height: 85px;
        }

        // Desktop
        @media (min-width: $breakpoint-lg) {
          width: 120px;
          height: 120px;
        }
      }
    }

    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__image {
      object-fit: contain;

      // Mobile-first: Taille par défaut (mobile) - augmentée pour les pages internes
      width: 70px;
      height: 70px;

      // Tablet
      @media (min-width: $breakpoint-md) {
        width: 85px;
        height: 85px;
      }

      // Desktop
      @media (min-width: $breakpoint-lg) {
        width: 100px;
        height: 100px;
      }
    }

    &__text {
      // Masqué visuellement mais accessible aux lecteurs d'écran
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  }
</style>
