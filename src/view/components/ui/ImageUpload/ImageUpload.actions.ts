/**
 * ImageUpload Actions
 * Business logic for the ImageUpload component
 */

import Cropper from 'cropperjs';
import { IMAGE_UPLOAD_MESSAGES, IMAGE_UPLOAD_API, CROPPER_CONFIG } from './ImageUpload.config';

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Validate uploaded file
 */
export function validateFile(file: File, maxSizeMB: number): string | null {
  if (!file.type.startsWith('image/')) {
    return IMAGE_UPLOAD_MESSAGES.errorNotImage;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return IMAGE_UPLOAD_MESSAGES.errorTooLarge(maxSizeMB);
  }

  return null;
}

/**
 * Read file and convert to data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ============================================
// CROPPER MANAGEMENT
// ============================================

/**
 * Initialize Cropper instance
 */
export function initializeCropper(
  imageElement: HTMLImageElement,
  aspectRatio: number
): Cropper {
  return new Cropper(imageElement, {
    aspectRatio,
    viewMode: CROPPER_CONFIG.viewMode,
    guides: CROPPER_CONFIG.guides,
    center: CROPPER_CONFIG.center,
    highlight: CROPPER_CONFIG.highlight,
    background: CROPPER_CONFIG.background,
    autoCropArea: CROPPER_CONFIG.autoCropArea,
    responsive: CROPPER_CONFIG.responsive,
    checkOrientation: CROPPER_CONFIG.checkOrientation,
  });
}

/**
 * Destroy cropper instance if exists
 */
export function destroyCropper(cropper: Cropper | null): null {
  if (cropper) {
    cropper.destroy();
  }
  return null;
}

// ============================================
// IMAGE PROCESSING
// ============================================

/**
 * Get cropped canvas from cropper instance
 */
export function getCroppedCanvas(cropper: Cropper): HTMLCanvasElement | null {
  return cropper.getCroppedCanvas({
    maxWidth: CROPPER_CONFIG.maxWidth,
    maxHeight: CROPPER_CONFIG.maxHeight,
    fillColor: CROPPER_CONFIG.fillColor,
  });
}

/**
 * Convert canvas to blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob!);
      },
      CROPPER_CONFIG.outputFormat,
      CROPPER_CONFIG.quality
    );
  });
}

// ============================================
// UPLOAD
// ============================================

/**
 * Upload image blob to server
 */
export async function uploadImage(blob: Blob, filename: string): Promise<any> {
  const formData = new FormData();
  formData.append('image', blob, filename);

  const response = await fetch(IMAGE_UPLOAD_API.uploadEndpoint, {
    method: IMAGE_UPLOAD_API.method,
    body: formData,
    credentials: IMAGE_UPLOAD_API.credentials,
  });

  if (!response.ok) {
    throw new Error(IMAGE_UPLOAD_MESSAGES.errorUpload);
  }

  return response.json();
}

// ============================================
// DRAG & DROP HANDLERS
// ============================================

/**
 * Handle drag enter event
 */
export function handleDragEnter(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Handle drag over event
 */
export function handleDragOver(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Handle drag leave event
 */
export function handleDragLeave(e: DragEvent): void {
  e.preventDefault();
  e.stopPropagation();
}

/**
 * Extract file from drop event
 */
export function getFileFromDrop(e: DragEvent): File | null {
  e.preventDefault();
  e.stopPropagation();

  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return null;

  return files[0];
}
