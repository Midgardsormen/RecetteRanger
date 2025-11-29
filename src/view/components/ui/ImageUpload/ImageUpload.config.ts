/**
 * ImageUpload Configuration
 * Constants and default values for the ImageUpload component
 */

import type { ImageUploadCropShape, ImageUploadVariant } from '../../../types/ui.types';

// ============================================
// DEFAULT VALUES
// ============================================

export const IMAGE_UPLOAD_DEFAULTS = {
  aspectRatio: 1,
  cropShape: 'rect' as ImageUploadCropShape,
  maxSizeMB: 5,
  value: null,
  variant: 'default' as ImageUploadVariant,
} as const;

// ============================================
// CROPPER CONFIG
// ============================================

export const CROPPER_CONFIG = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.9,
  outputFormat: 'image/webp' as const,
  fillColor: '#ffffff',
  viewMode: 1,
  guides: true,
  center: true,
  highlight: true,
  background: true,
  autoCropArea: 1,
  responsive: true,
  checkOrientation: false,
} as const;

// ============================================
// MESSAGES
// ============================================

export const IMAGE_UPLOAD_MESSAGES = {
  errorNotImage: 'Veuillez sélectionner une image',
  errorTooLarge: (maxSizeMB: number) => `L'image ne doit pas dépasser ${maxSizeMB}MB`,
  errorCropperInit: 'Erreur lors de l\'initialisation du cropper',
  errorCropperNotInit: 'Le cropper n\'est pas initialisé',
  errorCanvasGeneration: 'Impossible de générer le canvas',
  errorUpload: 'Erreur lors de l\'upload',
  uploading: 'Upload en cours...',
  validate: 'Valider et uploader',
  cancel: 'Annuler',
  change: 'Changer',
  remove: 'Supprimer',
  dropzoneDefault: 'Glissez-déposez une image ou cliquez',
  dropzoneDragging: 'Déposez votre image ici',
  dropzoneHint: (maxSizeMB: number) => `JPG, PNG ou WebP - Max ${maxSizeMB}MB`,
} as const;

// ============================================
// SIZES
// ============================================

export const IMAGE_UPLOAD_SIZES = {
  previewWidth: '200px',
  previewHeight: '200px',
  dropzoneMinHeight: '200px',
  cropperMaxHeight: '400px',
} as const;

// ============================================
// API
// ============================================

export const IMAGE_UPLOAD_API = {
  uploadEndpoint: '/api/upload/ingredient-image',
  method: 'POST',
  credentials: 'include' as RequestCredentials,
} as const;

// ============================================
// FILE CONFIG
// ============================================

export const IMAGE_UPLOAD_FILE = {
  acceptedTypes: 'image/jpeg,image/png,image/webp',
  outputFilename: 'image.webp',
} as const;
