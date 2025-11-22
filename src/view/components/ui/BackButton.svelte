<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import { handleBreadcrumbClick } from '../../utils';
  import type { BackButtonProps } from '../../types';

  let {
    label,
    href,
    onclick,
    iconSize = 20
  }: BackButtonProps = $props();

  function handleClick(e: MouseEvent) {
    handleBreadcrumbClick(onclick, e);
  }
</script>

{#if href}
  <a {href} class="back-button" {onclick}>
    <ArrowLeft class="back-button__icon" size={iconSize} />
    {#if label}
      <span class="back-button__label">{label}</span>
    {/if}
  </a>
{:else if onclick}
  <button type="button" class="back-button" onclick={handleClick}>
    <ArrowLeft class="back-button__icon" size={iconSize} />
    {#if label}
      <span class="back-button__label">{label}</span>
    {/if}
  </button>
{/if}

<style lang="scss">
  @use '../../styles/variables' as *;

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $color-text-secondary;
    text-decoration: none;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    transition: color $transition-base $transition-ease;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: $font-family-base;

    &:hover {
      color: $brand-primary;

      :global(.back-button__icon) {
        transform: translateX(-$spacing-xs);
      }
    }

    &:focus-visible {
      outline: 2px solid $brand-primary;
      outline-offset: $spacing-xs;
      border-radius: $radius-sm;
    }

    &__label {
      display: none;

      @media (min-width: $breakpoint-sm) {
        display: inline;
      }
    }
  }

  :global(.back-button__icon) {
    transition: transform $transition-base $transition-ease;
    flex-shrink: 0;
  }
</style>
