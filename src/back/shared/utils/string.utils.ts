/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * @param str1 Première chaîne
 * @param str2 Deuxième chaîne
 * @returns Distance de Levenshtein (nombre de modifications nécessaires)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialisation de la matrice
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Calcul de la distance
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // Suppression
        matrix[i][j - 1] + 1,      // Insertion
        matrix[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calcule le pourcentage de similarité entre deux chaînes
 * @param str1 Première chaîne
 * @param str2 Deuxième chaîne
 * @returns Pourcentage de similarité (0-100)
 */
export function similarityPercentage(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 100;
  
  const distance = levenshteinDistance(str1, str2);
  return ((maxLength - distance) / maxLength) * 100;
}

/**
 * Normalise une chaîne pour la comparaison
 * - Conversion en minuscules
 * - Suppression des accents
 * - Trim des espaces
 * @param str Chaîne à normaliser
 * @returns Chaîne normalisée
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Vérifie si deux chaînes sont similaires selon un seuil de similarité
 * @param str1 Première chaîne
 * @param str2 Deuxième chaîne
 * @param threshold Seuil de similarité (0-100, défaut: 80)
 * @returns true si les chaînes sont similaires
 */
export function areSimilar(str1: string, str2: string, threshold: number = 80): boolean {
  const normalized1 = normalizeString(str1);
  const normalized2 = normalizeString(str2);
  
  // Vérification d'égalité exacte après normalisation
  if (normalized1 === normalized2) return true;
  
  // Vérification singulier/pluriel simple (ajoute/enlève 's' ou 'x')
  if (
    normalized1 === normalized2 + 's' ||
    normalized1 === normalized2 + 'x' ||
    normalized2 === normalized1 + 's' ||
    normalized2 === normalized1 + 'x'
  ) {
    return true;
  }
  
  // Calcul de la similarité
  const similarity = similarityPercentage(normalized1, normalized2);
  return similarity >= threshold;
}
