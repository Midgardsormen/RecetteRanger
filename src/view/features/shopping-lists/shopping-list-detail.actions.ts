import { apiService } from '../../services/api.service';
import type { ShoppingList, ShoppingListItem } from '../../types/shopping-list.types';
import type { DragDropState } from '@thisux/sveltednd';
import { ANIMATION_CONFIG } from './shopping-list-detail.config';

/**
 * Load shopping list by ID
 */
export async function loadShoppingList(listId: string): Promise<ShoppingList> {
  return await apiService.getShoppingList(listId);
}

/**
 * Toggle item checked status
 */
export async function toggleItem(
  item: ShoppingListItem,
  shoppingList: ShoppingList
): Promise<void> {
  await apiService.updateShoppingListItem(item.id, {
    checked: !item.checked,
  });

  // Update locally
  const index = shoppingList.items.findIndex(i => i.id === item.id);
  if (index !== -1) {
    shoppingList.items[index].checked = !item.checked;
  }
}

/**
 * Delete shopping list item
 */
export async function deleteItem(
  itemId: string,
  shoppingList: ShoppingList
): Promise<void> {
  await apiService.deleteShoppingListItem(itemId);

  // Remove locally
  shoppingList.items = shoppingList.items.filter(i => i.id !== itemId);
}

/**
 * Add manual item to shopping list
 */
export async function addManualItem(
  shoppingList: ShoppingList,
  label: string,
  ingredientId?: string | null,
  aisle?: string | null
): Promise<ShoppingListItem> {
  const newItem = await apiService.createShoppingListItem(shoppingList.id, {
    label: label.trim(),
    ingredientId: ingredientId,
    aisle: aisle,
    isManual: true,
    checked: false,
  });

  shoppingList.items.push(newItem);
  return newItem;
}

/**
 * Add article from selection to shopping list
 */
export async function addArticleToList(
  shoppingList: ShoppingList,
  article: any,
  quantity?: number | null,
  unit?: string | null
): Promise<ShoppingListItem> {
  const newItem = await apiService.createShoppingListItem(shoppingList.id, {
    label: article.label,
    ingredientId: article.id,
    aisle: article.aisle,
    quantity: quantity,
    unit: unit,
    isManual: true,
    checked: false,
  });

  shoppingList.items.push(newItem);
  return newItem;
}

/**
 * Update item quantity and unit
 */
export async function updateItemQuantity(
  itemId: string,
  quantity: string,
  unit: string,
  shoppingList: ShoppingList
): Promise<void> {
  const parsedQuantity = quantity.trim() ? parseFloat(quantity.trim()) : null;
  const parsedUnit = unit.trim() || null;

  await apiService.updateShoppingListItem(itemId, {
    quantity: parsedQuantity,
    unit: parsedUnit,
  });

  // Update locally
  const index = shoppingList.items.findIndex(i => i.id === itemId);
  if (index !== -1) {
    shoppingList.items[index].quantity = parsedQuantity;
    shoppingList.items[index].unit = parsedUnit;
  }
}

/**
 * Update item store
 */
export async function updateItemStore(
  itemId: string,
  storeId: string | null,
  shoppingList: ShoppingList
): Promise<void> {
  const updatedItem = await apiService.updateShoppingListItem(itemId, {
    storeId: storeId,
  });

  // Update locally
  const index = shoppingList.items.findIndex(i => i.id === itemId);
  if (index !== -1) {
    shoppingList.items[index].storeId = updatedItem.storeId;
    shoppingList.items[index].store = updatedItem.store;
  }
}

/**
 * Handle drop on aisle (drag and drop)
 */
export async function handleDropOnAisle(
  state: DragDropState<ShoppingListItem>,
  targetStoreKey: string,
  targetAisleKey: string,
  shoppingList: ShoppingList,
  onFlash?: (storeKey: string) => void
): Promise<void> {
  const { draggedItem } = state;
  if (!draggedItem) return;

  // Determine the new store ID and aisle
  let newStoreId: string | null = null;
  let newAisle: string | null = null;

  // Decode store key
  if (targetStoreKey !== 'NO_STORE') {
    newStoreId = targetStoreKey;
  }

  // Decode aisle key
  if (targetAisleKey !== 'NON_CLASSE') {
    newAisle = targetAisleKey;
  }

  // Check if anything changed
  const currentStoreId = draggedItem.storeId || null;
  const currentAisle = draggedItem.aisle || null;

  if (currentStoreId === newStoreId && currentAisle === newAisle) {
    return; // No change needed
  }

  // Animation flash on store if store changed
  if (currentStoreId !== newStoreId && targetStoreKey !== 'NO_STORE' && onFlash) {
    onFlash(targetStoreKey);
  }

  // Update the item on the backend
  const updatedItem = await apiService.updateShoppingListItem(draggedItem.id, {
    storeId: newStoreId,
    aisle: newAisle,
  });

  // Update locally
  const index = shoppingList.items.findIndex(i => i.id === draggedItem.id);
  if (index !== -1) {
    shoppingList.items[index].storeId = updatedItem.storeId;
    shoppingList.items[index].store = updatedItem.store;
    shoppingList.items[index].aisle = updatedItem.aisle;
  }
}

/**
 * Handle drop on store (drag and drop)
 */
export async function handleDropOnStore(
  state: DragDropState<ShoppingListItem>,
  targetStoreKey: string,
  shoppingList: ShoppingList,
  onFlash?: (storeKey: string) => void
): Promise<void> {
  const { draggedItem } = state;
  if (!draggedItem) return;

  // Determine the new store ID (keep the same aisle)
  let newStoreId: string | null = null;

  if (targetStoreKey !== 'NO_STORE') {
    newStoreId = targetStoreKey;
  }

  const currentStoreId = draggedItem.storeId || null;

  if (currentStoreId === newStoreId) {
    return; // No change needed
  }

  // Animation flash on store
  if (targetStoreKey !== 'NO_STORE' && onFlash) {
    onFlash(targetStoreKey);
  }

  // Update the item on the backend
  const updatedItem = await apiService.updateShoppingListItem(draggedItem.id, {
    storeId: newStoreId,
  });

  // Update locally
  const index = shoppingList.items.findIndex(i => i.id === draggedItem.id);
  if (index !== -1) {
    shoppingList.items[index].storeId = updatedItem.storeId;
    shoppingList.items[index].store = updatedItem.store;
  }
}

/**
 * Handle store creation and assignment to item
 */
export async function handleStoreCreated(
  itemId: string,
  storeName: string,
  onReload: () => Promise<void>
): Promise<void> {
  // Delay to let database sync
  await new Promise(resolve => setTimeout(resolve, ANIMATION_CONFIG.storeCreationDelay));

  // Search for the newly created store
  try {
    const result = await apiService.searchStores({
      search: storeName,
      limit: 1,
    });

    if (result.stores && result.stores.length > 0) {
      const newStore = result.stores[0];

      // Update item with the new store
      await apiService.updateShoppingListItem(itemId, {
        storeId: newStore.id,
      });

      // Reload the whole shopping list to get updated data
      await onReload();
    } else {
      console.warn('Store created but not found:', storeName);
    }
  } catch (err) {
    console.error('Error retrieving new store:', err);
  }
}
