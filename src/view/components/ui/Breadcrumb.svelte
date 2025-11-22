<script lang="ts">
  /**
   * Breadcrumb Component
   *
   * Deux modes disponibles :
   *
   * 1. Mode 'simple' : Juste une flèche de retour (desktop et mobile)
   *    <Breadcrumb mode="simple" backLabel="Retour" onBack={handleBack} />
   *    ou avec href :
   *    <Breadcrumb mode="simple" backLabel="Mes recettes" backHref="/recettes" />
   *
   * 2. Mode 'full' : Breadcrumb complet avec arborescence (se transforme en flèche sur mobile)
   *    <Breadcrumb
   *      mode="full"
   *      items={[
   *        { label: 'Recettes', href: '/recettes' },
   *        { label: 'Desserts', href: '/recettes?category=desserts' },
   *        { label: 'Tarte aux pommes' }
   *      ]}
   *      showHomeIcon={true}
   *      separator="/"
   *    />
   */

  import { Home } from 'lucide-svelte';
  import { BackButton } from './';
  import { handleBreadcrumbClick } from '../../utils';
  import type { BreadcrumbProps, BreadcrumbItem } from '../../types';

  let {
    items = [],
    mode = 'simple',
    showHomeIcon = true,
    separator = '/',
    backLabel,
    backHref,
    onBack
  }: BreadcrumbProps = $props();

  function handleItemClick(item: BreadcrumbItem, e: MouseEvent) {
    handleBreadcrumbClick(item.onclick, e);
  }
</script>

{#if mode === 'simple'}
  <!-- Mode simple : juste une flèche de retour -->
  <nav class="breadcrumb breadcrumb--simple" aria-label="Breadcrumb">
    <BackButton label={backLabel} href={backHref} onclick={onBack} />
  </nav>
{:else if mode === 'full'}
  <!-- Mode complet : breadcrumb avec arborescence -->
  <nav class="breadcrumb breadcrumb--full" aria-label="Breadcrumb">
    <ol class="breadcrumb__list">
      {#if showHomeIcon}
        <li class="breadcrumb__item breadcrumb__item--home">
          <a href="/" class="breadcrumb__link">
            <Home class="breadcrumb__home-icon" size={16} />
            <span class="breadcrumb__home-text">Accueil</span>
          </a>
        </li>
      {/if}

      {#each items as item, index}
        <li class="breadcrumb__item" class:breadcrumb__item--active={index === items.length - 1}>
          {#if index < items.length - 1}
            <span class="breadcrumb__separator" aria-hidden="true">{separator}</span>
            {#if item.href}
              <a href={item.href} class="breadcrumb__link" onclick={(e) => handleItemClick(item, e)}>
                {item.label}
              </a>
            {:else if item.onclick}
              <button type="button" class="breadcrumb__link" onclick={(e) => handleItemClick(item, e)}>
                {item.label}
              </button>
            {:else}
              <span class="breadcrumb__text">{item.label}</span>
            {/if}
          {:else}
            <span class="breadcrumb__separator" aria-hidden="true">{separator}</span>
            <span class="breadcrumb__text breadcrumb__text--current" aria-current="page">
              {item.label}
            </span>
          {/if}
        </li>
      {/each}
    </ol>

    <!-- Version mobile : juste une flèche de retour -->
    {#if items.length > 0}
      {@const previousItem = items.length > 1 ? items[items.length - 2] : null}
      <div class="breadcrumb__mobile">
        {#if previousItem}
          <BackButton
            label={previousItem.label}
            href={previousItem.href}
            onclick={previousItem.onclick}
          />
        {:else if showHomeIcon}
          <BackButton label="Accueil" href="/" />
        {/if}
      </div>
    {/if}
  </nav>
{/if}

<style lang="scss">
  @use '../../styles/variables' as *;

  .breadcrumb {
    margin-bottom: $spacing-md;

    // Mode complet
    &--full {
      .breadcrumb__list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: $spacing-xs;
        list-style: none;
        padding: 0;
        margin: 0;

        @media (max-width: $breakpoint-md) {
          display: none;
        }
      }

      .breadcrumb__mobile {
        display: none;

        @media (max-width: $breakpoint-md) {
          display: block;
        }
      }

      .breadcrumb__item {
        display: flex;
        align-items: center;
        gap: $spacing-xs;

        &--home {
          .breadcrumb__home-text {
            @media (max-width: $breakpoint-lg) {
              display: none;
            }
          }
        }
      }

      .breadcrumb__separator {
        color: $color-text-tertiary;
        user-select: none;
        margin: 0 $spacing-xs;
      }

      .breadcrumb__link {
        color: $color-text-secondary;
        text-decoration: none;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        transition: color $transition-base $transition-ease;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        font-family: $font-family-base;

        &:hover {
          color: $brand-primary;
          text-decoration: underline;
        }

        &:focus-visible {
          outline: 2px solid $brand-primary;
          outline-offset: 2px;
          border-radius: $radius-sm;
        }
      }

      .breadcrumb__text {
        color: $color-text-secondary;
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;

        &--current {
          color: $color-text-primary;
          font-weight: $font-weight-semibold;
        }
      }

      :global(.breadcrumb__home-icon) {
        flex-shrink: 0;
      }
    }
  }
</style>
