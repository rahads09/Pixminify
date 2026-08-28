import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Minimize2,
  Crop as CropIcon,
  RotateCw,
  FileText,
  Stamp,
  Sliders,
  Maximize2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { ActiveTab, BlogArticle } from '../types';
import { getPathForTab } from '../utils/seo';
import { getArticleBySlug } from '../data/blogArticles';

interface ToolSeoData {
  toolName: string;
  introTitle: string;
  introText: string;
  steps: { title: string; desc: string }[];
  features: string[];
  supportedFormats: { name: string; desc: string }[];
  useCases: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  guideSlugs: string[];
  relatedTools: { tab: ActiveTab; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[];
}

const TOOL_SEO_CONTENT: Partial<Record<ActiveTab, ToolSeoData>> = {
  compress: {
    toolName: 'Image Compressor',
    introTitle: 'Fast, In-Browser Image Compression Without Quality Loss',
    introText:
      'Pixminify Image Compressor leverages modern HTML5 Canvas, WebAssembly algorithms, and native browser codecs to shrink image files by up to 93%. Because all calculations execute directly on your device, your photos never upload to remote cloud servers—guaranteeing 100% data privacy and instant processing speeds.',
    steps: [
      {
        title: '1. Select or Drop Your Images',
        desc: 'Drag and drop one or dozens of JPG, PNG, WebP, or AVIF files into the upload area.',
      },
      {
        title: '2. Adjust Quality & Compression Mode',
        desc: 'Pick a smart preset (Maximum Savings, Balanced, or Ultra-Sharp) or customize slider values.',
      },
      {
        title: '3. Compare & Download',
        desc: 'Inspect results with side-by-side split comparison and download single files or a ZIP archive.',
      },
    ],
    features: [
      'Smart lossy and lossless algorithms preserving crucial visual details',
      'Batch compression supporting multiple files at once',
      'Interactive side-by-side split screen visual quality inspector',
      'Automatic metadata cleaning to reduce unnecessary byte weight',
      '100% private client-side processing without uploading to external servers',
      'Instant ZIP download for bulk workflows',
    ],
    supportedFormats: [
      { name: 'JPEG / JPG', desc: 'Standard photographic format with customizable quantization matrices' },
      { name: 'PNG', desc: 'Lossless graphics and transparent artwork with palette quantization' },
      { name: 'WebP', desc: 'Modern Google web format offering 30-50% smaller size than JPEG' },
      { name: 'AVIF', desc: 'Next-generation AV1 codec format for extreme compression efficiency' },
    ],
    useCases: [
      {
        title: 'Website & Core Web Vitals Optimization',
        desc: 'Accelerate page load speeds, reduce bounce rates, and score 90+ on Google PageSpeed Insights.',
      },
      {
        title: 'Email & Messaging Attachments',
        desc: 'Fit high-resolution camera photos under strict email attachment limits (e.g. 25 MB).',
      },
      {
        title: 'eCommerce Stores (Shopify, WooCommerce)',
        desc: 'Shrink catalog product photos to keep online storefronts snappy and conversion-friendly.',
      },
      {
        title: 'Job & University Application Portals',
        desc: 'Resize and compress ID cards, passports, and scanned certificates to meet exact KB requirements.',
      },
    ],
    faqs: [
      {
        q: 'Does compressing images lower visual sharpness?',
        a: 'Pixminify uses intelligent perceptual compression that removes invisible high-frequency noise while preserving crisp edges, color depth, and fine details. Most users cannot distinguish compressed results from originals.',
      },
      {
        q: 'Are my private photos uploaded to your server?',
        a: 'Never. All compression runs entirely inside your web browser via client-side JavaScript. Your files never leave your computer or phone.',
      },
      {
        q: 'What is the ideal compression level for websites?',
        a: 'A quality setting of 75% to 80% with WebP or JPEG output typically achieves 70-85% file size reduction with zero noticeable visual degradation.',
      },
    ],
    guideSlugs: [
      'how-to-compress-images-without-losing-quality',
      'lossy-vs-lossless-image-compression',
      'how-to-reduce-image-file-size-for-websites',
    ],
    relatedTools: [
      { tab: 'resize', label: 'Image Resizer', desc: 'Scale image pixel dimensions for social media or web banners', icon: Maximize2 },
      { tab: 'convert', label: 'Image Converter', desc: 'Convert between WebP, JPG, PNG, and AVIF formats', icon: RefreshCw },
      { tab: 'crop', label: 'Image Cropper', desc: 'Crop custom aspect ratios, squares, and profile circles', icon: CropIcon },
      { tab: 'watermark', label: 'Add Watermark', desc: 'Protect original photos with text or logo branding', icon: Stamp },
    ],
  },
  crop: {
    toolName: 'Image Cropper',
    introTitle: 'Precision Online Photo Cropper with Exact Aspect Ratios',
    introText:
      'Easily crop any picture online to perfect proportions. Pixminify Image Cropper provides intuitive draggable bounding boxes, instant preset ratios (1:1 Square, 16:9 Landscape, 4:3 Classic, 9:16 Story, Circle Avatar), and custom aspect ratio controls without uploading your files.',
    steps: [
      {
        title: '1. Upload Photo',
        desc: 'Load any high-resolution photo from your desktop, tablet, or smartphone.',
      },
      {
        title: '2. Select Aspect Ratio & Position',
        desc: 'Drag the handles or select a preset ratio (1:1, 16:9, 4:3, 9:16, or Freeform).',
      },
      {
        title: '3. Export Cropped Image',
        desc: 'Choose your desired output format (JPG, PNG, WebP) and save instantly.',
      },
    ],
    features: [
      'Interactive real-time draggable crop box with responsive boundary guides',
      'One-click social media aspect ratios (Instagram 1:1, YouTube 16:9, TikTok 9:16)',
      'Circular crop mask preview for profile pictures and avatars',
      'Exact pixel dimensions readout showing cropped width and height',
      '100% private in-browser canvas rendering',
    ],
    supportedFormats: [
      { name: 'JPEG / JPG', desc: 'Ideal for cropped photographs and travel snapshots' },
      { name: 'PNG', desc: 'Preserves sharp alpha transparency for cutouts and logos' },
      { name: 'WebP', desc: 'Super-efficient web publishing with minimal file footprint' },
    ],
    useCases: [
      {
        title: 'Social Media Profile Pictures & Banners',
        desc: 'Crop flawless square avatars, LinkedIn banners, and Instagram stories in seconds.',
      },
      {
        title: 'Removing Unwanted Background Elements',
        desc: 'Eliminate photobombers, distractions, or messy edges from your pictures.',
      },
      {
        title: 'Standardizing eCommerce Product Photos',
        desc: 'Ensure all catalog items have identical 1:1 square framing for consistent grids.',
      },
    ],
    faqs: [
      {
        q: 'Can I crop an image into a circle?',
        a: 'Yes, select the Circle preset ratio to preview and export circular profile avatars with clean alpha transparency.',
      },
      {
        q: 'Does cropping reduce the photo resolution?',
        a: 'Cropping extracts the selected pixel region at full native sensor clarity without unnecessary downscaling.',
      },
    ],
    guideSlugs: [
      'how-to-crop-images-online',
      'how-to-resize-images-without-losing-quality',
      'how-to-rotate-and-flip-images',
    ],
    relatedTools: [
      { tab: 'resize', label: 'Image Resizer', desc: 'Adjust exact width and height pixel dimensions', icon: Maximize2 },
      { tab: 'compress', label: 'Image Compressor', desc: 'Reduce file size after cropping', icon: Minimize2 },
      { tab: 'rotate', label: 'Rotate & Flip', desc: 'Correct tilted photos or mirror images horizontally', icon: RotateCw },
      { tab: 'filter', label: 'Photo Filters', desc: 'Enhance lighting, contrast, and color tones', icon: Sliders },
    ],
  },
  resize: {
    toolName: 'Image Resizer',
    introTitle: 'Resize Images for Web, Social Media, and Print',
    introText:
      'Quickly change image dimensions by percentage, exact pixel width/height, or one-click social media presets. Pixminify Image Resizer uses high-fidelity bicubic interpolation to scale pictures up or down smoothly without pixelation.',
    steps: [
      {
        title: '1. Select Picture',
        desc: 'Pick your source image to view its current native width and height.',
      },
      {
        title: '2. Choose New Dimensions or Preset',
        desc: 'Pick a social media standard (Instagram, YouTube, Twitter/X) or type exact custom pixels.',
      },
      {
        title: '3. Download Resized Image',
        desc: 'Save your perfectly scaled image in JPG, PNG, or WebP format.',
      },
    ],
    features: [
      'Comprehensive social media dimension presets (Instagram, Facebook, YouTube, LinkedIn)',
      'Aspect ratio lock to prevent distortion or accidental stretching',
      'Smart bicubic anti-aliasing interpolation for smooth scaling',
      'Direct file size and dimension preview',
      'No server uploads or account registration needed',
    ],
    supportedFormats: [
      { name: 'JPEG', desc: 'Best for web banners and photo sharing' },
      { name: 'PNG', desc: 'Ideal for logos, UI screenshots, and diagrams' },
      { name: 'WebP', desc: 'Optimized for high-performance websites and blog thumbnails' },
    ],
    useCases: [
      {
        title: 'Social Media Marketing',
        desc: 'Format posts, stories, reels covers, and channel banners for all major platforms.',
      },
      {
        title: 'Responsive Web Design',
        desc: 'Generate multiple resolution variants (thumbnail, mobile, desktop hero) from one original.',
      },
      {
        title: 'Meeting Strict Upload Guidelines',
        desc: 'Easily satisfy government or university portals requiring specific pixel limits.',
      },
    ],
    faqs: [
      {
        q: 'Will resizing distort my photo?',
        a: 'With aspect ratio lock enabled, width and height scale proportionally, keeping your image completely natural.',
      },
      {
        q: 'Can I enlarge a small photo?',
        a: 'Yes, our smooth bicubic interpolation allows scaling up, though the source resolution determines the maximum clarity.',
      },
    ],
    guideSlugs: [
      'how-to-resize-images-without-losing-quality',
      'what-image-size-should-you-use-for-a-website',
      'how-to-optimize-images-for-faster-website-loading',
    ],
    relatedTools: [
      { tab: 'compress', label: 'Image Compressor', desc: 'Optimize byte size after resizing', icon: Minimize2 },
      { tab: 'crop', label: 'Image Cropper', desc: 'Cut away excess background framing', icon: CropIcon },
      { tab: 'convert', label: 'Image Converter', desc: 'Switch file formats effortlessly', icon: RefreshCw },
      { tab: 'watermark', label: 'Add Watermark', desc: 'Add copyright protection or brand logos', icon: Stamp },
    ],
  },
  rotate: {
    toolName: 'Rotate & Flip Tool',
    introTitle: 'Free Online Image Rotator & Horizontal/Vertical Flipper',
    introText:
      'Fix sideways phone snapshots, upside-down scans, and mirrored photos in seconds. Pixminify Image Rotator allows 90° clockwise, 90° counter-clockwise, 180° inversion, horizontal mirror flipping, and vertical reflection with zero loss of quality.',
    steps: [
      {
        title: '1. Add Your Image',
        desc: 'Select or drag your photo into the rotation canvas.',
      },
      {
        title: '2. Rotate or Flip',
        desc: 'Click 90° Rotate Left/Right, or Flip Horizontal / Vertical to achieve correct orientation.',
      },
      {
        title: '3. Save Straightened Image',
        desc: 'Download your corrected image ready for printing or sharing.',
      },
    ],
    features: [
      'Instant 90° Clockwise, 90° Counter-Clockwise, and 180° rotation',
      'Horizontal mirror flip and vertical flip controls',
      'Real-time instant visual canvas feedback',
      'Retains original image resolution and color accuracy',
      'Completely private local processing',
    ],
    supportedFormats: [
      { name: 'JPEG / JPG', desc: 'Correct orientation of smartphone and DSLR camera shots' },
      { name: 'PNG', desc: 'Rotate transparent illustrations and digital artwork' },
      { name: 'WebP', desc: 'Rotate web graphics while maintaining modern compression' },
    ],
    useCases: [
      {
        title: 'Correcting Smartphone EXIF Orientation',
        desc: 'Fix camera photos that appear sideways when opened on desktops or websites.',
      },
      {
        title: 'Straightening Scanned Documents',
        desc: 'Quickly reorient upside-down invoices, ID scans, or book pages.',
      },
      {
        title: 'Creating Mirror Effects for Creative Art',
        desc: 'Flip graphics horizontally for symmetrical compositions and design layouts.',
      },
    ],
    faqs: [
      {
        q: 'Why do my phone photos sometimes appear sideways?',
        a: 'Some cameras save orientation tags in EXIF metadata rather than physically rotating pixels. Pixminify permanently fixes the pixel grid so your photo looks correct everywhere.',
      },
      {
        q: 'Does rotating reduce image quality?',
        a: 'No, standard 90° and 180° rotations re-map pixel coordinates directly without degradation.',
      },
    ],
    guideSlugs: [
      'how-to-rotate-and-flip-images',
      'how-to-crop-images-online',
      'how-to-use-image-filters',
    ],
    relatedTools: [
      { tab: 'crop', label: 'Image Cropper', desc: 'Crop out unnecessary borders after rotating', icon: CropIcon },
      { tab: 'compress', label: 'Image Compressor', desc: 'Shrink file size for easy emailing', icon: Minimize2 },
      { tab: 'filter', label: 'Photo Filters', desc: 'Fine-tune brightness and contrast', icon: Sliders },
      { tab: 'pdf', label: 'Image to PDF', desc: 'Combine rotated document scans into a PDF', icon: FileText },
    ],
  },
  convert: {
    toolName: 'Image Format Converter',
    introTitle: 'Convert JPG, PNG, WebP, AVIF & More Online',
    introText:
      'Seamlessly convert images between all major digital formats. Whether you need to convert heavy PNG screenshots into ultra-light WebP, export transparent PNGs, or generate standard high-compatibility JPEGs, Pixminify delivers instant client-side format conversion.',
    steps: [
      {
        title: '1. Select Source Files',
        desc: 'Upload any image file in PNG, JPG, WebP, AVIF, BMP, or SVG format.',
      },
      {
        title: '2. Choose Target Format',
        desc: 'Select your preferred output format: WebP, AVIF, PNG, or JPEG.',
      },
      {
        title: '3. Convert & Save',
        desc: 'Process immediately and download your newly formatted image.',
      },
    ],
    features: [
      'Multi-format support: JPG, PNG, WebP, AVIF',
      'Batch conversion to streamline large photo libraries',
      'Alpha transparency preservation for PNG and WebP outputs',
      'Custom quality sliders to balance output size vs clarity',
      'Zero server upload delay and complete privacy',
    ],
    supportedFormats: [
      { name: 'WebP', desc: 'Best overall choice for modern websites with superior compression' },
      { name: 'AVIF', desc: 'Next-gen format providing maximum bandwidth savings' },
      { name: 'PNG', desc: 'Best for graphics requiring crisp lossless transparency' },
      { name: 'JPEG', desc: 'Universal compatibility across all legacy operating systems and printers' },
    ],
    useCases: [
      {
        title: 'Converting PNG Screenshots to WebP/JPEG',
        desc: 'Slash 5MB screenshot sizes down to 200KB for easy sharing and publishing.',
      },
      {
        title: 'Preparing Media for Web Deployment',
        desc: 'Modernize legacy JPG assets into WebP and AVIF to speed up site performance.',
      },
      {
        title: 'Ensuring Device Compatibility',
        desc: 'Convert specialized formats into standard JPEGs for older hardware and printing kiosks.',
      },
    ],
    faqs: [
      {
        q: 'Which format should I choose for my website?',
        a: 'WebP is currently the recommended standard: it is supported by 97%+ of all browsers and produces files 30% smaller than JPG with equal visual fidelity.',
      },
      {
        q: 'Can I convert multiple images at once?',
        a: 'Yes, batch conversion is fully supported in your browser.',
      },
    ],
    guideSlugs: [
      'jpg-vs-png-vs-webp',
      'how-to-choose-the-right-image-format',
      'jpg-png-or-webp-for-websites',
    ],
    relatedTools: [
      { tab: 'compress', label: 'Image Compressor', desc: 'Fine-tune compression levels for any format', icon: Minimize2 },
      { tab: 'pdf', label: 'Image to PDF', desc: 'Bundle multiple converted photos into a single PDF document', icon: FileText },
      { tab: 'resize', label: 'Image Resizer', desc: 'Change dimensions while converting', icon: Maximize2 },
      { tab: 'guide', label: 'Speed & Format Guide', desc: 'Deep dive into WebP vs AVIF vs JPEG benchmarks', icon: BookOpen },
    ],
  },
  pdf: {
    toolName: 'Image to PDF Converter',
    introTitle: 'Convert Photos & Scanned Documents to PDF Free',
    introText:
      'Combine one or multiple pictures into clean, multi-page PDF documents. Pixminify Image to PDF Converter lets you arrange page order, select page orientation (Portrait / Landscape), adjust margins, and export lightweight, searchable PDF files entirely within your browser.',
    steps: [
      {
        title: '1. Select Your Images',
        desc: 'Upload photos, scanned receipts, certificates, or book pages.',
      },
      {
        title: '2. Arrange Order & Page Settings',
        desc: 'Reorder pages, set page orientation, and customize margin spacing.',
      },
      {
        title: '3. Generate & Download PDF',
        desc: 'Click convert to create and download your consolidated PDF file.',
      },
    ],
    features: [
      'Multi-image batch consolidation into a single clean PDF',
      'Drag-and-drop page reordering and individual page deletion',
      'Custom page orientations: Auto-Fit, Portrait, or Landscape',
      'Configurable page margins and compression levels',
      'Zero server upload—perfect for confidential bank statements and IDs',
    ],
    supportedFormats: [
      { name: 'JPG / JPEG', desc: 'Common for photo documents and invoice receipts' },
      { name: 'PNG', desc: 'Clear text rendering for screenshots and diagram scans' },
      { name: 'WebP', desc: 'Lightweight web images converted directly into PDF pages' },
    ],
    useCases: [
      {
        title: 'Government & Job Applications',
        desc: 'Combine scanned ID card front/back, passport, and CV into a single PDF submission.',
      },
      {
        title: 'Expense Reports & Invoicing',
        desc: 'Merge photo receipts and payment slips into a neat accounting document.',
      },
      {
        title: 'Academic Homework & Portfolios',
        desc: 'Assemble handwritten assignment photos into a unified document for teachers.',
      },
    ],
    faqs: [
      {
        q: 'Is there a limit on how many images I can merge into a PDF?',
        a: 'No artificial limit is imposed. You can merge dozens of pages directly in your browser.',
      },
      {
        q: 'Are my sensitive documents safe from data leaks?',
        a: 'Yes, 100%. Processing takes place strictly in your local device RAM and never touches any server.',
      },
    ],
    guideSlugs: [
      'how-to-convert-images-to-pdf',
      'how-to-add-watermark-to-images',
      'how-to-choose-the-right-image-format',
    ],
    relatedTools: [
      { tab: 'compress', label: 'Image Compressor', desc: 'Shrink photo sizes before generating PDFs', icon: Minimize2 },
      { tab: 'crop', label: 'Image Cropper', desc: 'Trim document scan borders and margins', icon: CropIcon },
      { tab: 'rotate', label: 'Rotate & Flip', desc: 'Correct orientation of upside-down scans', icon: RotateCw },
      { tab: 'watermark', label: 'Add Watermark', desc: 'Stamp CONFIDENTIAL or official stamps on pages', icon: Stamp },
    ],
  },
  watermark: {
    toolName: 'Watermark Tool',
    introTitle: 'Add Text & Logo Watermarks to Protect Your Photos',
    introText:
      'Safeguard your creative photography, real estate listings, and business imagery against unauthorized reposting. Pixminify Watermark Tool allows you to apply customizable text watermarks or brand logos with live opacity, scaling, tiling, and corner positioning controls.',
    steps: [
      {
        title: '1. Upload Base Photo',
        desc: 'Select the photograph or graphic you wish to protect.',
      },
      {
        title: '2. Customize Text or Logo Watermark',
        desc: 'Type copyright text, adjust font size/color/opacity, or upload your transparent PNG logo.',
      },
      {
        title: '3. Position & Export',
        desc: 'Place watermark in corners, center, or repeat across as a security grid.',
      },
    ],
    features: [
      'Dual modes: Custom Typography Text Watermark or PNG Brand Logo overlay',
      'Adjustable opacity, rotation angle, font color, and drop shadow',
      'Preset corner snapping (Top-Left, Top-Right, Center, Bottom-Right, etc.)',
      'Repeated diagonal tiling pattern for high-security proofing',
      'Client-side real-time rendering with instant download',
    ],
    supportedFormats: [
      { name: 'JPEG', desc: 'Protect commercial photography and event albums' },
      { name: 'PNG', desc: 'Watermark digital artwork while maintaining transparency' },
      { name: 'WebP', desc: 'Add subtle copyright signatures before web publishing' },
    ],
    useCases: [
      {
        title: 'Photographers & Creators',
        desc: 'Brand client preview proofs to prevent unauthorized screenshot sharing.',
      },
      {
        title: 'Real Estate & Vehicle Listings',
        desc: 'Prevent competitors from scraping listing photos with agency logo stamps.',
      },
      {
        title: 'eCommerce Product Catalogs',
        desc: 'Brand exclusive product photographs across online marketplaces.',
      },
    ],
    faqs: [
      {
        q: 'Can I use my transparent company logo?',
        a: 'Yes, simply upload a transparent PNG logo and adjust its size, opacity, and positioning.',
      },
      {
        q: 'Does adding a watermark lower the quality of my original photo?',
        a: 'No, the watermark is rendered directly on top of your full-resolution source canvas.',
      },
    ],
    guideSlugs: [
      'how-to-add-watermark-to-images',
      'how-to-use-image-filters',
      'how-to-compress-images-without-losing-quality',
    ],
    relatedTools: [
      { tab: 'compress', label: 'Image Compressor', desc: 'Compress watermarked images for fast online loading', icon: Minimize2 },
      { tab: 'crop', label: 'Image Cropper', desc: 'Frame photos before applying your logo', icon: CropIcon },
      { tab: 'pdf', label: 'Image to PDF', desc: 'Watermark documents before compiling into PDF', icon: FileText },
      { tab: 'resize', label: 'Image Resizer', desc: 'Resize watermarked photos for social channels', icon: Maximize2 },
    ],
  },
  filter: {
    toolName: 'Photo Filters & Color Studio',
    introTitle: 'Apply Aesthetic Filters, Color Tones & Contrast Adjustments',
    introText:
      'Enhance your photographs with one-click aesthetic filters and granular color grading sliders. Adjust brightness, contrast, saturation, vibrancy, sepia warmth, grayscale toning, and blur without heavy desktop photo editing software.',
    steps: [
      {
        title: '1. Choose Photo',
        desc: 'Upload the photo you want to color grade or enhance.',
      },
      {
        title: '2. Select Filter or Fine-Tune Sliders',
        desc: 'Click preset filters (Vivid, Warm Vintage, Cinematic, B&W) or tweak individual controls.',
      },
      {
        title: '3. Preview & Download',
        desc: 'Compare before/after and download your professionally enhanced image.',
      },
    ],
    features: [
      'Popular curated aesthetic presets (Vibrant, Vintage Warmth, Moody Monochrome, Cyberpunk, Soft Glow)',
      'Fine-grained sliders for Brightness, Contrast, Saturation, Sepia, Grayscale, and Invert',
      'Hardware-accelerated real-time canvas preview',
      'One-click reset to original photo state',
      'Private in-browser processing with zero latency',
    ],
    supportedFormats: [
      { name: 'JPEG', desc: 'Ideal for portraits, landscapes, and vacation snapshots' },
      { name: 'PNG', desc: 'Enhance graphic art and digital illustrations' },
      { name: 'WebP', desc: 'Modern web format for vibrant portfolio images' },
    ],
    useCases: [
      {
        title: 'Social Media & Influencer Content',
        desc: 'Apply consistent color palettes across Instagram feeds and story posts.',
      },
      {
        title: 'Fixing Under-Exposed or Dull Photos',
        desc: 'Boost brightness and color vibrancy in dark indoor or cloudy day shots.',
      },
      {
        title: 'Classic Black & White Photography',
        desc: 'Convert color pictures into dramatic high-contrast monochrome art.',
      },
    ],
    faqs: [
      {
        q: 'Can I undo my adjustments at any time?',
        a: 'Yes, clicking "Reset to Default" instantly restores the untouched original photo.',
      },
      {
        q: 'Does applying filters take a long time to process?',
        a: 'All filters render instantaneously using GPU-accelerated HTML5 Canvas operations.',
      },
    ],
    guideSlugs: [
      'how-to-use-image-filters',
      'how-to-rotate-and-flip-images',
      'how-to-crop-images-online',
    ],
    relatedTools: [
      { tab: 'crop', label: 'Image Cropper', desc: 'Crop your filtered photo to perfect dimensions', icon: CropIcon },
      { tab: 'rotate', label: 'Rotate & Flip', desc: 'Straighten perspective before applying filters', icon: RotateCw },
      { tab: 'watermark', label: 'Add Watermark', desc: 'Brand your finished artistic photos', icon: Stamp },
      { tab: 'compress', label: 'Image Compressor', desc: 'Optimize your enhanced photo for sharing', icon: Minimize2 },
    ],
  },
};

interface ToolSeoSectionProps {
  tab: ActiveTab;
  onSelectTab: (tab: ActiveTab, slug?: string | null) => void;
}

export const ToolSeoSection: React.FC<ToolSeoSectionProps> = ({ tab, onSelectTab }) => {
  const data = TOOL_SEO_CONTENT[tab];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!data) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetTab: ActiveTab) => {
    e.preventDefault();
    onSelectTab(targetTab);
  };

  const handleGuideClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    onSelectTab('blog', slug);
  };

  const relatedArticles = data.guideSlugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is BlogArticle => Boolean(a));

  return (
    <div className="mt-16 pt-12 border-t border-slate-200 text-slate-800 space-y-12 max-w-5xl mx-auto">
      {/* Intro section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About {data.toolName}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {data.introTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
          {data.introText}
        </p>
      </div>

      {/* How it Works 3 Steps */}
      <div className="space-y-6">
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-xl font-bold text-slate-900">How It Works</h3>
          <p className="text-xs sm:text-sm text-slate-500">Three effortless steps to complete your task in seconds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {idx + 1}
              </div>
              <h4 className="text-sm font-bold text-slate-900 pt-1">{step.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features & Supported Formats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Key Features */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">Key Features & Highlights</h3>
          </div>
          <ul className="space-y-3">
            {data.features.map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supported Formats */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900">Supported Formats & Specs</h3>
          </div>
          <div className="space-y-3">
            {data.supportedFormats.map((fmt, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-150">
                <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 mr-2 shadow-2xs">
                  {fmt.name}
                </span>
                <span className="text-xs text-slate-600">{fmt.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Common Use Cases */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Popular Use Cases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.useCases.map((uc, idx) => (
            <div key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-1">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>{uc.title}</span>
              </h4>
              <p className="text-xs text-slate-600 pl-3.5 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tool-specific FAQ Accordion */}
      {data.faqs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {data.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Helpful Guides & Tutorials Section (PART 8 Internal Linking) */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-bold text-slate-900">Helpful Guides & Tutorials</h3>
            </div>
            <a
              href="/blog/"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('blog');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View All Guides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((article) => (
              <a
                key={article.slug}
                href={`/blog/${article.slug}/`}
                onClick={(e) => handleGuideClick(e, article.slug)}
                className="group bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{article.readingTime}</span>
                  <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Internal Linking: Related Tools */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white space-y-6">
        <div className="space-y-1">
          <div className="text-blue-300 text-xs font-bold uppercase tracking-wider">Explore More Free Tools</div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">Need to do more with your photos?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Combine workflows seamlessly with our full suite of free, in-browser image tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.relatedTools.map((rt) => {
            const Icon = rt.icon;
            const targetUrl = getPathForTab(rt.tab);
            return (
              <a
                key={rt.tab}
                href={targetUrl}
                onClick={(e) => handleLinkClick(e, rt.tab)}
                className="group bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 p-4 rounded-2xl transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">
                    {rt.label}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {rt.desc}
                  </p>
                </div>
                <div className="text-xs font-bold text-blue-300 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};
