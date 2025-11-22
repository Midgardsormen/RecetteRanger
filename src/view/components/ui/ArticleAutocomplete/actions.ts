import { apiService } from '../../../services/api.service';
import type { Article } from '../../../types';
import { AUTOCOMPLETE_CONFIG } from './config';

/**
 * Recherche des articles via l'API
 */
export async function searchArticles(
  query: string,
  isFood: boolean | undefined
): Promise<Article[]> {
  if (!query || query.length < AUTOCOMPLETE_CONFIG.MIN_QUERY_LENGTH) {
    return [];
  }

  try {
    const result = await apiService.searchIngredients({
      search: query,
      limit: AUTOCOMPLETE_CONFIG.MAX_SUGGESTIONS,
      isFood: isFood
    });

    return result.data;
  } catch (err) {
    console.error('Erreur recherche articles:', err);
    return [];
  }
}

/**
 * Gère la navigation au clavier dans le dropdown
 */
export function handleKeyNavigation(
  event: KeyboardEvent,
  currentIndex: number,
  maxIndex: number
): number {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      return Math.min(currentIndex + 1, maxIndex);
    case 'ArrowUp':
      event.preventDefault();
      return Math.max(currentIndex - 1, -1);
    default:
      return currentIndex;
  }
}
