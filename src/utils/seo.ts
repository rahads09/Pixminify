import { ActiveTab, BlogArticle } from '../types';
import { getArticleBySlug } from '../data/blogArticles';

export interface SeoMetadata {
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  keywords?: string[];
}

export const CANONICAL_DOMAIN = 'https://www.pixminify.com';

export const SEO_DATA: Record<ActiveTab, SeoMetadata> = {
  home: {
    path: '/',
    title: 'Pixminify - Free Online Image Tools & Photo Optimizer',
    description: 'All-in-one free in-browser image optimization suite. Compress, crop, resize, rotate, convert, watermark, and create PDFs with zero server uploads.',
    h1: 'All the Image Tools You Need, in One Place',
    canonical: `${CANONICAL_DOMAIN}/`,
    ogTitle: 'Pixminify - Free Online Image Tools & Photo Optimizer',
    ogDescription: 'All-in-one free in-browser image optimization suite. Compress, crop, resize, rotate, convert, watermark, and create PDFs with zero server uploads.',
    ogUrl: `${CANONICAL_DOMAIN}/`,
    keywords: ['image tools', 'image compressor', 'photo editor online', 'convert image', 'crop picture', 'watermark photos', 'image to pdf'],
  },
  compress: {
    path: '/compress/',
    title: 'Image Compressor Online - Compress Images Free | Pixminify',
    description: 'Compress JPG, PNG and WebP images online for free with Pixminify. Reduce image file size while maintaining image quality.',
    h1: 'Compress Images Online',
    canonical: `${CANONICAL_DOMAIN}/compress/`,
    ogTitle: 'Image Compressor Online - Compress Images Free | Pixminify',
    ogDescription: 'Compress JPG, PNG and WebP images online for free with Pixminify. Reduce image file size while maintaining image quality.',
    ogUrl: `${CANONICAL_DOMAIN}/compress/`,
    keywords: ['image compressor', 'compress images online', 'reduce image size', 'jpg compressor', 'png compressor', 'webp optimizer'],
  },
  crop: {
    path: '/crop/',
    title: 'Image Cropper Online - Crop Images Free | Pixminify',
    description: 'Crop JPG, PNG and WebP images online for free. Easily crop your images to the desired size with Pixminify.',
    h1: 'Crop Images Online',
    canonical: `${CANONICAL_DOMAIN}/crop/`,
    ogTitle: 'Image Cropper Online - Crop Images Free | Pixminify',
    ogDescription: 'Crop JPG, PNG and WebP images online for free. Easily crop your images to the desired size with Pixminify.',
    ogUrl: `${CANONICAL_DOMAIN}/crop/`,
    keywords: ['image cropper', 'crop images free', 'crop photo online', 'aspect ratio crop', 'circle crop photo'],
  },
  resize: {
    path: '/resize/',
    title: 'Image Resizer Online - Resize Images Free | Pixminify',
    description: 'Resize JPG, PNG and WebP images online for free. Quickly change image dimensions while maintaining quality.',
    h1: 'Resize Images Online',
    canonical: `${CANONICAL_DOMAIN}/resize/`,
    ogTitle: 'Image Resizer Online - Resize Images Free | Pixminify',
    ogDescription: 'Resize JPG, PNG and WebP images online for free. Quickly change image dimensions while maintaining quality.',
    ogUrl: `${CANONICAL_DOMAIN}/resize/`,
    keywords: ['image resizer', 'resize images free', 'social media photo resizer', 'change image dimensions', 'photo scale'],
  },
  convert: {
    path: '/convert/',
    title: 'Image Converter Online - Convert Images Free | Pixminify',
    description: 'Convert images between JPG, PNG, WebP and other supported formats online for free with Pixminify.',
    h1: 'Convert Images Online',
    canonical: `${CANONICAL_DOMAIN}/convert/`,
    ogTitle: 'Image Converter Online - Convert Images Free | Pixminify',
    ogDescription: 'Convert images between JPG, PNG, WebP and other supported formats online for free with Pixminify.',
    ogUrl: `${CANONICAL_DOMAIN}/convert/`,
    keywords: ['image converter', 'convert images online', 'png to jpg', 'jpg to webp', 'avif converter', 'batch image conversion'],
  },
  rotate: {
    path: '/rotate/',
    title: 'Rotate Images Online - Free Image Rotator | Pixminify',
    description: 'Rotate and flip your images online for free. Quickly rotate JPG, PNG and other image formats with Pixminify.',
    h1: 'Rotate Images Online',
    canonical: `${CANONICAL_DOMAIN}/rotate/`,
    ogTitle: 'Rotate Images Online - Free Image Rotator | Pixminify',
    ogDescription: 'Rotate and flip your images online for free. Quickly rotate JPG, PNG and other image formats with Pixminify.',
    ogUrl: `${CANONICAL_DOMAIN}/rotate/`,
    keywords: ['rotate images online', 'free image rotator', 'flip photo horizontal', 'straighten image', 'rotate jpg'],
  },
  pdf: {
    path: '/pdf/',
    title: 'Image to PDF Converter - Convert Images to PDF Free | Pixminify',
    description: 'Convert images to PDF online for free. Create PDF files from JPG, PNG and other supported image formats.',
    h1: 'Image to PDF Converter',
    canonical: `${CANONICAL_DOMAIN}/pdf/`,
    ogTitle: 'Image to PDF Converter - Convert Images to PDF Free | Pixminify',
    ogDescription: 'Convert images to PDF online for free. Create PDF files from JPG, PNG and other supported image formats.',
    ogUrl: `${CANONICAL_DOMAIN}/pdf/`,
    keywords: ['image to pdf converter', 'jpg to pdf free', 'png to pdf', 'combine images to pdf', 'photo to document'],
  },
  watermark: {
    path: '/watermark/',
    title: 'Add Watermark to Images Online - Free Watermark Tool | Pixminify',
    description: 'Add text or image watermarks to your photos online for free with Pixminify.',
    h1: 'Add Watermark to Images',
    canonical: `${CANONICAL_DOMAIN}/watermark/`,
    ogTitle: 'Add Watermark to Images Online - Free Watermark Tool | Pixminify',
    ogDescription: 'Add text or image watermarks to your photos online for free with Pixminify.',
    ogUrl: `${CANONICAL_DOMAIN}/watermark/`,
    keywords: ['add watermark to images', 'watermark tool free', 'protect copyright photo', 'logo watermark', 'text watermark generator'],
  },
  filter: {
    path: '/filter/',
    title: 'Photo Filters Online - Apply Filters to Images Free | Pixminify',
    description: 'Apply filters and effects to your images online for free. Enhance and transform your photos with Pixminify.',
    h1: 'Photo Filters Online',
    canonical: `${CANONICAL_DOMAIN}/filter/`,
    ogTitle: 'Photo Filters Online - Apply Filters to Images Free | Pixminify',
    ogDescription: 'Apply filters and effects to your images online for free. Enhance and transform your photos with Pixminify.',
    ogUrl: `${CANONICAL_DOMAIN}/filter/`,
    keywords: ['photo filters online', 'apply filters to images', 'free photo effects', 'vintage filter', 'grayscale picture', 'color tone'],
  },
  blog: {
    path: '/blog/',
    title: 'Pixminify Blog - Guides, Tutorials & Image Optimization Tips',
    description: 'Explore practical guides, tutorials, and deep-dive technical articles on image compression, resizing, formats (WebP vs JPG vs PNG), cropping, and optimization.',
    h1: 'Pixminify Blog',
    canonical: `${CANONICAL_DOMAIN}/blog/`,
    ogTitle: 'Pixminify Blog - Guides, Tutorials & Image Optimization Tips',
    ogDescription: 'Explore practical guides, tutorials, and deep-dive technical articles on image compression, resizing, formats (WebP vs JPG vs PNG), cropping, and optimization.',
    ogUrl: `${CANONICAL_DOMAIN}/blog/`,
    keywords: ['image optimization blog', 'image compression tutorials', 'how to crop images', 'jpg vs png vs webp', 'photo editing guides'],
  },
  faq: {
    path: '/faq/',
    title: 'Frequently Asked Questions & Help Guide | Pixminify',
    description: 'Find answers to common questions about Pixminify image compression, security, zero-server-upload privacy, and supported formats.',
    h1: 'Frequently Asked Questions',
    canonical: `${CANONICAL_DOMAIN}/faq/`,
    ogTitle: 'Frequently Asked Questions & Help Guide | Pixminify',
    ogDescription: 'Find answers to common questions about Pixminify image compression, security, zero-server-upload privacy, and supported formats.',
    ogUrl: `${CANONICAL_DOMAIN}/faq/`,
    keywords: ['pixminify faq', 'how to compress images', 'image tool questions', 'browser privacy image conversion'],
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy Policy - 100% In-Browser Privacy | Pixminify',
    description: "Read Pixminify's privacy policy. All image processing runs locally on your device with zero server storage and complete privacy.",
    h1: 'Privacy Policy',
    canonical: `${CANONICAL_DOMAIN}/privacy/`,
    ogTitle: 'Privacy Policy - 100% In-Browser Privacy | Pixminify',
    ogDescription: "Read Pixminify's privacy policy. All image processing runs locally on your device with zero server storage and complete privacy.",
    ogUrl: `${CANONICAL_DOMAIN}/privacy/`,
  },
  terms: {
    path: '/terms/',
    title: 'Terms & Conditions - Free Image Tools | Pixminify',
    description: 'Pixminify terms and conditions. Free for personal and commercial use with zero subscription fees and full copyright ownership.',
    h1: 'Terms & Conditions',
    canonical: `${CANONICAL_DOMAIN}/terms/`,
    ogTitle: 'Terms & Conditions - Free Image Tools | Pixminify',
    ogDescription: 'Pixminify terms and conditions. Free for personal and commercial use with zero subscription fees and full copyright ownership.',
    ogUrl: `${CANONICAL_DOMAIN}/terms/`,
  },
  cookies: {
    path: '/cookies/',
    title: 'Cookie Policy - Local Storage & Preferences | Pixminify',
    description: 'Learn how Pixminify uses local storage for your preset preferences and standard non-intrusive ad cookies.',
    h1: 'Cookie Policy',
    canonical: `${CANONICAL_DOMAIN}/cookies/`,
    ogTitle: 'Cookie Policy - Local Storage & Preferences | Pixminify',
    ogDescription: 'Learn how Pixminify uses local storage for your preset preferences and standard non-intrusive ad cookies.',
    ogUrl: `${CANONICAL_DOMAIN}/cookies/`,
  },
  about: {
    path: '/about/',
    title: 'About Us - In-Browser Private Image Tools | Pixminify',
    description: 'Learn about Pixminify mission to provide 100% private, ultra-fast, zero-server-upload image tools for creators and developers.',
    h1: 'About Pixminify Suite',
    canonical: `${CANONICAL_DOMAIN}/about/`,
    ogTitle: 'About Us - In-Browser Private Image Tools | Pixminify',
    ogDescription: 'Learn about Pixminify mission to provide 100% private, ultra-fast, zero-server-upload image tools for creators and developers.',
    ogUrl: `${CANONICAL_DOMAIN}/about/`,
  },
  contact: {
    path: '/contact/',
    title: 'Contact Us & Support | Pixminify',
    description: 'Get in touch with the Pixminify team for feedback, feature suggestions, bug reports, and partnership inquiries.',
    h1: 'Contact Pixminify',
    canonical: `${CANONICAL_DOMAIN}/contact/`,
    ogTitle: 'Contact Us & Support | Pixminify',
    ogDescription: 'Get in touch with the Pixminify team for feedback, feature suggestions, bug reports, and partnership inquiries.',
    ogUrl: `${CANONICAL_DOMAIN}/contact/`,
  },
  pricing: {
    path: '/pricing/',
    title: '100% Free Forever Promise - Pricing | Pixminify',
    description: 'Pixminify is completely free forever. No credit cards, no monthly subscriptions, and no watermarks on your photos.',
    h1: 'Simple, Transparent Free Access',
    canonical: `${CANONICAL_DOMAIN}/pricing/`,
    ogTitle: '100% Free Forever Promise - Pricing | Pixminify',
    ogDescription: 'Pixminify is completely free forever. No credit cards, no monthly subscriptions, and no watermarks on your photos.',
    ogUrl: `${CANONICAL_DOMAIN}/pricing/`,
  },
  guide: {
    path: '/guide/',
    title: 'Image Optimization & Speed Guide | Pixminify',
    description: 'Master image compression ratios, WebP, AVIF, JPEG performance, and Core Web Vitals speed optimization.',
    h1: 'Image Optimization & Speed Guide',
    canonical: `${CANONICAL_DOMAIN}/guide/`,
    ogTitle: 'Image Optimization & Speed Guide | Pixminify',
    ogDescription: 'Master image compression ratios, WebP, AVIF, JPEG performance, and Core Web Vitals speed optimization.',
    ogUrl: `${CANONICAL_DOMAIN}/guide/`,
  },
  'coming-soon': {
    path: '/coming-soon/',
    title: 'Upcoming Image Tools & Labs Roadmap | Pixminify',
    description: 'Preview upcoming tools in active development: AI Background Remover, SVG Vectorizer, EXIF Stripper, OCR Text Extractor, and more.',
    h1: 'More Tools are Coming Soon',
    canonical: `${CANONICAL_DOMAIN}/coming-soon/`,
    ogTitle: 'Upcoming Image Tools & Labs Roadmap | Pixminify',
    ogDescription: 'Preview upcoming tools in active development: AI Background Remover, SVG Vectorizer, EXIF Stripper, OCR Text Extractor, and more.',
    ogUrl: `${CANONICAL_DOMAIN}/coming-soon/`,
  },
  'not-found': {
    path: '/404/',
    title: 'Page Not Found (404) | Pixminify',
    description: 'The requested page could not be found. Explore our free in-browser image optimization tools and blog guides.',
    h1: '404 - Page Not Found',
    canonical: `${CANONICAL_DOMAIN}/404/`,
    ogTitle: 'Page Not Found (404) | Pixminify',
    ogDescription: 'The requested page could not be found. Explore our free in-browser image optimization tools and blog guides.',
    ogUrl: `${CANONICAL_DOMAIN}/404/`,
  },
};

