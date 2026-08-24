export type ImageFormat = 'original' | 'image/webp' | 'image/jpeg' | 'image/png' | 'image/avif';

export type ResizeMode = 'none' | 'percentage' | 'exact' | 'preset';

export interface ResizePreset {
  id: string;
  name: string;
  category: 'social' | 'web' | 'device';
  width: number;
  height: number;
  description: string;
  iconName?: string;
}

export interface CompressionSettings {
  format: ImageFormat;
  quality: number; // 0.05 to 1.0 (5% to 100%)
  resizeMode: ResizeMode;
  resizePercent: number; // 10 to 100
  exactWidth?: number;
  exactHeight?: number;
  maintainAspectRatio: boolean;
  selectedPreset?: string;
  stripExif: boolean;
  targetFileSizeKB?: number; // 0 or undefined if disabled
  losslessPng?: boolean;
}

export interface ProcessedImage {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalPreviewUrl: string;
  
  // Output
  status: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  compressedBlob?: Blob;
  compressedSize?: number;
  compressedWidth?: number;
  compressedHeight?: number;
  compressedType?: string;
  compressedPreviewUrl?: string;
  savingsPercentage?: number;
  
  // Specific settings override
  customSettings?: CompressionSettings;
}

export type ActiveTab =
  | 'home'
  | 'compress'
  | 'crop'
  | 'rotate'
  | 'convert'
  | 'resize'
  | 'pdf'
  | 'watermark'
  | 'filter'
  | 'guide'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'faq'
  | 'pricing'
  | 'coming-soon';

export type Language = 'en';

