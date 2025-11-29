<script lang="ts">
  import type { ImageUploadProps } from '../../../types/ui.types';
  import type Cropper from 'cropperjs';
  import { Camera, Download } from 'lucide-svelte';
  import Button from '../Button.svelte';
  import {
    IMAGE_UPLOAD_DEFAULTS,
    IMAGE_UPLOAD_MESSAGES,
    IMAGE_UPLOAD_FILE,
    IMAGE_UPLOAD_SIZES,
  } from './ImageUpload.config';
  import {
    validateFile,
    readFileAsDataURL,
    initializeCropper,
    destroyCropper,
    getCroppedCanvas,
    canvasToBlob,
    uploadImage,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    getFileFromDrop,
  } from './ImageUpload.actions';

  let {
    value = IMAGE_UPLOAD_DEFAULTS.value,
    onUpload,
    aspectRatio = IMAGE_UPLOAD_DEFAULTS.aspectRatio,
    cropShape = IMAGE_UPLOAD_DEFAULTS.cropShape,
    maxSizeMB = IMAGE_UPLOAD_DEFAULTS.maxSizeMB,
    variant = IMAGE_UPLOAD_DEFAULTS.variant,
  }: ImageUploadProps = $props();

  let fileInput = $state<HTMLInputElement | null>(null);
  let imageElement = $state<HTMLImageElement | null>(null);
  let previewUrl = $state<string | null>(value);
  let cropper: Cropper | null = null;
  let showCropper = $state(false);
  let uploading = $state(false);
  let error = $state<string | null>(null);
  let isDragging = $state(false);

  async function processFile(file: File) {
    // Validation
    const validationError = validateFile(file, maxSizeMB);
    if (validationError) {
      error = validationError;
      return;
    }

    error = null;

    // Détruire l'ancien cropper si existant
    cropper = destroyCropper(cropper);

    // Créer une URL de preview
    try {
      previewUrl = await readFileAsDataURL(file);
      showCropper = true;
    } catch (err) {
      error = IMAGE_UPLOAD_MESSAGES.errorUpload;
    }
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;
    processFile(file);
  }

  function handleDragEnterLocal(e: DragEvent) {
    handleDragEnter(e);
    isDragging = true;
  }

  function handleDragOverLocal(e: DragEvent) {
    handleDragOver(e);
  }

  function handleDragLeaveLocal(e: DragEvent) {
    handleDragLeave(e);
    isDragging = false;
  }

  function handleDropLocal(e: DragEvent) {
    const file = getFileFromDrop(e);
    isDragging = false;

    if (file) {
      processFile(file);
    }
  }

  // Synchroniser previewUrl avec la prop value quand elle change
  $effect(() => {
    previewUrl = value;
  });

  // Initialiser Cropper quand showCropper devient true et que l'image est chargée
  $effect(() => {
    if (showCropper && imageElement && !cropper) {
      const img = imageElement;

      if (img.complete) {
        initCropperInstance();
      } else {
        img.onload = () => {
          initCropperInstance();
        };
      }
    }
  });

  function initCropperInstance() {
    if (!imageElement || cropper) {
      return;
    }

    try {
      cropper = initializeCropper(imageElement, aspectRatio);
    } catch (err) {
      console.error('Error creating Cropper:', err);
      error = IMAGE_UPLOAD_MESSAGES.errorCropperInit;
    }
  }

  async function handleCrop() {
    if (!cropper) {
      error = IMAGE_UPLOAD_MESSAGES.errorCropperNotInit;
      return;
    }

    uploading = true;
    error = null;

    try {
      // Récupérer le canvas croppé
      const canvas = getCroppedCanvas(cropper);

      if (!canvas) {
        throw new Error(IMAGE_UPLOAD_MESSAGES.errorCanvasGeneration);
      }

      // Convertir en Blob
      const blob = await canvasToBlob(canvas);

      // Upload vers le backend
      const data = await uploadImage(blob, IMAGE_UPLOAD_FILE.outputFilename);

      // Nettoyer Cropper
      cropper = destroyCropper(cropper);

      // Appeler le callback avec l'URL de l'image medium
      onUpload(data.medium.url);

      // Mettre à jour la preview et cacher le cropper
      previewUrl = data.medium.url;
      showCropper = false;
    } catch (err: any) {
      error = err.message || IMAGE_UPLOAD_MESSAGES.errorUpload;
    } finally {
      uploading = false;
    }
  }

  function handleCancel() {
    showCropper = false;
    previewUrl = value;

    cropper = destroyCropper(cropper);

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

<div class="image-upload" class:image-upload--inverse={variant === 'inverse'}>
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
          <Button
            variant={variant === 'inverse' ? 'ghost-inverse' : 'ghost'}
            size="medium"
            onclick={() => fileInput?.click()}
          >
            {IMAGE_UPLOAD_MESSAGES.change}
          </Button>
          <Button
            variant={variant === 'inverse' ? 'danger-inverse' : 'danger'}
            size="medium"
            onclick={handleRemove}
          >
            {IMAGE_UPLOAD_MESSAGES.remove}
          </Button>
        </div>
      {:else}
        <div
          class="image-upload__dropzone"
          class:image-upload__dropzone--dragging={isDragging}
          ondragenter={handleDragEnterLocal}
          ondragover={handleDragOverLocal}
          ondragleave={handleDragLeaveLocal}
          ondrop={handleDropLocal}
          onclick={() => fileInput?.click()}
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInput?.click();
            }
          }}
          role="button"
          tabindex="0"
        >
          <div class="image-upload__dropzone-icon">
            {#if isDragging}
              <Download size={48} />
            {:else}
              <Camera size={48} />
            {/if}
          </div>
          <div class="image-upload__dropzone-text">
            {isDragging ? IMAGE_UPLOAD_MESSAGES.dropzoneDragging : IMAGE_UPLOAD_MESSAGES.dropzoneDefault}
          </div>
          <div class="image-upload__dropzone-hint">
            {IMAGE_UPLOAD_MESSAGES.dropzoneHint(maxSizeMB)}
          </div>
        </div>
      {/if}
    </div>

    <input
      bind:this={fileInput}
      type="file"
      accept={IMAGE_UPLOAD_FILE.acceptedTypes}
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
        <Button
          variant={variant === 'inverse' ? 'ghost-inverse' : 'ghost'}
          onclick={handleCancel}
          disabled={uploading}
        >
          {IMAGE_UPLOAD_MESSAGES.cancel}
        </Button>
        <Button
          variant={variant === 'inverse' ? 'primary-inverse' : 'primary'}
          onclick={handleCrop}
          disabled={uploading}
        >
          {uploading ? IMAGE_UPLOAD_MESSAGES.uploading : IMAGE_UPLOAD_MESSAGES.validate}
        </Button>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="image-upload__error">{error}</div>
  {/if}
</div>

<style lang="scss">
  @use '../../../styles/variables' as *;

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
      border-radius: $radius-lg;
      border: $border-width-base solid $color-border-primary;
      display: block;

      &--circle {
        border-radius: $radius-full;
      }
    }

    &__preview-actions {
      display: flex;
      gap: $spacing-sm;
      margin-top: $spacing-base;
    }

    &__dropzone {
      width: 100%;
      min-height: 200px;
      border: $border-width-base dashed $color-border-primary;
      border-radius: $radius-lg;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: $spacing-sm;
      background: $color-primary-alpha-03;
      cursor: pointer;
      transition: all $transition-base $transition-ease;
      padding: $spacing-lg;
      box-sizing: border-box;

      &:hover {
        border-color: $brand-primary;
        background: $color-primary-alpha-05;
        transform: $transform-hover-lift-sm;
      }

      &--dragging {
        border-color: $brand-primary;
        border-width: $border-width-thick;
        background: $color-primary-alpha-10;
        transform: scale(1.02);
        box-shadow: $shadow-image-upload-drag;
      }
    }

    &__dropzone-icon {
      color: $brand-primary;
      transition: transform $transition-base $transition-ease;

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
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      text-align: center;
    }

    &__dropzone-hint {
      font-size: $font-size-sm;
      color: $color-text-secondary;
    }

    &__cropper {
      width: 100%;
    }

    &__cropper-container {
      max-height: 400px;
      overflow: hidden;
      border-radius: $radius-lg;
      border: $border-width-base solid $color-border-primary;
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

    &__error {
      margin-top: $spacing-sm;
      padding: $spacing-md;
      background: $color-background-danger;
      border: $border-width-thin solid $color-danger-alpha-30;
      border-radius: $radius-md;
      color: $color-danger;
      font-size: $font-size-sm;
    }

    // ============================================
    // VARIANT: INVERSE (for dark backgrounds)
    // ============================================
    &--inverse {
      .image-upload__preview-img {
        border-color: $color-white-alpha-30;
      }

      .image-upload__dropzone {
        border-color: $color-white-alpha-30;
        background: $color-white-alpha-10;

        &:hover {
          border-color: $color-white;
          background: $color-white-alpha-15;
        }

        &--dragging {
          border-color: $color-white;
          background: $color-white-alpha-20;
        }
      }

      .image-upload__dropzone-icon {
        color: $color-white;
      }

      .image-upload__dropzone-text {
        color: $color-white;
      }

      .image-upload__dropzone-hint {
        color: rgba(255, 255, 255, 0.7);
      }

      .image-upload__cropper-container {
        border-color: $color-white-alpha-30;
      }

      .image-upload__error {
        background: rgba(220, 38, 38, 0.2);
        border-color: $color-danger-light;
        color: $color-danger-light;
      }
    }
  }
</style>
