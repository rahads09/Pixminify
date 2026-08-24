import { ResizePreset, CompressionSettings } from '../types';

export const SOCIAL_PRESETS: ResizePreset[] = [
  {
    id: 'ig-square',
    name: 'Instagram Square',
    category: 'social',
    width: 1080,
    height: 1080,
    description: '1:1 Aspect Ratio post for feed',
  },
  {
    id: 'ig-story',
    name: 'Instagram Story / Reel',
    category: 'social',
    width: 1080,
    height: 1920,
    description: '9:16 Vertical HD format',
  },
  {
    id: 'yt-thumb',
    name: 'YouTube Thumbnail',
    category: 'social',
    width: 1280,
    height: 720,
    description: '16:9 Standard HD Thumbnail',
  },
  {
    id: 'x-post',
    name: 'X (Twitter) Post',
    category: 'social',
    width: 1200,
    height: 675,
    description: '16:9 In-stream photo display',
  },
  {
    id: 'fb-cover',
    name: 'Facebook Cover',
    category: 'social',
    width: 820,
    height: 312,
    description: 'Landscape header banner',
  },
  {
    id: 'linkedin-banner',
    name: 'LinkedIn Hero Banner',
    category: 'social',
    width: 1584,
    height: 396,
    description: '4:1 Professional profile cover',
  },
  {
    id: 'web-fhd',
    name: 'Full HD Web Banner',
    category: 'web',
    width: 1920,
    height: 1080,
    description: 'Standard desktop widescreen hero',
  },
  {
    id: 'web-hd',
    name: 'Medium Web Image',
    category: 'web',
    width: 1200,
    height: 800,
    description: 'Optimized for blog posts & articles',
  },
  {
    id: 'favicon',
    name: 'Favicon & App Icon',
    category: 'web',
    width: 512,
    height: 512,
    description: 'Crisp square icon',
  },
];

export const DEFAULT_SETTINGS: CompressionSettings = {
  format: 'image/webp',
  quality: 0.8,
  resizeMode: 'none',
  resizePercent: 100,
  maintainAspectRatio: true,
  stripExif: true,
  losslessPng: false,
};

export const QUALITY_PRESETS = [
  {
    name: 'Max Compression',
    quality: 0.6,
    format: 'image/webp' as const,
    description: 'Up to 90% smaller, ideal for super-fast websites',
  },
  {
    name: 'Balanced (Recommended)',
    quality: 0.8,
    format: 'image/webp' as const,
    description: 'Imperceptible quality loss with massive size savings',
  },
  {
    name: 'High Quality',
    quality: 0.9,
    format: 'original' as const,
    description: 'Preserves sharpest details, moderate size reduction',
  },
  {
    name: 'Lossless / Original',
    quality: 0.95,
    format: 'original' as const,
    description: 'Keeps same file type with clean metadata removal',
  },
];

export const SAMPLE_IMAGES = [
  {
    name: 'high-res-landscape.jpg',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=100',
    description: 'Mountain & Lake Landscape (Large 4K Photo)',
  },
  {
    name: 'portrait-photograph.jpg',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=100',
    description: 'Studio Portrait with Fine Textures',
  },
  {
    name: 'modern-architecture.jpg',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=100',
    description: 'Clean Architectural Lines & Color Gradients',
  },
];
