<script lang="ts">
  import { cookieConsentStore } from '../../../stores/cookie-consent.store';
  import { Button, Link, IconText } from '../../ui';
  import { acceptAll, rejectAll, showPreferences } from './cookie-consent.actions';
  import { COOKIE_CONSENT_CONFIG } from './cookie-consent.config';
  import { Check, HelpCircle } from 'lucide-svelte';
</script>

{#if $cookieConsentStore.showBanner}
  <div class="cookie-consent">
    <div class="cookie-consent__overlay"></div>
    <div class="cookie-consent__banner">
      <div class="cookie-consent__content">
        <h2 class="cookie-consent__title">{COOKIE_CONSENT_CONFIG.title}</h2>

        <p class="cookie-consent__text">
          {COOKIE_CONSENT_CONFIG.description.main}
        </p>

        <p class="cookie-consent__text cookie-consent__text--small">
          {COOKIE_CONSENT_CONFIG.description.additional}
          <Link href={COOKIE_CONSENT_CONFIG.description.privacyPolicyLink} variant="primary">
            {COOKIE_CONSENT_CONFIG.description.privacyPolicyText}
          </Link>
        </p>

        <div class="cookie-consent__categories">
          {#each COOKIE_CONSENT_CONFIG.categories as category}
            <IconText
              title={category.title}
              description={category.description}
              variant="primary"
              size="medium"
              disabled={!category.required}
            >
              {#snippet icon()}
                {#if category.id === 'necessary'}
                  <Check size={20} />
                {:else}
                  <HelpCircle size={20} />
                {/if}
              {/snippet}
            </IconText>
          {/each}
        </div>
      </div>

      <div class="cookie-consent__actions">
        <Button variant="outline" size="small" onclick={rejectAll}>
          {COOKIE_CONSENT_CONFIG.buttons.rejectAll}
        </Button>
        <Button variant="outline" size="small" onclick={showPreferences}>
          {COOKIE_CONSENT_CONFIG.buttons.customize}
        </Button>
        <Button variant="primary" size="small" onclick={acceptAll}>
          {COOKIE_CONSENT_CONFIG.buttons.acceptAll}
        </Button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../../styles/variables' as *;

  .cookie-consent {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: $z-index-cookie-banner;
    animation: slideUp $transition-base $transition-ease;

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
      color: $color-text-secondary;
      line-height: $line-height-relaxed;

      &--small {
        font-size: $font-size-sm;
        color: $color-text-tertiary;
      }
    }

    &__categories {
      display: flex;
      gap: $spacing-md;
      margin-top: $spacing-md;
      padding: $spacing-md;
      background: $color-background-secondary;
      border-radius: $radius-md;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;
        gap: $spacing-sm;
      }
    }

    &__actions {
      display: flex;
      gap: $spacing-sm;
      justify-content: flex-end;

      @media (max-width: $breakpoint-md) {
        flex-direction: column;

        > :global(*) {
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
