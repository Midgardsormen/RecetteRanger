<script lang="ts">
  /**
   * OptimizedImage Component
   *
   * Composant d'image optimisé avec :
   * - srcset responsive automatique
   * - lazy loading par défaut
   * - Formats optimisés (WebP/JPG via Cloudinary)
   * - Cache long terme (géré par les headers HTTP)
   * - Placeholder pendant le chargement
   *
   * @example
   * <OptimizedImage
   *   src="https://res.cloudinary.com/.../image.jpg"
   *   alt="Description"
   *   aspectRatio="square"
   *   sizes="(max-width: 768px) 100vw, 50vw"
   * />
   */

  import { OPTIMIZED_IMAGE_DEFAULTS } from './OptimizedImage.config';
  import type { OptimizedImageProps } from '../../../types/ui.types';

  let {
    src,
    alt,
    aspectRatio = OPTIMIZED_IMAGE_DEFAULTS.aspectRatio,
    sizes = OPTIMIZED_IMAGE_DEFAULTS.sizes,
    loading = OPTIMIZED_IMAGE_DEFAULTS.loading,
    eager = OPTIMIZED_IMAGE_DEFAULTS.eager,
    placeholder,
    objectFit = OPTIMIZED_IMAGE_DEFAULTS.objectFit,
    rounded = OPTIMIZED_IMAGE_DEFAULTS.rounded,
    className = '',
  }: OptimizedImageProps = $props();

  // État de chargement
  let loaded = $state(false);
  let error = $state(false);

  // Générer le srcset depuis l'URL Cloudinary
  const srcset = $derived(generateSrcSet(src));

  /**
   * Génère un srcset à partir d'une URL Cloudinary
   * Extrait le public_id et génère les 4 tailles standards
   */
  function generateSrcSet(url: string): string {
    if (!url || !url.includes('cloudinary.com')) {
      return '';
    }

    // Extraire le public_id complet (avec le dossier)
    // Format: .../upload/[transformations]/folder/subfolder/file.ext
    const baseUrl = url.substring(0, url.indexOf('/upload/') + 8);

    // Trouver la partie après /upload/ et avant ? ou fin de chaîne
    const afterUpload = url.substring(url.indexOf('/upload/') + 8);

    // Retirer les transformations (tout ce qui contient des , ou _ avant le premier /)
    // Ex: w_320,h_320,c_fill,g_auto,f_auto,q_auto:eco/recette-ranger/ingredients/image.jpg
    //     -> recette-ranger/ingredients/image.jpg
    const parts = afterUpload.split('/');
    let publicIdWithExt = '';

    // Trouver où commencent les dossiers (après les transformations)
    for (let i = 0; i < parts.length; i++) {
      // Les transformations contiennent des _ ou des : ou des ,
      // Les dossiers/fichiers ne contiennent généralement que des lettres, chiffres, et -
      if (!parts[i].match(/[_:,]/)) {
        // C'est le début du chemin du fichier
        publicIdWithExt = parts.slice(i).join('/');
        break;
      }
    }

    // Retirer l'extension et les query params
    const publicId = publicIdWithExt.replace(/\.[^.]+(\?.*)?$/, '');

    // Tailles standardisées pour maximiser le cache
    const widths = [320, 480, 800, 1200];

    // Calculer la hauteur selon l'aspect ratio
    const heights = widths.map(w => calculateHeight(w, aspectRatio));

    return widths
      .map((w, i) => {
        const h = heights[i];
        const transforms = aspectRatio === 'free'
          ? `w_${w},c_limit,f_auto,q_auto:eco`
          : `w_${w},h_${h},c_fill,g_auto,f_auto,q_auto:eco`;
        return `${baseUrl}${transforms}/${publicId} ${w}w`;
      })
      .join(', ');
  }

  /**
   * Calcule la hauteur selon l'aspect ratio
   */
  function calculateHeight(width: number, ratio: string): number {
    const ratios: Record<string, number> = {
      'square': 1,
      '16:9': 9 / 16,
      '4:3': 3 / 4,
      'free': 0,
    };

    return Math.round(width * (ratios[ratio] || 1));
  }

  function handleLoad() {
    loaded = true;
  }

  function handleError() {
    error = true;
  }
</script>

<div
  class="optimized-image {className}"
  class:optimized-image--loaded={loaded}
  class:optimized-image--error={error}
  class:optimized-image--rounded={rounded}
  class:optimized-image--free={aspectRatio === 'free'}
>
  {#if !error}
    <img
      {src}
      {alt}
      srcset={srcset || undefined}
      {sizes}
      loading={eager ? 'eager' : loading}
      decoding="async"
      onload={handleLoad}
      onerror={handleError}
      class="optimized-image__img"
      style:object-fit={objectFit}
    />

    {#if !loaded}
      <div class="optimized-image__placeholder">
        {#if placeholder}
          {@render placeholder()}
        {:else}
          <div class="optimized-image__skeleton"></div>
        {/if}
      </div>
    {/if}
  {:else}
    <div class="optimized-image__error">
      {#if placeholder}
        {@render placeholder()}
      {:else}
        <span class="optimized-image__error-icon">🖼️</span>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

.optimized-image {
  position: relative;
  width: 100%;
  height: 100%;       // ← remplit le parent (thumbnail de 60/80px)
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  background: $color-gray-100;
  display: flex;      // ← centre l'image
  align-items: center;
  justify-content: center;

  &--rounded {
    border-radius: $radius-lg;
  }

  &__img {
    display: block;
    opacity: 0;
    transition: opacity $transition-base $transition-ease;

    /* 🧱 CLAMP DUR : ne pas dépasser la boîte */
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &--loaded &__img {
    opacity: 1;
  }

  &__placeholder,
  &__error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  &--loaded &__placeholder {
    opacity: 0;
    transition: opacity $transition-base $transition-ease;
  }

  &__skeleton {
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      $color-gray-100 0%,
      $color-gray-200 50%,
      $color-gray-100 100%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
  }

  &__error {
    background: $color-gray-100;
    color: $color-text-tertiary;
  }

  &__error-icon {
    font-size: $font-size-2xl;
    opacity: $opacity-50;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
}

</style>
