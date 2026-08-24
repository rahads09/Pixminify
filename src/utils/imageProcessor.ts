import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CompressionSettings, ImageFormat, ProcessedImage, ResizePreset } from '../types';
import { SOCIAL_PRESETS } from './presets';

// Utility to format bytes into readable sizes
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Check format support
export async function isAvifSupported(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const dataUrl = canvas.toDataURL('image/avif');
  return dataUrl.startsWith('data:image/avif');
}

// Load Image Element from File or URL
export function loadImageElement(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      resolve(img);
    };
    
    img.onerror = (err) => {
      reject(new Error('Failed to load image: ' + err));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      img.src = URL.createObjectURL(source);
    }
  });
}

// Calculate target dimensions
export function calculateTargetDimensions(
  origW: number,
  origH: number,
  settings: CompressionSettings
): { targetWidth: number; targetHeight: number } {
  let targetWidth = origW;
  let targetHeight = origH;

  if (settings.resizeMode === 'percentage') {
    const scale = Math.max(0.05, Math.min(1, settings.resizePercent / 100));
    targetWidth = Math.round(origW * scale);
    targetHeight = Math.round(origH * scale);
  } else if (settings.resizeMode === 'exact') {
    if (settings.maintainAspectRatio) {
      if (settings.exactWidth && !settings.exactHeight) {
        targetWidth = settings.exactWidth;
        targetHeight = Math.round((origH / origW) * targetWidth);
      } else if (settings.exactHeight && !settings.exactWidth) {
        targetHeight = settings.exactHeight;
        targetWidth = Math.round((origW / origH) * targetHeight);
      } else if (settings.exactWidth && settings.exactHeight) {
        // Fit within bounding box while keeping aspect ratio
        const ratio = Math.min(settings.exactWidth / origW, settings.exactHeight / origH);
        targetWidth = Math.round(origW * ratio);
        targetHeight = Math.round(origH * ratio);
      }
    } else {
      if (settings.exactWidth) targetWidth = settings.exactWidth;
      if (settings.exactHeight) targetHeight = settings.exactHeight;
    }
  } else if (settings.resizeMode === 'preset' && settings.selectedPreset) {
    const preset = SOCIAL_PRESETS.find((p) => p.id === settings.selectedPreset);
    if (preset) {
      if (settings.maintainAspectRatio) {
        const ratio = Math.min(preset.width / origW, preset.height / origH);
        targetWidth = Math.round(origW * ratio);
        targetHeight = Math.round(origH * ratio);
      } else {
        targetWidth = preset.width;
        targetHeight = preset.height;
      }
    }
  }

  // Ensure minimum 1px dimension
  targetWidth = Math.max(1, targetWidth);
  targetHeight = Math.max(1, targetHeight);

  return { targetWidth, targetHeight };
}

// Determine target mime type
export function resolveMimeType(originalType: string, formatSetting: ImageFormat): string {
  if (formatSetting === 'original') {
    // If original is supported browser format, use it; otherwise fallback to webp
    if (['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(originalType)) {
      return originalType;
    }
    return 'image/webp';
  }
  return formatSetting;
}

// Get file extension from mime type
export function getExtensionFromMime(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    default:
      return 'webp';
  }
}

// Core Image Processing Function
export async function processSingleImage(
  item: ProcessedImage,
  settings: CompressionSettings
): Promise<ProcessedImage> {
  try {
    const img = await loadImageElement(item.file);
    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;

    const { targetWidth, targetHeight } = calculateTargetDimensions(origW, origH, settings);
    const targetMime = resolveMimeType(item.originalType, settings.format);

    // Canvas rendering
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Handle background fill if converting transparent PNG to JPEG
    if (targetMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    // If target file size is set (e.g. 200KB), perform binary search quality calculation
    let finalBlob: Blob;
    
    if (settings.targetFileSizeKB && settings.targetFileSizeKB > 0 && targetMime !== 'image/png') {
      finalBlob = await optimizeToTargetSize(canvas, targetMime, settings.targetFileSizeKB * 1024);
    } else {
      const quality = targetMime === 'image/png' ? undefined : settings.quality;
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to generate image blob'));
          },
          targetMime,
          quality
        );
      });
    }

    const compressedSize = finalBlob.size;
    const savings = Math.max(0, Math.round(((item.originalSize - compressedSize) / item.originalSize) * 100));
    const compressedPreviewUrl = URL.createObjectURL(finalBlob);

    return {
      ...item,
      status: 'done',
      compressedBlob: finalBlob,
      compressedSize,
      compressedWidth: targetWidth,
      compressedHeight: targetHeight,
      compressedType: targetMime,
      compressedPreviewUrl,
      savingsPercentage: savings,
    };
  } catch (error: any) {
    return {
      ...item,
      status: 'error',
      errorMessage: error.message || 'Compression failed',
    };
  }
}

// Binary search for Target File Size
async function optimizeToTargetSize(
  canvas: HTMLCanvasElement,
  mimeType: string,
  targetBytes: number
): Promise<Blob> {
  let minQ = 0.05;
  let maxQ = 0.98;
  let bestBlob: Blob | null = null;

  for (let i = 0; i < 6; i++) {
    const midQ = (minQ + maxQ) / 2;
    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob fail'))), mimeType, midQ);
    });

    if (!bestBlob || Math.abs(blob.size - targetBytes) < Math.abs(bestBlob.size - targetBytes)) {
      bestBlob = blob;
    }

    if (blob.size > targetBytes) {
      maxQ = midQ;
    } else {
      minQ = midQ;
    }
  }

  return bestBlob || (await new Promise((resolve) => canvas.toBlob((b) => resolve(b!), mimeType, 0.7)));
}

// Generate new output filename
export function getOutputFilename(originalName: string, targetMime: string, prefix = 'pixminify_'): string {
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const ext = getExtensionFromMime(targetMime);
  return `${prefix}${baseName}.${ext}`;
}

// Download single image
export function downloadImage(item: ProcessedImage): void {
  if (!item.compressedBlob || !item.compressedType) return;
  const filename = getOutputFilename(item.name, item.compressedType);
  saveAs(item.compressedBlob, filename);
}

// Download all images as ZIP
export async function downloadAllAsZip(items: ProcessedImage[]): Promise<void> {
  const completed = items.filter((item) => item.status === 'done' && item.compressedBlob);
  if (completed.length === 0) return;

  const zip = new JSZip();
  const folder = zip.folder('pixminify_optimized_images') || zip;

  completed.forEach((item, index) => {
    if (item.compressedBlob && item.compressedType) {
      const filename = getOutputFilename(item.name, item.compressedType);
      // Ensure unique filenames
      const uniqueName = folder.file(filename) ? `${index + 1}_${filename}` : filename;
      folder.file(uniqueName, item.compressedBlob);
    }
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `pixminify_batch_${Date.now()}.zip`);
}
