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
  | 'bg-remover'
  | 'background-remover'
  | 'upscaler'
  | 'ocr'
  | 'result'
  | 'download'
  | 'guide'
  | 'blog'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'faq'
  | 'pricing'
  | 'coming-soon'
  | 'not-found';

export interface ToolResultDetail {
  label: string;
  value: string;
}

export interface ToolResultData {
  toolId: ActiveTab;
  toolName: string;
  toolRoute?: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  blob?: Blob;
  downloadUrl?: string;
  extractedText?: string;
  previewUrl?: string;
  dimensions?: { width: number; height: number };
  savingsPercentage?: number;
  originalSize?: number;
  details?: ToolResultDetail[];
  onDownload?: () => void;
  onResetTool?: () => void;
  onBackToWorkspace?: () => void;
}

export type BlogCategory =
  | 'Image Compression'
  | 'Image Editing'
  | 'Image Resizing'
  | 'Image Formats'
  | 'Image Conversion'
  | 'PDF Tools'
  | 'Watermarking'
  | 'Image Filters'
  | 'Image Optimization'
  | 'Image Basics'
  | 'Tutorials & Guides';

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogTocItem {
  id: string;
  title: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: BlogCategory;
  publishDate: string;
  updateDate: string;
  readingTime: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  coverGradient: string;
  relatedToolTab: ActiveTab;
  relatedToolName: string;
  ctaHeadline: string;
  ctaDescription: string;
  ctaButtonText: string;
  toc: BlogTocItem[];
  keyTakeaways: string[];
  faqs: BlogFaqItem[];
  relatedArticleSlugs: string[];
  content: {
    intro: string;
    sections: {
      id: string;
      title: string;
      subtitle?: string;
      body: string[]; // rich paragraphs
      bulletPoints?: string[];
      proTip?: string;
      warning?: string;
      table?: {
        headers: string[];
        rows: string[][];
      };
      stepList?: {
        stepNumber: number;
        title: string;
        description: string;
      }[];
    }[];
  };
}

export type Language = 'en';

