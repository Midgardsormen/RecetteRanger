/**
 * Cloudinary URL Utility
 *
 * Service centralisé pour générer des URLs Cloudinary optimisées.
 *
 * Stratégie d'optimisation :
 * - Toujours inclure f_auto,q_auto:eco pour réduire la bande passante
 * - Tailles standardisées (320, 480, 800, 1200) pour maximiser le cache
 * - Utilisation de c_fill,g_auto pour un recadrage intelligent
 * - Forcer les formats compressés (JPG/WebP)
 */

export enum ImageSize {
  /** Mobile portrait / thumbnails - 320px */
  SMALL = 320,
  /** Mobile paysage / tablets portrait - 480px */
  MEDIUM = 480,
  /** Tablets paysage / desktop - 800px */
  LARGE = 800,
  /** Desktop HD - 1200px */
  XLARGE = 1200,
}

export enum AspectRatio {
  /** Carré - pour ingrédients, articles */
  SQUARE = '1:1',
  /** Rectangle 16:9 - pour recettes */
  WIDE = '16:9',
  /** Rectangle 4:3 - usage général */
  STANDARD = '4:3',
}

export interface CloudinaryTransformOptions {
  /** Largeur de l'image (utiliser ImageSize pour standardiser) */
  width: ImageSize;
  /** Aspect ratio (optionnel, par défaut : préserve le ratio original) */
  aspectRatio?: AspectRatio;
  /** Mode de crop (par défaut: c_fill avec g_auto pour smart crop) */
  cropMode?: 'fill' | 'limit' | 'fit' | 'pad';
  /** Quality (par défaut: eco pour minimiser la bande passante) */
  quality?: 'auto:eco' | 'auto:good' | 'auto:best';
}

/**
 * Extrait le public_id depuis une URL Cloudinary
 *
 * @param url - URL Cloudinary complète
 * @returns public_id ou null si non trouvé
 *
 * @example
 * extractPublicId('https://res.cloudinary.com/.../recette-ranger/ingredients/abc123.jpg')
 * // => 'recette-ranger/ingredients/abc123'
 */
export function extractPublicId(url: string): string | null {
  if (!url) return null;

  // Pattern : .../upload/(v123456/)?folder/subfolder/filename
  const match = url.match(/\/upload\/(?:v\d+\/)?(recette-ranger\/[^?]+?)(?:\.[a-z]+)?(?:\?|$)/i);

  if (match && match[1]) {
    // Retirer l'extension si présente
    return match[1].replace(/\.[a-z]+$/i, '');
  }

  return null;
}

/**
 * Génère une URL Cloudinary optimisée avec les transformations spécifiées
 *
 * @param publicIdOrUrl - Public ID Cloudinary ou URL complète
 * @param options - Options de transformation
 * @returns URL optimisée
 *
 * @example
 * generateOptimizedUrl('recette-ranger/ingredients/tomate', {
 *   width: ImageSize.MEDIUM,
 *   aspectRatio: AspectRatio.SQUARE
 * })
 * // => 'https://res.cloudinary.com/.../w_480,h_480,c_fill,g_auto,f_auto,q_auto:eco/recette-ranger/ingredients/tomate'
 */
export function generateOptimizedUrl(
  publicIdOrUrl: string,
  options: CloudinaryTransformOptions,
  cloudName: string
): string {
  if (!publicIdOrUrl) return '';

  // Extraire le public_id si c'est une URL
  let publicId = publicIdOrUrl;
  if (publicIdOrUrl.includes('cloudinary.com')) {
    const extracted = extractPublicId(publicIdOrUrl);
    if (!extracted) return publicIdOrUrl; // Fallback si extraction échoue
    publicId = extracted;
  }

  const {
    width,
    aspectRatio,
    cropMode = 'fill',
    quality = 'auto:eco',
  } = options;

  // Construire les transformations
  const transformations: string[] = [];

  // 1. Taille
  transformations.push(`w_${width}`);

  // 2. Aspect ratio (calcul de la hauteur)
  if (aspectRatio) {
    const height = calculateHeight(width, aspectRatio);
    transformations.push(`h_${height}`);
  }

  // 3. Crop mode
  transformations.push(`c_${cropMode}`);

  // 4. Auto gravity pour smart crop (uniquement avec fill)
  if (cropMode === 'fill') {
    transformations.push('g_auto');
  }

  // 5. Format auto (WebP si supporté, sinon JPG)
  transformations.push('f_auto');

  // 6. Quality auto eco (minimise la bande passante)
  transformations.push(`q_${quality}`);

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Génère un srcset complet avec les 4 tailles standardisées
 *
 * @param publicIdOrUrl - Public ID Cloudinary ou URL complète
 * @param aspectRatio - Aspect ratio à appliquer
 * @param cloudName - Nom du cloud Cloudinary
 * @returns srcset string pour l'attribut HTML
 *
 * @example
 * generateSrcSet('recette-ranger/ingredients/tomate', AspectRatio.SQUARE, 'mycloud')
 * // => '...w_320... 320w, ...w_480... 480w, ...w_800... 800w, ...w_1200... 1200w'
 */
export function generateSrcSet(
  publicIdOrUrl: string,
  aspectRatio: AspectRatio | undefined,
  cloudName: string
): string {
  const sizes = [
    ImageSize.SMALL,
    ImageSize.MEDIUM,
    ImageSize.LARGE,
    ImageSize.XLARGE,
  ];

  return sizes
    .map((size) => {
      const url = generateOptimizedUrl(publicIdOrUrl, {
        width: size,
        aspectRatio,
      }, cloudName);
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Génère l'attribut sizes pour le responsive
 *
 * @param maxWidth - Largeur maximale de l'image dans le layout
 * @returns sizes string pour l'attribut HTML
 *
 * @example
 * generateSizes('800px')
 * // => '(max-width: 640px) 320px, (max-width: 768px) 480px, (max-width: 1024px) 800px, 800px'
 */
export function generateSizes(maxWidth: string = '100vw'): string {
  return [
    '(max-width: 640px) 320px',
    '(max-width: 768px) 480px',
    '(max-width: 1024px) 800px',
    maxWidth,
  ].join(', ');
}

/**
 * Calcule la hauteur en fonction de la largeur et du ratio
 */
function calculateHeight(width: number, aspectRatio: AspectRatio): number {
  const ratios: Record<AspectRatio, number> = {
    [AspectRatio.SQUARE]: 1,
    [AspectRatio.WIDE]: 9 / 16,
    [AspectRatio.STANDARD]: 3 / 4,
  };

  return Math.round(width * ratios[aspectRatio]);
}

/**
 * Valide si une URL est une URL Cloudinary valide
 */
export function isCloudinaryUrl(url: string): boolean {
  return url?.includes('res.cloudinary.com') || url?.includes('cloudinary.com/image/upload');
}

/**
 * Génère les URLs pour les 3 variantes (thumbnail, medium, large)
 * Utilisé lors de l'upload pour stocker en base de données
 */
export function generateImageVariants(
  publicId: string,
  aspectRatio: AspectRatio,
  cloudName: string
): {
  thumbnail: string;
  medium: string;
  large: string;
} {
  return {
    thumbnail: generateOptimizedUrl(publicId, {
      width: ImageSize.SMALL,
      aspectRatio,
    }, cloudName),
    medium: generateOptimizedUrl(publicId, {
      width: ImageSize.LARGE,
      aspectRatio,
    }, cloudName),
    large: generateOptimizedUrl(publicId, {
      width: ImageSize.XLARGE,
      aspectRatio,
    }, cloudName),
  };
}
