<script lang="ts">
  import { onMount } from 'svelte';
  import Cropper from 'cropperjs';

  interface Props {
    value?: string | null;
    onUpload: (url: string) => void;
    aspectRatio?: number;
    cropShape?: 'rect' | 'circle';
    maxSizeMB?: number;
  }

  let {
    value = null,
    onUpload,
    aspectRatio = 1,
    cropShape = 'rect',
    maxSizeMB = 5
  }: Props = $props();

  let fileInput = $state<HTMLInputElement | null>(null);
  let imageElement = $state<HTMLImageElement | null>(null);
  let previewUrl = $state<string | null>(value);
  let cropper: Cropper | null = null;
  let showCropper = $state(false);
  let uploading = $state(false);
  let error = $state<string | null>(null);
  let isDragging = $state(false);

  function processFile(file: File) {
    // Validation
    if (!file.type.startsWith('image/')) {
      error = 'Veuillez sélectionner une image';
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      error = `L'image ne doit pas dépasser ${maxSizeMB}MB`;
      return;
    }

    error = null;

    // Détruire l'ancien cropper si existant
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    // Créer une URL de preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl = e.target?.result as string;
      showCropper = true;
    };
    reader.readAsDataURL(file);
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    processFile(file);
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    processFile(file);
  }

  // Synchroniser previewUrl avec la prop value quand elle change
  $effect(() => {
    previewUrl = value;
  });

  // Initialiser Cropper quand showCropper devient true et que l'image est chargée
  $effect(() => {
    if (showCropper && imageElement && !cropper) {
      console.log('Initializing cropper...', { showCropper, imageElement, cropper });
      // Attendre que l'image soit chargée dans le DOM
      const img = imageElement;

      if (img.complete) {
        // Image déjà chargée
        console.log('Image already loaded, initializing cropper immediately');
        initCropper();
      } else {
        // Attendre le chargement
        console.log('Waiting for image to load...');
        img.onload = () => {
          console.log('Image loaded, initializing cropper');
          initCropper();
        };
      }
    }
  });

  function initCropper() {
    console.log('initCropper called', { imageElement, cropper });
    if (!imageElement || cropper) {
      console.log('Aborting: no imageElement or cropper already exists');
      return;
    }

    try {
      console.log('Creating Cropper instance...');
      cropper = new Cropper(imageElement, {
        aspectRatio,
        viewMode: 1,
        guides: true,
        center: true,
        highlight: true,
        background: true,
        autoCropArea: 1,
        responsive: true,
        checkOrientation: false,
      });
      console.log('Cropper created successfully', cropper);
    } catch (err) {
      console.error('Error creating Cropper:', err);
      error = 'Erreur lors de l\'initialisation du cropper';
    }
  }

  async function handleCrop() {
    if (!cropper) {
      error = 'Le cropper n\'est pas initialisé';
      return;
    }

    uploading = true;
    error = null;

    try {
      // Récupérer le canvas croppé
      const canvas = cropper.getCroppedCanvas({
        maxWidth: 1200,
        maxHeight: 1200,
        fillColor: '#fff',
      });

      if (!canvas) {
        throw new Error('Impossible de générer le canvas');
      }

      // Convertir en Blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/webp', 0.9);
      });

      // Créer FormData pour l'upload
      const formData = new FormData();
      formData.append('image', blob, 'image.webp');

      // Upload vers le backend
      const response = await fetch('/api/upload/ingredient-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const data = await response.json();

      // Nettoyer Cropper
      if (cropper) {
        cropper.destroy();
        cropper = null;
      }

      // Appeler le callback avec l'URL de l'image medium
      onUpload(data.medium.url);

      // Mettre à jour la preview et cacher le cropper
      previewUrl = data.medium.url;
      showCropper = false;
    } catch (err: any) {
      error = err.message || 'Erreur lors de l\'upload';
    } finally {
      uploading = false;
    }
  }

  function handleCancel() {
    showCropper = false;
    previewUrl = value;

    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    // Reset le input
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function handleRemove() {
    previewUrl = null;
    onUpload('');

    if (fileInput) {
      fileInput.value = '';
    }
  }
</script>

<div class="image-upload">
  {#if !showCropper}
    <!-- Preview ou zone de drop -->
    <div class="image-upload__preview">
      {#if previewUrl}
        <img
          src={previewUrl}
          alt="Preview"
          class="image-upload__preview-img"
          class:image-upload__preview-img--circle={cropShape === 'circle'}
        />
        <div class="image-upload__preview-actions">
          <button
            type="button"
            class="image-upload__btn image-upload__btn--change"
            onclick={() => fileInput?.click()}
          >
            Changer
          </button>
          <button
            type="button"
            class="image-upload__btn image-upload__btn--remove"
            onclick={handleRemove}
          >
            Supprimer
          </button>
        </div>
      {:else}
        <div
          class="image-upload__dropzone"
          class:image-upload__dropzone--dragging={isDragging}
          ondragenter={handleDragEnter}
          ondragover={handleDragOver}
          ondragleave={handleDragLeave}
          ondrop={handleDrop}
          onclick={() => fileInput?.click()}
          role="button"
          tabindex="0"
        >
          <div class="image-upload__dropzone-icon">
            {isDragging ? '📥' : '📷'}
          </div>
          <div class="image-upload__dropzone-text">
            {isDragging ? 'Déposez votre image ici' : 'Glissez-déposez une image ou cliquez'}
          </div>
          <div class="image-upload__dropzone-hint">
            JPG, PNG ou WebP - Max {maxSizeMB}MB
          </div>
        </div>
      {/if}
    </div>

    <input
      bind:this={fileInput}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onchange={handleFileSelect}
      class="image-upload__input"
    />
  {:else}
    <!-- Cropper -->
    <div class="image-upload__cropper">
      <div class="image-upload__cropper-container">
        <img
          bind:this={imageElement}
          src={previewUrl || ''}
          alt="Crop"
          class="image-upload__cropper-img"
        />
      </div>

      <div class="image-upload__cropper-actions">
        <button
          type="button"
          class="image-upload__btn image-upload__btn--secondary"
          onclick={handleCancel}
          disabled={uploading}
        >
          Annuler
        </button>
        <button
          type="button"
          class="image-upload__btn image-upload__btn--primary"
          onclick={handleCrop}
          disabled={uploading}
        >
          {uploading ? 'Upload en cours...' : 'Valider et uploader'}
        </button>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="image-upload__error">{error}</div>
  {/if}
</div>

<style lang="scss">
  $primary-color: #667eea;
  $secondary-color: #764ba2;
  $danger-color: #f56565;
  $white: #fff;
  $text-dark: #333;
  $text-gray: #666;
  $border-color: #e0e0e0;
  $spacing-base: 1rem;

  .image-upload {
    width: 100%;

    &__input {
      display: none;
    }

    &__preview {
      position: relative;
      width: 100%;
    }

    &__preview-img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid $border-color;
      display: block;

      &--circle {
        border-radius: 50%;
      }
    }

    &__preview-actions {
      display: flex;
      gap: $spacing-base * 0.5;
      margin-top: $spacing-base;
    }

    &__dropzone {
      width: 100%;
      min-height: 200px;
      border: 2px dashed $border-color;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: $spacing-base * 0.5;
      background: rgba(102, 126, 234, 0.02);
      cursor: pointer;
      transition: all 0.3s ease;
      padding: $spacing-base * 2;

      &:hover {
        border-color: $primary-color;
        background: rgba(102, 126, 234, 0.05);
        transform: translateY(-2px);
      }

      &--dragging {
        border-color: $primary-color;
        border-width: 3px;
        background: rgba(102, 126, 234, 0.1);
        transform: scale(1.02);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
      }
    }

    &__dropzone-icon {
      font-size: 3rem;
      transition: transform 0.3s ease;

      .image-upload__dropzone--dragging & {
        transform: scale(1.2);
        animation: bounce 0.6s ease infinite;
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: scale(1.2) translateY(0);
      }
      50% {
        transform: scale(1.2) translateY(-10px);
      }
    }

    &__dropzone-text {
      font-size: 1rem;
      font-weight: 600;
      color: $text-dark;
    }

    &__dropzone-hint {
      font-size: 0.85rem;
      color: $text-gray;
    }

    &__cropper {
      width: 100%;
    }

    &__cropper-container {
      max-height: 400px;
      overflow: hidden;
      border-radius: 8px;
      border: 2px solid $border-color;
      margin-bottom: $spacing-base;
    }

    &__cropper-img {
      max-width: 100%;
      display: block;
    }

    &__cropper-actions {
      display: flex;
      gap: $spacing-base;
      justify-content: flex-end;
    }

    &__btn {
      padding: $spacing-base * 0.75 $spacing-base * 1.5;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &--change,
      &--secondary {
        background: rgba(102, 102, 102, 0.1);
        color: $text-gray;

        &:hover:not(:disabled) {
          background: rgba(102, 102, 102, 0.2);
        }
      }

      &--remove {
        background: rgba(245, 101, 101, 0.1);
        color: $danger-color;

        &:hover:not(:disabled) {
          background: rgba(245, 101, 101, 0.2);
        }
      }

      &--primary {
        background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
        color: $white;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }
    }

    &__error {
      margin-top: $spacing-base * 0.5;
      padding: $spacing-base * 0.75;
      background: rgba(245, 101, 101, 0.1);
      border: 1px solid rgba(245, 101, 101, 0.3);
      border-radius: 6px;
      color: $danger-color;
      font-size: 0.9rem;
    }
  }
</style>
