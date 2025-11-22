/**
 * StoreAutocomplete Actions
 * Business logic for the StoreAutocomplete component
 */

import { apiService } from '../../../services/api.service';
import type { Store } from '../../../types/ui.types';
import { STORE_AUTOCOMPLETE_SEARCH } from './StoreAutocomplete.config';

// ============================================
// SEARCH ACTIONS
// ============================================

/**
 * Search stores via API
 * @param searchValue - The search query
 * @returns Array of stores matching the search
 */
export async function searchStores(searchValue: string): Promise<Store[]> {
  if (searchValue.length < STORE_AUTOCOMPLETE_SEARCH.minSearchLength) {
    return [];
  }

  try {
    const result = await apiService.searchStores({
      search: searchValue,
      limit: STORE_AUTOCOMPLETE_SEARCH.limit,
    });
    return result.stores || [];
  } catch (err) {
    console.error('Erreur lors de la recherche d\'enseignes:', err);
    return [];
  }
}

// ============================================
// STORE SELECTION
// ============================================

/**
 * Get the first letter of a store name in uppercase
 * Used for placeholder avatar
 * @param storeName - The store name
 * @returns First letter in uppercase
 */
export function getStoreInitial(storeName: string): string {
  return storeName.charAt(0).toUpperCase();
}
