<script lang="ts">
  import { cookieConsentStore, type CookieConsent } from '../../../stores/cookie-consent.store';
  import { Modal, Button, Link } from '../../ui';
  import CookieCategoryDetail from './CookieCategoryDetail.svelte';
  import {
    savePreferences,
    acceptAllPreferences,
    rejectAllPreferences,
    closePreferencesModal,
  } from './cookie-preferences.actions';
  import { COOKIE_PREFERENCES_CONFIG } from './cookie-preferences.config';

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

  function handleSavePreferences() {
    savePreferences(consent);
  }

  function handleAcceptAll() {
    consent = acceptAllPreferences();
  }

  function handleRejectAll() {
    rejectAllPreferences();
  }

  function handleClose() {
    closePreferencesModal();
  }
</script>

{#if $cookieConsentStore.showPreferences}
  <Modal
    isOpen={true}
    title={COOKIE_PREFERENCES_CONFIG.title}
    size="large"
    onClose={handleClose}
  >
    <div class="cookie-prefs">
      <p class="cookie-prefs__intro">
        {COOKIE_PREFERENCES_CONFIG.intro}
      </p>

      <div class="cookie-prefs__categories">
        {#each COOKIE_PREFERENCES_CONFIG.categories as category}
          <CookieCategoryDetail {category} bind:checked={consent[category.id]} />
        {/each}
      </div>

      <div class="cookie-prefs__info">
        <h3>{COOKIE_PREFERENCES_CONFIG.gdpr.title}</h3>
        <p>
          {COOKIE_PREFERENCES_CONFIG.gdpr.intro}
        </p>
        <ul>
          {#each COOKIE_PREFERENCES_CONFIG.gdpr.rights as right}
            <li><strong>{right.name}</strong> : {right.description}</li>
          {/each}
        </ul>
        <p>
          {COOKIE_PREFERENCES_CONFIG.gdpr.footer}
          <Link href={COOKIE_PREFERENCES_CONFIG.gdpr.privacyPolicyLink} variant="primary">
            {COOKIE_PREFERENCES_CONFIG.gdpr.privacyPolicyText}
          </Link>
          {COOKIE_PREFERENCES_CONFIG.gdpr.footerEnd}
        </p>
      </div>

      <div class="cookie-prefs__actions">
        <Button variant="outline" onclick={handleRejectAll}>
          {COOKIE_PREFERENCES_CONFIG.buttons.rejectAll}
        </Button>
        <Button variant="outline" onclick={handleAcceptAll}>
          {COOKIE_PREFERENCES_CONFIG.buttons.acceptAll}
        </Button>
        <Button variant="primary" onclick={handleSavePreferences}>
          {COOKIE_PREFERENCES_CONFIG.buttons.savePreferences}
        </Button>
      </div>
    </div>
  </Modal>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .cookie-prefs {
    &__intro {
      margin: 0 0 $spacing-lg 0;
      color: $color-text-secondary;
      line-height: $line-height-relaxed;
    }

    &__categories {
      display: flex;
      flex-direction: column;
      gap: $spacing-md;
      margin-bottom: $spacing-lg;
    }

    &__info {
      background: $color-background-secondary;
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
        color: $color-text-secondary;
        font-size: $font-size-sm;
      }

      ul {
        margin: $spacing-sm 0;
        padding-left: $spacing-lg;
        color: $color-text-secondary;
        font-size: $font-size-sm;

        li {
          margin-bottom: $spacing-xs;
        }
      }
    }

    &__actions {
      display: flex;
      gap: $spacing-sm;
      justify-content: flex-end;
      padding-top: $spacing-md;
      border-top: 1px solid $color-border-primary;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;

        :global(button) {
          width: 100%;
        }
      }
    }
  }
</style>
