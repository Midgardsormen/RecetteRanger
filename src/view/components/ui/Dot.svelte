<script lang="ts">
  interface Props {
    color?: string;
    size?: 'xs' | 'small' | 'medium' | 'large';
  }

  let {
    color = '#cccccc',
    size = 'medium'
  }: Props = $props();
</script>

<span
  class="dot dot--{size}"
  style="background-color: {color};"
></span>

<style lang="scss">
  @use '../../styles/variables' as *;

  .dot {
    display: inline-block;
    border-radius: 50%;
    flex-shrink: 0;

    &--xs {
      width: 6px;
      height: 6px;
    }

    &--small {
      width: 8px;
      height: 8px;
    }

    &--medium {
      width: 10px;
      height: 10px;
    }

    &--large {
      width: 12px;
      height: 12px;
    }
  }
</style>
