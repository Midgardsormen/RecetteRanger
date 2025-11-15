<script lang="ts">
  import { cookieConsentStore, type CookieConsent } from '../stores/cookie-consent.store';
  import Modal from './ui/Modal.svelte';
  import Button from './ui/Button.svelte';

  let consent = $state<CookieConsent>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  // Synchroniser avec le store
  $effect(() => {
    const state = $cookieConsentStore;
    consent = { ...state.consent };
  });

  function savePreferences() {
    cookieConsentStore.savePreferences(consent);
  }

  function acceptAll() {
    consent = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    cookieConsentStore.savePreferences(consent);
  }

  function rejectAll() {
    cookieConsentStore.rejectAll();
  }

  function closeModal() {
    cookieConsentStore.setPreferencesVisibility(false);
  }
</script>

{#if $cookieConsentStore.showPreferences}
  <Modal isOpen={true} title="Gérer mes préférences de cookies" size="large" onClose={closeModal}>
    <div class="cookie-prefs">
      <p class="cookie-prefs__intro">
        Nous utilisons différents types de cookies pour améliorer votre expérience.
        Vous pouvez choisir les catégories que vous souhaitez autoriser.
        Les cookies nécessaires sont toujours activés car ils sont essentiels au fonctionnement du site.
      </p>

      <div class="cookie-prefs__categories">
        <!-- Cookies nécessaires -->
        <div class="cookie-category cookie-category--required">
          <div class="cookie-category__header">
            <div class="cookie-category__toggle">
              <input
                type="checkbox"
                id="necessary"
                checked
                disabled
                class="cookie-category__checkbox"
              />
              <label for="necessary" class="cookie-category__label">
                <span class="cookie-category__name">Cookies nécessaires</span>
                <span class="cookie-category__badge cookie-category__badge--required">Toujours activés</span>
              </label>
            </div>
          </div>
          <p class="cookie-category__description">
            Ces cookies sont indispensables au bon fonctionnement du site.
            Ils permettent d'utiliser les fonctionnalités principales comme la connexion,
            la navigation sécurisée et la protection contre les attaques.
          </p>
          <details class="cookie-category__details">
            <summary>Voir les détails</summary>
            <ul class="cookie-category__list">
              <li><strong>auth_token</strong> : Cookie d'authentification (expire après 7 jours)</li>
              <li><strong>session</strong> : Cookie de session pour maintenir votre connexion</li>
              <li><strong>csrf_token</strong> : Protection contre les attaques CSRF</li>
            </ul>
          </details>
        </div>

        <!-- Cookies fonctionnels -->
        <div class="cookie-category">
          <div class="cookie-category__header">
            <div class="cookie-category__toggle">
              <input
                type="checkbox"
                id="functional"
                bind:checked={consent.functional}
                class="cookie-category__checkbox"
              />
              <label for="functional" class="cookie-category__label">
                <span class="cookie-category__name">Cookies fonctionnels</span>
              </label>
            </div>
          </div>
          <p class="cookie-category__description">
            Ces cookies permettent de mémoriser vos préférences (langue, thème, etc.)
            et d'améliorer votre confort d'utilisation du site.
          </p>
          <details class="cookie-category__details">
            <summary>Voir les détails</summary>
            <ul class="cookie-category__list">
              <li><strong>user_preferences</strong> : Vos préférences d'affichage et de navigation</li>
              <li><strong>language</strong> : Langue préférée (si applicable)</li>
              <li><strong>theme</strong> : Thème clair/sombre (si applicable)</li>
            </ul>
          </details>
        </div>

        <!-- Cookies analytiques -->
        <div class="cookie-category">
          <div class="cookie-category__header">
            <div class="cookie-category__toggle">
              <input
                type="checkbox"
                id="analytics"
                bind:checked={consent.analytics}
                class="cookie-category__checkbox"
              />
              <label for="analytics" class="cookie-category__label">
                <span class="cookie-category__name">Cookies analytiques</span>
              </label>
            </div>
          </div>
          <p class="cookie-category__description">
            Ces cookies nous aident à comprendre comment vous utilisez le site
            afin d'améliorer votre expérience. Les données sont anonymisées.
          </p>
          <details class="cookie-category__details">
            <summary>Voir les détails</summary>
            <ul class="cookie-category__list">
              <li><strong>_ga</strong> : Google Analytics - Identifiant unique</li>
              <li><strong>_gid</strong> : Google Analytics - Identifiant de session</li>
              <li><strong>_gat</strong> : Google Analytics - Limitation du taux de requêtes</li>
            </ul>
            <p class="cookie-category__note">
              <strong>Note :</strong> Actuellement, aucun service d'analytics n'est configuré.
              Cette catégorie est préparée pour une future intégration.
            </p>
          </details>
        </div>

        <!-- Cookies marketing -->
        <div class="cookie-category">
          <div class="cookie-category__header">
            <div class="cookie-category__toggle">
              <input
                type="checkbox"
                id="marketing"
                bind:checked={consent.marketing}
                class="cookie-category__checkbox"
              />
              <label for="marketing" class="cookie-category__label">
                <span class="cookie-category__name">Cookies marketing</span>
              </label>
            </div>
          </div>
          <p class="cookie-category__description">
            Ces cookies sont utilisés pour afficher des publicités personnalisées
            et mesurer l'efficacité de nos campagnes publicitaires.
          </p>
          <details class="cookie-category__details">
            <summary>Voir les détails</summary>
            <ul class="cookie-category__list">
              <li><strong>_fbp</strong> : Facebook Pixel</li>
              <li><strong>_gcl_au</strong> : Google AdSense</li>
            </ul>
            <p class="cookie-category__note">
              <strong>Note :</strong> Actuellement, aucun service de marketing n'est configuré.
              Cette catégorie est préparée pour une future intégration.
            </p>
          </details>
        </div>
      </div>

      <div class="cookie-prefs__info">
        <h3>Vos droits RGPD</h3>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD),
          vous disposez des droits suivants :
        </p>
        <ul>
          <li><strong>Droit d'accès</strong> : Consulter les données que nous détenons sur vous</li>
          <li><strong>Droit de rectification</strong> : Corriger vos données personnelles</li>
          <li><strong>Droit à l'effacement</strong> : Supprimer vos données ("droit à l'oubli")</li>
          <li><strong>Droit d'opposition</strong> : Refuser le traitement de vos données</li>
          <li><strong>Droit à la portabilité</strong> : Récupérer vos données dans un format structuré</li>
          <li><strong>Droit de retrait du consentement</strong> : Retirer votre consentement à tout moment</li>
        </ul>
        <p>
          Pour exercer ces droits, consultez notre
          <a href="/privacy-policy" class="cookie-prefs__link">politique de confidentialité</a>
          ou contactez-nous.
        </p>
      </div>

      <div class="cookie-prefs__actions">
        <Button variant="outline" onclick={rejectAll}>
          Tout refuser
        </Button>
        <Button variant="outline" onclick={acceptAll}>
          Tout accepter
        </Button>
        <Button variant="primary" onclick={savePreferences}>
          Enregistrer mes choix
        </Button>
      </div>
    </div>
  </Modal>
{/if}

