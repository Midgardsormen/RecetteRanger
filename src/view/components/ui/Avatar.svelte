<script lang="ts">
  import type { AvatarProps } from '../../types';

  let {
    src,
    alt = '',
    fallback = '',
    icon,
    size = 'medium'
  }: AvatarProps = $props();
</script>

<div class="avatar avatar--{size}">
  {#if src}
    <img {src} {alt} class="avatar__image" />
  {:else if icon}
    <div class="avatar__icon">
      {@render icon()}
    </div>
  {:else if fallback}
    <span class="avatar__fallback">{fallback}</span>
  {/if}
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .avatar {
    border-radius: $radius-full;
    overflow: hidden;
    background: $color-white-alpha-20;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    // Sizes (mobile-first)
    &--small {
      width: 24px;
      height: 24px;
    }

    &--medium {
      width: 32px;
      height: 32px;
    }

    &--large {
      width: 48px;
      height: 48px;

      @media (min-width: $breakpoint-md) {
        width: 64px;
        height: 64px;
      }
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity $transition-base $transition-ease;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: $color-gray-600;
      background: $color-gray-200;
      transition: all $transition-base $transition-ease;
    }

    &__fallback {
      font-weight: $font-weight-semibold;
      color: $color-white;
      text-transform: uppercase;

      .avatar--small & {
        font-size: $font-size-xs;
      }

      .avatar--medium & {
        font-size: $font-size-sm;
      }

      .avatar--large & {
        font-size: $font-size-lg;
      }
    }
  }
</style>
