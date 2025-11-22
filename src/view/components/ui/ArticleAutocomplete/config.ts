export const AUTOCOMPLETE_CONFIG = {
  /** Délai de debounce pour la recherche (ms) */
  DEBOUNCE_DELAY: 300,

  /** Longueur minimale de la requête pour déclencher la recherche */
  MIN_QUERY_LENGTH: 2,

  /** Nombre maximum de suggestions affichées */
  MAX_SUGGESTIONS: 10,

  /** Délai avant de fermer les suggestions au blur (ms) */
  BLUR_DELAY: 200,

  /** Hauteur maximale du dropdown sur mobile (px) */
  DROPDOWN_MAX_HEIGHT_MOBILE: 250,

  /** Hauteur maximale du dropdown sur desktop (px) */
  DROPDOWN_MAX_HEIGHT_DESKTOP: 300
} as const;