<style lang="scss">
  @use '../styles/variables' as *;

  .cookie-prefs {
    &__intro {
      margin: 0 0 $spacing-lg 0;
      color: $color-gray-700;
      line-height: 1.6;
    }

    &__categories {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      margin-bottom: $spacing-lg;
    }

    &__info {
      background: $color-gray-50;
      padding: $spacing-md;
      border-radius: $radius-md;
      margin-bottom: $spacing-lg;

      h3 {
        margin: 0 0 $spacing-sm 0;
        color: $brand-primary;
        font-size: $font-size-lg;
      }

      p {
        margin: 0 0 $spacing-sm 0;
        color: $color-gray-700;
        font-size: $font-size-sm;
      }

      ul {
        margin: $spacing-sm 0;
        padding-left: $spacing-lg;
        color: $color-gray-700;
        font-size: $font-size-sm;

        li {
          margin-bottom: $spacing-xs;
        }
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

    &__actions {
      display: flex;
      gap: $spacing-sm;
      justify-content: flex-end;
      padding-top: $spacing-md;
      border-top: 1px solid $color-gray-200;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;

        :global(button) {
          width: 100%;
        }
      }
    }
  }

  .cookie-category {
    border: 1px solid $color-gray-200;
    border-radius: $radius-md;
    padding: $spacing-md;
    transition: all 0.2s ease;

    &:hover {
      border-color: $brand-primary;
      box-shadow: 0 2px 8px $color-black-alpha-10;
    }

    &--required {
      background: $color-gray-50;
      border-color: $color-gray-300;
    }

    &__header {
      margin-bottom: $spacing-sm;
    }

    &__toggle {
      display: flex;
      align-items: center;
    }

    &__checkbox {
      width: 20px;
      height: 20px;
      margin-right: $spacing-sm;
      cursor: pointer;
      accent-color: $brand-primary;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    &__label {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      cursor: pointer;
      flex: 1;

      input:disabled ~ & {
        cursor: not-allowed;
      }
    }

    &__name {
      font-weight: $font-weight-semibold;
      color: $color-gray-800;
      font-size: $font-size-base;
    }

    &__badge {
      font-size: $font-size-xs;
      padding: 2px 8px;
      border-radius: $radius-sm;
      background: $color-gray-200;
      color: $color-gray-700;
      font-weight: $font-weight-medium;

      &--required {
        background: $brand-primary;
        color: $color-white;
      }
    }

    &__description {
      margin: 0 0 $spacing-sm 0;
      color: $color-gray-600;
      font-size: $font-size-sm;
      line-height: 1.5;
    }

    &__details {
      margin-top: $spacing-sm;

      summary {
        cursor: pointer;
        color: $brand-primary;
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;
        user-select: none;

        &:hover {
          color: $brand-quaternary;
        }
      }
    }

    &__list {
      margin: $spacing-sm 0 0 0;
      padding-left: $spacing-lg;
      color: $color-gray-600;
      font-size: $font-size-sm;

      li {
        margin-bottom: $spacing-xs;
      }

      strong {
        color: $color-gray-800;
      }
    }

    &__note {
      margin-top: $spacing-sm;
      padding: $spacing-sm;
      background: $color-warning-light;
      border-left: 3px solid $color-warning;
      border-radius: $radius-sm;
      font-size: $font-size-sm;
      color: $color-gray-700;

      strong {
        color: $color-warning-dark;
      }
    }
  }
</style>