/**
 * Normalizes tab string to standard canonical path URL
 */
export const getPathForTab = (tab: ActiveTab, articleSlug?: string | null): string => {
  if (tab === 'blog' && articleSlug) {
    return `/blog/${articleSlug}/`;
  }
  if (tab === 'home') return '/';
  if (tab === 'not-found') return '/404/';
  return `/${tab}/`;
};

/**
 * Extracts blog slug from path if currently on a blog article route
 */
export const getBlogSlugFromPath = (rawPathOrHash: string): string | null => {
  if (!rawPathOrHash) return null;
  const path = rawPathOrHash.replace(/^[#/]+|[#/]+$/g, '').trim();
  const parts = path.split('/');
  if (parts[0] === 'blog' && parts[1]) {
    return parts[1];
  }
  return null;
};

/**
 * Parses browser pathname or hash into ActiveTab identifier
 */
export const getTabForPath = (rawPathOrHash: string): ActiveTab => {
  if (!rawPathOrHash) return 'home';
  const clean = rawPathOrHash.replace(/^[#/]+|[#/]+$/g, '').trim().toLowerCase();
  if (!clean || clean === 'home') return 'home';

  const parts = clean.split('/');
  const root = parts[0];

  if (root === 'blog') {
    return 'blog';
  }

  if (root === '404') {
    return 'not-found';
  }

  const validTabs: ActiveTab[] = [
    'home', 'compress', 'crop', 'rotate', 'convert', 'resize', 'pdf',
    'watermark', 'filter', 'guide', 'blog', 'about', 'contact', 'privacy',
    'terms', 'cookies', 'faq', 'pricing', 'coming-soon'
  ];

  return validTabs.includes(root as ActiveTab) ? (root as ActiveTab) : 'not-found';
};

/**
 * Dynamically updates document title, canonical link, meta tags, and structured JSON-LD
 */
export const updatePageSeo = (tab: ActiveTab, activeArticle?: BlogArticle | null): void => {
  // Helper for setting or updating meta tag
  const setMeta = (attrName: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper for canonical link tag
  const setCanonical = (href: string) => {
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', href);
  };

  // Handle individual blog article SEO
  if (tab === 'blog' && activeArticle) {
    const articleCanonical = `${CANONICAL_DOMAIN}/blog/${activeArticle.slug}/`;

    document.title = activeArticle.seoTitle;
    setMeta('name', 'description', activeArticle.metaDescription);
    setCanonical(articleCanonical);

    setMeta('property', 'og:title', activeArticle.seoTitle);
    setMeta('property', 'og:description', activeArticle.metaDescription);
    setMeta('property', 'og:url', articleCanonical);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:site_name', 'Pixminify');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', activeArticle.seoTitle);
    setMeta('name', 'twitter:description', activeArticle.metaDescription);

    // Article + FAQ Schema
    let schemaScript = document.getElementById('pixminify-schema') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'pixminify-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemas: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': articleCanonical,
        },
        headline: activeArticle.title,
        description: activeArticle.metaDescription,
        author: {
          '@type': 'Organization',
          name: activeArticle.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Pixminify',
          url: CANONICAL_DOMAIN,
          logo: {
            '@type': 'ImageObject',
            url: `${CANONICAL_DOMAIN}/logo.png`,
          },
        },
        datePublished: '2026-08-24',
        dateModified: '2026-08-24',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${CANONICAL_DOMAIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${CANONICAL_DOMAIN}/blog/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: activeArticle.title,
            item: articleCanonical,
          },
        ],
      },
    ];

    // Add FAQ schema if FAQs exist
    if (activeArticle.faqs && activeArticle.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: activeArticle.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      });
    }

    schemaScript.textContent = JSON.stringify(schemas);
    return;
  }

  // Standard Page SEO
  const seo = SEO_DATA[tab] || SEO_DATA.home;

  document.title = seo.title;
  setMeta('name', 'description', seo.description);
  setCanonical(seo.canonical);

  setMeta('property', 'og:title', seo.ogTitle);
  setMeta('property', 'og:description', seo.ogDescription);
  setMeta('property', 'og:url', seo.ogUrl);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', 'Pixminify');

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', seo.ogTitle);
  setMeta('name', 'twitter:description', seo.ogDescription);

  // Structured JSON-LD for WebApplication
  let schemaScript = document.getElementById('pixminify-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'pixminify-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Pixminify',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any (Browser-based)',
    url: seo.canonical,
    description: seo.description,
    browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas support.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Zero server upload client-side processing',
      'Lossless and lossy WebP, AVIF, JPEG, PNG compression',
      'Interactive crop and social aspect ratio fitting',
      'Batch format conversion',
      'Multi-image to PDF builder',
      'Text and logo watermarking',
      'Real-time filter and color adjustments',
      'Comprehensive educational guides and tutorials',
    ],
  };

  schemaScript.textContent = JSON.stringify(schemaData);
};
