<script lang="ts">
  /**
   * Tabs Component
   *
   * Composant d'onglets pour naviguer entre différents contenus
   */

  interface Tab {
    id: string;
    label: string;
    icon?: any; // Composant icône de lucide-svelte
  }

  interface Props {
    tabs: Tab[];
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    children: any;
  }

  let { tabs, activeTab = $bindable(tabs[0]?.id || ''), onTabChange, children }: Props = $props();

  function handleTabClick(tabId: string) {
    activeTab = tabId;
    onTabChange?.(tabId);
  }
</script>

<div class="tabs">
  <div class="tabs__header" role="tablist">
    {#each tabs as tab}
      <button
        class="tabs__tab"
        class:tabs__tab--active={activeTab === tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        aria-controls="panel-{tab.id}"
        id="tab-{tab.id}"
        onclick={() => handleTabClick(tab.id)}
      >
        {#if tab.icon}
          <svelte:component this={tab.icon} size={20} />
        {/if}
        <span class="tabs__tab-label">{tab.label}</span>
      </button>
    {/each}
  </div>

  <div class="tabs__content">
    {#each tabs as tab}
      <div
        class="tabs__panel"
        class:tabs__panel--active={activeTab === tab.id}
        role="tabpanel"
        id="panel-{tab.id}"
        aria-labelledby="tab-{tab.id}"
        hidden={activeTab !== tab.id}
      >
        {@render children(tab.id)}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: tabs
  .tabs {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
    width: 100%;
  }

  // Element: header
  .tabs__header {
    display: flex;
    gap: $spacing-xs;
    border-bottom: 2px solid $color-border-primary;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    // Masquer la scrollbar sur les navigateurs modernes
    scrollbar-width: none; // Firefox
    &::-webkit-scrollbar {
      display: none; // Chrome, Safari, Edge
    }
  }

  // Element: tab
  .tabs__tab {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    padding: $spacing-md $spacing-lg;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    color: $color-text-secondary;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    white-space: nowrap;
    flex-shrink: 0;

    &:hover:not(.tabs__tab--active) {
      color: $color-text-primary;
      background: $color-gray-50;
    }

    // Modifier: active
    &--active {
      color: $brand-primary;
      border-bottom-color: $brand-primary;
      font-weight: $font-weight-semibold;

      :global(svg) {
        color: $brand-primary;
      }
    }

    :global(svg) {
      flex-shrink: 0;
      transition: color $transition-base $transition-ease;
    }
  }

  // Element: tab-label
  .tabs__tab-label {
    // Label toujours visible
  }

  // Element: content
  .tabs__content {
    position: relative;
    min-height: 200px;
  }

  // Element: panel
  .tabs__panel {
    display: none;

    // Modifier: active
    &--active {
      display: block;
    }
  }
</style>
