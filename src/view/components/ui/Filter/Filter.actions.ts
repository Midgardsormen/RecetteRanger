/**
 * Filter Actions
 * Business logic and event handlers for the Filter component
 */

import type { FilterOption } from '../../../types/ui.types';
import { FILTER_LABELS } from './Filter.config';

// ============================================
// SELECTION HANDLERS
// ============================================

/**
 * Handle option click for both single and multiple selection
 */
export function createOptionClickHandler(
  multiple: boolean,
  currentValue: string | string[],
  setValue: (value: string | string[]) => void,
  onchange?: (value: string | string[]) => void
) {
  return (optionValue: string) => {
    let newValue: string | string[];

    if (multiple) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      if (currentValues.includes(optionValue)) {
        newValue = currentValues.filter(v => v !== optionValue);
      } else {
        newValue = [...currentValues, optionValue];
      }
    } else {
      newValue = currentValue === optionValue ? '' : optionValue;
    }

    setValue(newValue);
    onchange?.(newValue);
  };
}

/**
 * Handle dropdown option click (closes dropdown for single select)
 */
export function createDropdownOptionClickHandler(
  multiple: boolean,
  handleOptionClick: (value: string) => void,
  setDropdownOpen: (isOpen: boolean) => void
) {
  return (optionValue: string) => {
    handleOptionClick(optionValue);
    if (!multiple) {
      setDropdownOpen(false);
    }
  };
}

/**
 * Handle select change event
 */
export function createSelectChangeHandler(
  setValue: (value: string) => void,
  onchange?: (value: string | string[]) => void
) {
  return (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newValue = target.value;
    setValue(newValue);
    onchange?.(newValue);
  };
}

// ============================================
// SELECTION STATE
// ============================================

/**
 * Check if an option is selected
 */
export function isSelected(
  optionValue: string,
  currentValue: string | string[],
  multiple: boolean
): boolean {
  if (multiple) {
    return Array.isArray(currentValue) && currentValue.includes(optionValue);
  }
  return currentValue === optionValue;
}

/**
 * Check if any option is selected
 */
export function hasSelection(
  currentValue: string | string[],
  multiple: boolean
): boolean {
  if (multiple) {
    return Array.isArray(currentValue) && currentValue.length > 0;
  }
  return currentValue !== '';
}

// ============================================
// CLEAR ACTIONS
// ============================================

/**
 * Clear all selected values
 */
export function createClearAllHandler(
  multiple: boolean,
  setValue: (value: string | string[]) => void,
  onchange?: (value: string | string[]) => void
) {
  return () => {
    const newValue = multiple ? [] : '';
    setValue(newValue);
    onchange?.(newValue);
  };
}

// ============================================
// LABEL HELPERS
// ============================================

/**
 * Get the label for the selected option in dropdown mode
 */
export function getSelectedLabel(
  currentValue: string | string[],
  options: FilterOption[],
  defaultLabel?: string
): string {
  if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
    return defaultLabel || FILTER_LABELS.defaultPlaceholder;
  }

  const selected = options.find(opt => opt.value === currentValue);
  return selected?.label || defaultLabel || FILTER_LABELS.defaultPlaceholder;
}
