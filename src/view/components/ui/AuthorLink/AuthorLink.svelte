<script lang="ts">
  import { User } from 'lucide-svelte';
  import { Avatar } from '../';
  import { navigateToProfile, handleKeyboardNavigation } from '../../../utils';
  import { AVATAR_ICON_SIZES } from './config';
  import type { AuthorLinkProps } from '../../../types';

  let {
    authorId,
    authorPseudo,
    authorAvatar = null,
    size = 'medium',
    clickable = true
  }: AuthorLinkProps = $props();

  function handleClick() {
    if (clickable) {
      navigateToProfile(authorId);
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
    if (clickable) {
      handleKeyboardNavigation(e, handleClick);
    }
  }}
>
  <Avatar
    src={authorAvatar || undefined}
    alt={authorPseudo}
    {size}
  >
    {#snippet icon()}
      <User size={AVATAR_ICON_SIZES[size]} />
    {/snippet}
  </Avatar>
  <span class="author-link__pseudo">{authorPseudo}</span>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  .author-link {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    transition: all $transition-base;

    &--small {
      font-size: $font-size-sm;
      gap: calc($spacing-xs * 0.5);
    }

    &--medium {
      font-size: $font-size-base;
      gap: $spacing-xs;
    }

    &--large {
      font-size: $font-size-lg;
      gap: $spacing-sm;
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

        :global(.avatar__image) {
          opacity: 0.9;
        }

        :global(.avatar__icon) {
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

  .author-link__pseudo {
    color: $color-gray-700;
    font-weight: $font-weight-medium;
    transition: color $transition-base $transition-ease;
    line-height: 1;
  }
</style>
