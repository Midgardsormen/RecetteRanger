<script lang="ts">
  import { User } from 'lucide-svelte';

  let {
    authorId,
    authorPseudo,
    authorAvatar = null,
    size = 'medium',
    clickable = true
  }: {
    authorId: string;
    authorPseudo: string;
    authorAvatar?: string | null;
    size?: 'small' | 'medium' | 'large';
    clickable?: boolean;
  } = $props();

  function handleClick() {
    if (clickable) {
      window.location.href = `/profile/${authorId}`;
    }
  }
</script>

<div
  class="author-link author-link--{size}"
  class:author-link--clickable={clickable}
  onclick={clickable ? handleClick : undefined}
  role={clickable ? 'button' : undefined}
  tabindex={clickable ? 0 : undefined}
  onkeydown={(e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }}
>
  {#if authorAvatar}
    <img src={authorAvatar} alt={authorPseudo} class="author-link__avatar" />
  {:else}
    <div class="author-link__avatar-placeholder">
      <User size={size === 'small' ? 14 : size === 'large' ? 24 : 18} />
    </div>
  {/if}
  <span class="author-link__pseudo">{authorPseudo}</span>
</div>

<style lang="scss">
  @use '../../styles/variables' as *;

  .author-link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    transition: all $transition-base;

    &--small {
      font-size: $font-size-sm;
      gap: $spacing-xs * 0.5;

      .author-link__avatar,
      .author-link__avatar-placeholder {
        width: 24px;
        height: 24px;
      }
    }

    &--medium {
      font-size: $font-size-base;
      gap: $spacing-xs;

      .author-link__avatar,
      .author-link__avatar-placeholder {
        width: 32px;
        height: 32px;
      }
    }

    &--large {
      font-size: $font-size-lg;
      gap: $spacing-sm;

      .author-link__avatar,
      .author-link__avatar-placeholder {
        width: 48px;
        height: 48px;
      }
    }

    &--clickable {
      cursor: pointer;

      .author-link__pseudo {
        text-decoration: underline;
      }

      &:hover {
        .author-link__pseudo {
          color: $brand-primary;
          text-decoration: none;
        }

        .author-link__avatar {
          opacity: 0.9;
        }

        .author-link__avatar-placeholder {
          background: $brand-primary;
          color: $color-white;
        }
      }

      &:focus {
        outline: 2px solid $brand-primary;
        outline-offset: 2px;
        border-radius: $radius-md;
      }
    }
  }

  .author-link__avatar {
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .author-link__avatar-placeholder {
    border-radius: 50%;
    background: $color-gray-200;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-gray-600;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .author-link__pseudo {
    color: $color-gray-700;
    font-weight: $font-weight-medium;
    transition: all 0.2s ease;
    line-height: 1;
  }
</style>
