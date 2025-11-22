<script lang="ts">
  /**
   * CookieCategoryDetail Component
   *
   * Reusable component to display detailed cookie category with checkbox, description,
   * and expandable details section
   */
  import type { CookieCategoryPreference } from './cookie-preferences.config';
  import { COOKIE_PREFERENCES_CONFIG } from './cookie-preferences.config';
  import { Badge } from '../../ui';

  let {
    category,
    checked = $bindable(false),
  }: {
    category: CookieCategoryPreference;
    checked?: boolean;
  } = $props();
</script>

<div class="cookie-category" class:cookie-category--required={category.required}>
  <div class="cookie-category__header">
    <div class="cookie-category__toggle">
      <input
        type="checkbox"
        id={category.id}
        bind:checked
        disabled={category.required}
        class="cookie-category__checkbox"
      />
      <label for={category.id} class="cookie-category__label">
        <span class="cookie-category__name">{category.name}</span>
        {#if category.required}
          <Badge variant="primary" size="small">
            {COOKIE_PREFERENCES_CONFIG.badges.required}
          </Badge>
        {/if}
      </label>
    </div>
  </div>

  <p class="cookie-category__description">
    {category.description}
  </p>

  <details class="cookie-category__details">
    <summary>{COOKIE_PREFERENCES_CONFIG.detailsLabel}</summary>
    <ul class="cookie-category__list">
      {#each category.cookies as cookie}
        <li><strong>{cookie.name}</strong> : {cookie.description}</li>
      {/each}
    </ul>
    {#if category.note}
      <p class="cookie-category__note">
        <strong>Note :</strong>
        {category.note}
      </p>
    {/if}
  </details>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .cookie-category {
    border: 1px solid $color-border-primary;
    border-radius: $radius-md;
    padding: $spacing-md;
    transition: all $transition-base $transition-ease;

    &:hover {
      border-color: $brand-primary;
      box-shadow: 0 2px 8px $color-black-alpha-10;
    }

    &--required {
      background: $color-background-secondary;
      border-color: $color-border-secondary;
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
        opacity: $opacity-60;
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
      color: $color-text-primary;
      font-size: $font-size-base;
    }

    &__description {
      margin: 0 0 $spacing-sm 0;
      color: $color-text-secondary;
      font-size: $font-size-sm;
      line-height: $line-height-relaxed;
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
      color: $color-text-secondary;
      font-size: $font-size-sm;

      li {
        margin-bottom: $spacing-xs;
      }

      strong {
        color: $color-text-primary;
      }
    }

    &__note {
      margin-top: $spacing-sm;
      padding: $spacing-sm;
      background: $color-warning-light;
      border-left: 3px solid $color-warning;
      border-radius: $radius-sm;
      font-size: $font-size-sm;
      color: $color-text-secondary;

      strong {
        color: $color-warning-dark;
      }
    }
  }
</style>
