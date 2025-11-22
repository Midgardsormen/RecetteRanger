<script lang="ts">
  import type { DotProps } from '../../types';

  let {
    color,
    size = 'medium'
  }: DotProps = $props();
</script>

<span
  class="dot dot--{size}"
  style={color ? `background-color: ${color};` : undefined}
></span>

<style lang="scss">
  @use '../../styles/variables' as *;

  .dot {
    display: inline-block;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: $color-dot-default;

    &--xs {
      width: $size-dot-xs;
      height: $size-dot-xs;
    }

    &--small {
      width: $size-dot-sm;
      height: $size-dot-sm;
    }

    &--medium {
      width: $size-dot-md;
      height: $size-dot-md;
    }

    &--large {
      width: $size-dot-lg;
      height: $size-dot-lg;
    }
  }
</style>
