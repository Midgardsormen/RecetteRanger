import type { ShoppingList, ShoppingListItem } from '../../types/shopping-list.types';
import { getAisleLabel } from '../../utils/aisle-labels';

/**
 * Format quantity and unit for display
 */
export function formatQuantity(item: ShoppingListItem): string {
  if (!item.quantity) return '';
  return `${item.quantity}${item.unit ? ' ' + item.unit : ''}`;
}

/**
 * Filter items by selected store
 */
export function filterItemsByStore(
  items: ShoppingListItem[],
  selectedStoreFilter: string
): ShoppingListItem[] {
  if (selectedStoreFilter === 'all') {
    return items;
  }

  return items.filter(item => {
    if (selectedStoreFilter === 'none') {
      return !item.storeId;
    }
    return item.storeId === selectedStoreFilter;
  });
}

/**
 * Group items by aisle only
 */
export function groupItemsByAisle(items: ShoppingListItem[]): Map<
  string,
  { key: string; label: string; color?: string; items: ShoppingListItem[] }
> {
  const grouped = new Map<
    string,
    { key: string; label: string; color?: string; items: ShoppingListItem[] }
  >();

  for (const item of items) {
    const groupKey = item.aisle || 'NON_CLASSE';
    const groupLabel = getAisleLabel(groupKey);

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, { key: groupKey, label: groupLabel, items: [] });
    }
    grouped.get(groupKey)!.items.push(item);
  }

  return grouped;
}

/**
 * Group items by store, then by aisle
 */
export function groupItemsByStoreAndAisle(items: ShoppingListItem[]): Map<
  string,
  {
    key: string;
    label: string;
    color?: string;
    aisles: Map<string, { key: string; label: string; items: ShoppingListItem[] }>;
  }
> {
  const storeGroups = new Map<
    string,
    {
      key: string;
      label: string;
      color?: string;
      aisles: Map<string, { key: string; label: string; items: ShoppingListItem[] }>;
    }
  >();

  for (const item of items) {
    // First level: store
    let storeKey: string;
    let storeLabel: string;
    let storeColor: string | undefined;

    if (item.store) {
      storeKey = item.store.id;
      storeLabel = item.store.name;
      storeColor = item.store.color || undefined;
    } else {
      storeKey = 'NO_STORE';
      storeLabel = 'Sans enseigne';
    }

    if (!storeGroups.has(storeKey)) {
      storeGroups.set(storeKey, {
        key: storeKey,
        label: storeLabel,
        color: storeColor,
        aisles: new Map(),
      });
    }

    // Second level: aisle
    const storeGroup = storeGroups.get(storeKey)!;
    const aisleKey = item.aisle || 'NON_CLASSE';
    const aisleLabel = getAisleLabel(aisleKey);

    if (!storeGroup.aisles.has(aisleKey)) {
      storeGroup.aisles.set(aisleKey, {
        key: aisleKey,
        label: aisleLabel,
        items: [],
      });
    }

    storeGroup.aisles.get(aisleKey)!.items.push(item);
  }

  // Sort stores: alphabetical order, "Sans enseigne" at the end
  const sortedStoreGroups = new Map(
    Array.from(storeGroups.entries()).sort(([keyA, groupA], [keyB, groupB]) => {
      // "Sans enseigne" always last
      if (keyA === 'NO_STORE') return 1;
      if (keyB === 'NO_STORE') return -1;

      // Otherwise, alphabetical sort by label
      return groupA.label.localeCompare(groupB.label, 'fr');
    })
  );

  return sortedStoreGroups;
}

/**
 * Get list of available stores from shopping list items
 */
export function getAvailableStores(shoppingList: ShoppingList | null): Array<{
  id: string;
  name: string;
  logoUrl?: string | null;
  color?: string | null;
}> {
  if (!shoppingList) return [];

  const storesMap = new Map<
    string,
    { id: string; name: string; logoUrl?: string | null; color?: string | null }
  >();

  for (const item of shoppingList.items) {
    if (item.store) {
      storesMap.set(item.store.id, item.store);
    }
  }

  return Array.from(storesMap.values());
}

/**
 * Calculate shopping list statistics
 */
export function calculateStats(shoppingList: ShoppingList | null): {
  total: number;
  checked: number;
  percentage: number;
} {
  if (!shoppingList) return { total: 0, checked: 0, percentage: 0 };

  const total = shoppingList.items.length;
  const checked = shoppingList.items.filter(i => i.checked).length;
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  return { total, checked, percentage };
}

/**
 * Get status label in French
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Brouillon',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminée',
    ARCHIVED: 'Archivée'
  };
  return labels[status] || status;
}

/**
 * Get badge variant for status
 */
export function getStatusVariant(status: string): 'neutral' | 'info' | 'success' | 'warning' {
  const variants: Record<string, 'neutral' | 'info' | 'success' | 'warning'> = {
    DRAFT: 'neutral',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    ARCHIVED: 'warning'
  };
  return variants[status] || 'neutral';
}
