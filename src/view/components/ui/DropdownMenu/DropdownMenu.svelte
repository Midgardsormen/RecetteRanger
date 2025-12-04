<script lang="ts">
  /**
   * DropdownMenu Component
   *
   * Un menu déroulant avec des éléments cliquables
   * Construit sur le composant Dropdown existant
   */

  import type { DropdownMenuProps } from '../../../types/ui.types';
  import Dropdown from '../Dropdown';
  import { DROPDOWN_MENU_DEFAULTS } from './DropdownMenu.config';

  let {
    trigger,
    items = [],
    align = DROPDOWN_MENU_DEFAULTS.align,
    minWidth = DROPDOWN_MENU_DEFAULTS.minWidth,
    iconButton = DROPDOWN_MENU_DEFAULTS.iconButton,
    autoAlign = DROPDOWN_MENU_DEFAULTS.autoAlign,
    isOpen = $bindable(DROPDOWN_MENU_DEFAULTS.isOpen)
  }: DropdownMenuProps = $props();

  let wrapperRef: HTMLDivElement;
  let dropdownContentRef: HTMLDivElement | null = null;
  let computedAlign = $state<'left' | 'right'>(align);

  // Calculer l'alignement optimal
  function calculateAlign() {
    if (!autoAlign || !wrapperRef) {
      return align;
    }

    const rect = wrapperRef.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 200; // Largeur estimée du dropdown (minWidth par défaut)

    // Vérifier s'il y a assez d'espace à droite
    const spaceOnRight = viewportWidth - rect.left;
    const spaceOnLeft = rect.right;

    // Si pas assez d'espace à droite mais assez à gauche, aligner à droite
    if (spaceOnRight < dropdownWidth && spaceOnLeft >= dropdownWidth) {
      return 'right';
    }
    // Si pas assez d'espace à gauche mais assez à droite, aligner à gauche
    else if (spaceOnLeft < dropdownWidth && spaceOnRight >= dropdownWidth) {
      return 'left';
    }
    // Sinon, utiliser le côté avec le plus d'espace
    else {
      return spaceOnRight >= spaceOnLeft ? 'left' : 'right';
    }
  }

  // Positionner le dropdown en fixed
  function positionDropdown() {
    if (!wrapperRef || !isOpen) return;

    // Attendre que le DOM soit mis à jour
    requestAnimationFrame(() => {
      const triggerRect = wrapperRef.getBoundingClientRect();
      const content = wrapperRef.querySelector('.dropdown-menu__content') as HTMLDivElement;

      if (content) {
        content.style.position = 'fixed';
        content.style.top = `${triggerRect.bottom + 4}px`;

        if (computedAlign === 'right') {
          content.style.right = `${window.innerWidth - triggerRect.right}px`;
          content.style.left = 'auto';
        } else {
          content.style.left = `${triggerRect.left}px`;
          content.style.right = 'auto';
        }
      }
    });
  }

  // Recalculer l'alignement et positionner
  $effect(() => {
    if (wrapperRef) {
      computedAlign = calculateAlign();
    }
  });

  // Positionner quand le menu s'ouvre
  $effect(() => {
    if (isOpen) {
      positionDropdown();
    }
  });

  // Gérer le click outside et la touche Escape
  $effect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef && !wrapperRef.contains(e.target as Node)) {
        isOpen = false;
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        isOpen = false;
      }
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  });
</script>

<div
  class="dropdown-menu-wrapper"
  class:dropdown-menu-wrapper--icon-button={iconButton}
  bind:this={wrapperRef}
  onclick={(e) => {
    // Toggle seulement si on clique directement sur le wrapper ou le trigger
    const target = e.target as HTMLElement;
    if (!target.closest('.dropdown-menu')) {
      isOpen = !isOpen;
    }
  }}
>
  {#if trigger}
    <div class="dropdown-menu-wrapper__trigger">
      {@render trigger()}
    </div>
  {/if}

  {#if isOpen}
    <div
      class="dropdown-menu__content dropdown-menu__content--{computedAlign}"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="dropdown-menu">
        {#each items as item}
          <a
            href={item.href || '#'}
            class="dropdown-menu__item"
            class:dropdown-menu__item--disabled={item.disabled}
            onclick={(e) => {
              if (item.disabled) {
                e.preventDefault();
                return;
              }
              if (item.onClick) {
                e.preventDefault();
                item.onClick();
                isOpen = false;
              }
            }}
          >
            {#if item.icon}
              <span class="dropdown-menu__icon">
                {@render item.icon()}
              </span>
            {/if}
            <span class="dropdown-menu__label">{item.label}</span>
          </a>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

  // Block: dropdown-menu-wrapper
  .dropdown-menu-wrapper {
    display: inline-block;
    position: relative;

    &__trigger {
      display: inline-block;
    }
  }

  // Element: dropdown-menu__content
  .dropdown-menu__content {
    position: fixed;
    z-index: $z-index-dropdown;
    min-width: 200px;
    width: max-content;
    max-width: calc(100vw - 20px);
    max-height: 400px;
    overflow-y: auto;
    background: $color-white;
    border: 2px solid $color-border-primary;
    border-radius: $radius-lg;
    box-shadow: $shadow-dropdown;
    animation: dropdownSlide $transition-base $transition-ease;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $color-gray-100;
      border-radius: $radius-sm;
    }

    &::-webkit-scrollbar-thumb {
      background: $color-gray-400;
      border-radius: $radius-sm;

      &:hover {
        background: $color-gray-500;
      }
    }

    // Firefox scrollbar
    scrollbar-width: thin;
    scrollbar-color: $color-gray-400 $color-gray-100;
  }

  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Block: dropdown-menu
  .dropdown-menu {
    display: flex;
    flex-direction: column;
    padding: $spacing-2xs;
    gap: $spacing-2xs;

    // Element: item
    &__item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm $spacing-md;
      border-radius: $radius-md;
      font-family: $font-family-base;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
      text-decoration: none;
      cursor: pointer;
      transition: all $transition-base $transition-ease;

      &:hover:not(&--disabled) {
        background: $color-gray-100;
        color: $brand-primary;
      }

      &:active:not(&--disabled) {
        background: $color-gray-200;
      }

      // Modifier: disabled
      &--disabled {
        color: $color-text-tertiary;
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    // Element: icon
    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }

    // Element: label
    &__label {
      flex: 1;
      white-space: nowrap;
    }
  }
</style>
