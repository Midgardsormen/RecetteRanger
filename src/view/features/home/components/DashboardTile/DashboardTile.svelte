<script lang="ts">
  /**
   * DashboardTile Component
   *
   * Tile with background image, retro grain effect, and decorative styling
   * specifically designed for the Dashboard page.
   */

  export interface DashboardTileProps {
    title: string;
    backgroundImage: string;
    children?: any;
  }

  let {
    title,
    backgroundImage,
    children
  }: DashboardTileProps = $props();
</script>

<div class="dashboard-tile">
  <div class="dashboard-tile__bg" style="background-image: url('{backgroundImage}')"></div>
  <div class="dashboard-tile__content">
    <h3 class="dashboard-tile__title">{title}</h3>
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style lang="scss">
  @use '../../../../styles/variables' as *;

  // Block: dashboard-tile
  .dashboard-tile {
    @include retro-grain(0.3);
    position: relative;
    background: $brand-tertiary;
    display: flex;
    flex-direction: column;
    padding: $spacing-xl $spacing-sm;
    border-radius: $radius-xl;
    box-shadow: $shadow-md;
    overflow: hidden;
    opacity: 0.9;
    @media (min-width: $breakpoint-md) {
      padding: $spacing-xl $spacing-md;
    }

    // Element: bg
    &__bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center;
      opacity: 0.3;
      z-index: 0;
    }

    // Element: content
    &__content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: $spacing-base;
      flex: 1;

      :global(.link) {
        align-self: flex-end;
      }
    }

    // Element: title
    &__title {
      text-transform: uppercase;
      font-family: $font-family-heading;
      font-size: $title-size-1;
      font-weight: $font-weight-bold;
      color: $color-decorative-title;
      text-shadow: $shadow-decorative-title;
      margin: 0 0 $spacing-base 0;
      text-align: center;
      line-height: 1;
      opacity: 0.9;
    }
  }
</style>
