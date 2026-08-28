import { BlogArticle, BlogCategory } from '../types';
import { compressImagesArticle } from './articles/compressImagesArticle';
import { cropImagesArticle } from './articles/cropImagesArticle';
import { resizeImagesArticle } from './articles/resizeImagesArticle';
import { jpgPngWebpArticle } from './articles/jpgPngWebpArticle';
import { convertImagesPdfArticle } from './articles/convertImagesPdfArticle';
import { addWatermarkArticle } from './articles/addWatermarkArticle';
import { rotateFlipImagesArticle } from './articles/rotateFlipImagesArticle';
import { useImageFiltersArticle } from './articles/useImageFiltersArticle';
import { reduceImageFileSizeArticle } from './articles/reduceImageFileSizeArticle';
import { whatImageSizeArticle } from './articles/whatImageSizeArticle';
import { jpgPngWebpForWebsitesArticle } from './articles/jpgPngWebpForWebsitesArticle';
import { lossyVsLosslessArticle } from './articles/lossyVsLosslessArticle';
import { optimizeImagesForSpeedArticle } from './articles/optimizeImagesForSpeedArticle';
import { whatIsImageResolutionArticle } from './articles/whatIsImageResolutionArticle';
import { chooseRightImageFormatArticle } from './articles/chooseRightImageFormatArticle';

export const BLOG_CATEGORIES: BlogCategory[] = [
  'Image Compression',
  'Image Optimization',
  'Image Formats',
  'Image Resizing',
  'Image Editing',
  'Image Conversion',
  'PDF Tools',
  'Watermarking',
  'Image Filters',
  'Image Basics',
  'Tutorials & Guides',
];

export const BLOG_ARTICLES: BlogArticle[] = [
  compressImagesArticle,
  cropImagesArticle,
  resizeImagesArticle,
  jpgPngWebpArticle,
  convertImagesPdfArticle,
  addWatermarkArticle,
  rotateFlipImagesArticle,
  useImageFiltersArticle,
  reduceImageFileSizeArticle,
  whatImageSizeArticle,
  jpgPngWebpForWebsitesArticle,
  lossyVsLosslessArticle,
  optimizeImagesForSpeedArticle,
  whatIsImageResolutionArticle,
  chooseRightImageFormatArticle,
];

export const getArticleBySlug = (slug: string): BlogArticle | undefined => {
  const cleanSlug = slug.replace(/^\/blog\/|\/$/g, '').trim();
  return BLOG_ARTICLES.find((article) => article.slug === cleanSlug);
};

export const getRelatedArticles = (article: BlogArticle, limit = 3): BlogArticle[] => {
  // First match explicit relatedArticleSlugs
  const explicitMatches = BLOG_ARTICLES.filter((a) =>
    article.relatedArticleSlugs.includes(a.slug)
  );

  if (explicitMatches.length >= limit) {
    return explicitMatches.slice(0, limit);
  }

  // Fallback to same category or other articles
  const otherMatches = BLOG_ARTICLES.filter(
    (a) => a.slug !== article.slug && !explicitMatches.some((m) => m.slug === a.slug)
  );

  return [...explicitMatches, ...otherMatches].slice(0, limit);
};

export const getArticlesByCategory = (category: BlogCategory | 'All'): BlogArticle[] => {
  if (category === 'All') return BLOG_ARTICLES;
  return BLOG_ARTICLES.filter((article) => article.category === category);
};

