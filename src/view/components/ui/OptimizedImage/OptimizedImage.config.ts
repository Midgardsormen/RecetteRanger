/**
 * OptimizedImage Configuration
 * Valeurs par défaut pour le composant OptimizedImage
 */

export const OPTIMIZED_IMAGE_DEFAULTS = {
  aspectRatio: 'square' as const,
  sizes: '(max-width: 640px) 320px, (max-width: 768px) 480px, (max-width: 1024px) 800px, 1200px',
  loading: 'lazy' as const,
  eager: false,
  objectFit: 'cover' as const,
  rounded: false,
} as const;
