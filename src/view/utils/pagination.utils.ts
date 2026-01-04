/**
 * Utilitaires pour la pagination
 */

export interface PageRange {
  type: 'page' | 'ellipsis';
  value: number | null; // null pour les ellipses
  display: string;
}

/**
 * Calcule les numéros de pages à afficher avec ellipses
 * Affiche max 3 boutons de pages : première, dernière, et page courante OU page adjacente
 *
 * Exemples :
 * - Page 1 sur 100 : [1] ... 100
 * - Page 2 sur 100 : 1 [2] ... 100
 * - Page 3 sur 100 : 1 ... [3] ... 100
 * - Page 50 sur 100 : 1 ... [50] ... 100
 * - Page 99 sur 100 : 1 ... [99] 100
 * - Page 100 sur 100 : 1 ... [100]
 *
 * @param currentPage - Page actuelle (0-indexed)
 * @param totalPages - Nombre total de pages
 * @param maxVisible - Nombre maximum de boutons visibles (défaut: 3)
 * @returns Array de PageRange à afficher
 */
export function getPageRange(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 3
): PageRange[] {
  if (totalPages <= 1) {
    return [];
  }

  // Si le nombre total de pages est inférieur ou égal au max, afficher toutes les pages
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: 'page' as const,
      value: i,
      display: String(i + 1),
    }));
  }

  const pages: PageRange[] = [];
  const firstPage = 0;
  const lastPage = totalPages - 1;

  // Toujours afficher la première page
  pages.push({
    type: 'page',
    value: firstPage,
    display: '1',
  });

  // Déterminer quelle page afficher au milieu
  if (currentPage === 0) {
    // On est sur la première page : afficher [1] ... N
    pages.push({
      type: 'ellipsis',
      value: null,
      display: '...',
    });
  } else if (currentPage === 1) {
    // On est sur la page 2 : afficher 1 [2] ... N
    pages.push({
      type: 'page',
      value: 1,
      display: '2',
    });
    pages.push({
      type: 'ellipsis',
      value: null,
      display: '...',
    });
  } else if (currentPage === lastPage) {
    // On est sur la dernière page : afficher 1 ... [N]
    pages.push({
      type: 'ellipsis',
      value: null,
      display: '...',
    });
  } else if (currentPage === lastPage - 1) {
    // On est sur l'avant-dernière page : afficher 1 ... [N-1] N
    pages.push({
      type: 'ellipsis',
      value: null,
      display: '...',
    });
    pages.push({
      type: 'page',
      value: lastPage - 1,
      display: String(lastPage),
    });
  } else {
    // On est au milieu : afficher 1 ... [current] ... N
    pages.push({
      type: 'ellipsis',
      value: null,
      display: '...',
    });
    pages.push({
      type: 'page',
      value: currentPage,
      display: String(currentPage + 1),
    });
    pages.push({
      type: 'ellipsis',
      value: null,
      display: '...',
    });
  }

  // Toujours afficher la dernière page (sauf si c'est la page courante)
  if (currentPage !== lastPage) {
    pages.push({
      type: 'page',
      value: lastPage,
      display: String(totalPages),
    });
  }

  return pages;
}

/**
 * Vérifie si la page précédente est disponible
 */
export function hasPreviousPage(currentPage: number): boolean {
  return currentPage > 0;
}

/**
 * Vérifie si la page suivante est disponible
 */
export function hasNextPage(currentPage: number, totalPages: number): boolean {
  return currentPage < totalPages - 1;
}
