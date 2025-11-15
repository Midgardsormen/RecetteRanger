<script lang="ts">
  import { cookieConsentStore } from '../stores/cookie-consent.store';
  import Button from './ui/Button.svelte';

  function acceptAll() {
    cookieConsentStore.acceptAll();
  }

  function rejectAll() {
    cookieConsentStore.rejectAll();
  }

  function showPreferences() {
    cookieConsentStore.setBannerVisibility(false);
    cookieConsentStore.setPreferencesVisibility(true);
  }
</script>

{#if $cookieConsentStore.showBanner}
  <div class="cookie-consent">
    <div class="cookie-consent__overlay"></div>
    <div class="cookie-consent__banner">
      <div class="cookie-consent__content">
        <h2 class="cookie-consent__title">🍪 Respect de votre vie privée</h2>
        <p class="cookie-consent__text">
          Nous utilisons des cookies pour améliorer votre expérience sur RecetteRanger.
          Certains cookies sont <strong>nécessaires</strong> au fonctionnement du site (authentification, sécurité),
          tandis que d'autres sont <strong>optionnels</strong> et nous aident à améliorer nos services.
        </p>
        <p class="cookie-consent__text cookie-consent__text--small">
          En cliquant sur "Tout accepter", vous acceptez l'utilisation de tous les cookies.
          Vous pouvez personnaliser vos choix ou tout refuser.
          Consultez notre <a href="/privacy-policy" class="cookie-consent__link">politique de confidentialité</a>
          pour plus d'informations.
        </p>

        <div class="cookie-consent__categories">
          <div class="cookie-consent__category">
            <span class="cookie-consent__category-icon">✓</span>
            <div>
              <strong>Cookies nécessaires</strong>
              <small>(Toujours activés)</small>
            </div>
          </div>
          <div class="cookie-consent__category cookie-consent__category--optional">
            <span class="cookie-consent__category-icon">?</span>
            <div>
              <strong>Cookies optionnels</strong>
              <small>(Fonctionnels, analytiques, marketing)</small>
            </div>
          </div>
        </div>
      </div>

      <div class="cookie-consent__actions">
        <Button variant="outline" size="small" onclick={rejectAll}>
          Refuser tout
        </Button>
        <Button variant="outline" size="small" onclick={showPreferences}>
          Personnaliser
        </Button>
        <Button variant="primary" size="small" onclick={acceptAll}>
          Tout accepter
        </Button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../styles/variables' as *;

  .cookie-consent {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    animation: slideUp 0.3s ease-out;

    &__overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: $color-background-overlay;
      backdrop-filter: blur(2px);
    }

    &__banner {
      position: relative;
      background: $color-white;
      border-top: 4px solid $brand-primary;
      box-shadow: 0 -4px 20px $color-black-alpha-20;
      padding: $spacing-lg;
      max-width: 900px;
      margin: 0 auto;
      border-radius: $radius-lg $radius-lg 0 0;

      @media (max-width: $breakpoint-md) {
        padding: $spacing-md;
        border-radius: 0;
      }
    }

    &__content {
      margin-bottom: $spacing-lg;
    }

    &__title {
      margin: 0 0 $spacing-md 0;
      color: $brand-primary;
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-lg;
      }
    }

    &__text {
      margin: 0 0 $spacing-sm 0;
      color: $color-gray-700;
      line-height: 1.6;

      &--small {
        font-size: $font-size-sm;
        color: $color-gray-600;
      }

      strong {
        color: $brand-primary;
        font-weight: $font-weight-semibold;
      }
    }

    &__link {
      color: $brand-primary;
      text-decoration: underline;
      font-weight: $font-weight-semibold;

      &:hover {
        color: $brand-quaternary;
      }
    }

    &__categories {
      display: flex;
      gap: $spacing-md;
      margin-top: $spacing-md;
      padding: $spacing-md;
      background: $color-gray-50;
      border-radius: $radius-md;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        gap: $spacing-sm;
      }
    }

    &__category {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      flex: 1;

      small {
        display: block;
        color: $color-gray-600;
        font-size: $font-size-xs;
      }

      &--optional {
        opacity: 0.8;
      }
    }

    &__category-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: $brand-primary;
      color: $color-white;
      font-weight: $font-weight-bold;
      font-size: $font-size-sm;
      flex-shrink: 0;
    }

    &__actions {
      display: flex;
      gap: $spacing-sm;
      justify-content: flex-end;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;

        :global(button) {
          width: 100%;
        }
      }
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
