import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { DropZone } from './components/DropZone';
import { GlobalSettingsBar } from './components/GlobalSettingsBar';
import { ImageList } from './components/ImageList';
import { SplitCompareModal } from './components/SplitCompareModal';
import { CropTool } from './components/CropTool';
import { RotateTool } from './components/RotateTool';
import { ImageToPdfTool } from './components/ImageToPdfTool';
import { WatermarkTool } from './components/WatermarkTool';
import { FiltersTool } from './components/FiltersTool';
import { SocialResizerTool } from './components/SocialResizerTool';
import { FormatConverterTool } from './components/FormatConverterTool';
import { BackgroundRemoverTool } from './components/BackgroundRemoverTool';
import { AiUpscalerTool } from './components/AiUpscalerTool';
import { OcrTool } from './components/OcrTool';
import { FormatGuide } from './components/FormatGuide';
import { Footer } from './components/Footer';
import { InfoModal, ModalType } from './components/InfoModal';
import { AdBanner } from './components/AdBanner';
import { ToolSeoSection } from './components/ToolSeoSection';
import { ToolUploadPage } from './components/ToolUploadPage';
import { BlogHomePage } from './components/blog/BlogHomePage';
import { BlogArticlePage } from './components/blog/BlogArticlePage';
import { ComingSoonPage } from './components/pages/ComingSoonPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { TermsPage } from './components/pages/TermsPage';
import { CookiesPage } from './components/pages/CookiesPage';
import { FaqPage } from './components/pages/FaqPage';
import { PricingPage } from './components/pages/PricingPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { ResultPage } from './components/ResultPage';
import {
  ActiveTab,
  CompressionSettings,
  ProcessedImage,
  ToolResultData,
} from './types';
import { DEFAULT_SETTINGS } from './utils/presets';
import {
  loadImageElement,
  processSingleImage,
} from './utils/imageProcessor';
import {
  getTabForPath,
  getPathForTab,
  getBlogSlugFromPath,
  updatePageSeo,
  SEO_DATA,
} from './utils/seo';
import { getArticleBySlug } from './data/blogArticles';
import { trackPageView } from './utils/analytics';

export default function App() {
  // Start with path or hash routing
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return getTabForPath(window.location.pathname || window.location.hash);
  });
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(() => {
    return getBlogSlugFromPath(window.location.pathname || window.location.hash);
  });
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compareItem, setCompareItem] = useState<ProcessedImage | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toolHasImage, setToolHasImage] = useState<boolean>(false);
  const [activeResult, setActiveResult] = useState<ToolResultData | null>(null);

  const handleShowResult = useCallback((resultData: ToolResultData) => {
    setActiveResult(resultData);
    handleNavigate('result');
  }, []);

  // Sync state with URL path/hash & browser back/forward buttons
  useEffect(() => {
    const raw = window.location.pathname || window.location.hash;
    const initialSlug = getBlogSlugFromPath(raw);
    const initialArticle = initialSlug ? getArticleBySlug(initialSlug) : null;
    updatePageSeo(activeTab, initialArticle);

    const handlePopState = () => {
      const currentRaw = window.location.pathname || window.location.hash;
      const tab = getTabForPath(currentRaw);
      const slug = getBlogSlugFromPath(currentRaw);
      setActiveTab(tab);
      setActiveBlogSlug(slug);
      setToolHasImage(false);
      const currentArticle = slug ? getArticleBySlug(slug) : null;
      updatePageSeo(tab, currentArticle);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Update SEO and document head + track pageview on every activeTab or activeBlogSlug change
  useEffect(() => {
    const article = activeBlogSlug ? getArticleBySlug(activeBlogSlug) : null;
    updatePageSeo(activeTab, article);
    const path = getPathForTab(activeTab, activeBlogSlug);
    const title = article ? article.seoTitle : (SEO_DATA[activeTab]?.title || document.title);
    trackPageView(path, title);
  }, [activeTab, activeBlogSlug]);

  const handleNavigate = (tab: ActiveTab, slug: string | null = null) => {
    if (tab !== activeTab) {
      setToolHasImage(false);
    }
    setActiveTab(tab);
    setActiveBlogSlug(slug);
    const newPath = getPathForTab(tab, slug);
    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab, slug }, '', newPath);
    }
    const article = slug ? getArticleBySlug(slug) : null;
    updatePageSeo(tab, article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateArticle = (slug: string) => {
    handleNavigate('blog', slug);
  };

  // Process a list of items sequentially or concurrently
  const runCompressionQueue = useCallback(
    async (itemsToProcess: ProcessedImage[], customConfig?: CompressionSettings) => {
      setIsProcessing(true);
      const activeSettings = customConfig || settings;

      for (const item of itemsToProcess) {
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'processing' } : it))
        );

        const result = await processSingleImage(item, activeSettings);

        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? result : it))
        );
      }

      setIsProcessing(false);
    },
    [settings]
  );

  // Ingest new uploaded files
  const handleFilesAdded = useCallback(
    async (files: File[]) => {
      const newItems: ProcessedImage[] = [];

      for (const file of files) {
        const id = Math.random().toString(36).substring(2, 9) + Date.now();
        const previewUrl = URL.createObjectURL(file);

        let width = 0;
        let height = 0;
        try {
          const img = await loadImageElement(file);
          width = img.naturalWidth || img.width;
          height = img.naturalHeight || img.height;
        } catch (e) {
          console.warn('Could not read image dimensions:', e);
        }

        newItems.push({
          id,
          file,
          name: file.name,
          originalSize: file.size,
          originalWidth: width,
          originalHeight: height,
          originalType: file.type || 'image/jpeg',
          originalPreviewUrl: previewUrl,
          status: 'idle',
        });
      }

      setItems((prev) => [...prev, ...newItems]);
      runCompressionQueue(newItems);
    },
    [runCompressionQueue]
  );

  // Load a remote sample image for instant testing
  const handleLoadSample = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], name, { type: blob.type || 'image/jpeg' });
      handleFilesAdded([file]);
      handleNavigate('compress');
    } catch (err) {
      console.error('Failed to load sample image:', err);
    }
  };

  // Re-compress all images with updated global settings
  const handleApplyToAll = () => {
    if (items.length === 0) return;
    runCompressionQueue(items, settings);
  };

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((it) => it.id === id);
      if (itemToRemove?.originalPreviewUrl) URL.revokeObjectURL(itemToRemove.originalPreviewUrl);
      if (itemToRemove?.compressedPreviewUrl) URL.revokeObjectURL(itemToRemove.compressedPreviewUrl);
      return prev.filter((it) => it.id !== id);
    });
  };

  // Clear all items
  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
      if (item.compressedPreviewUrl) URL.revokeObjectURL(item.compressedPreviewUrl);
    });
    setItems([]);
  };

  const isToolTab = [
    'compress',
    'crop',
    'rotate',
    'resize',
    'convert',
    'watermark',
    'filter',
    'background-remover',
    'bg-remover',
    'upscaler',
    'ocr',
    'pdf',
  ].includes(activeTab);

  const currentToolHasImage = activeTab === 'compress' ? items.length > 0 : toolHasImage;
  const showFooter = !isToolTab || currentToolHasImage;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation with 9-Dot Launcher and Modal callback */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onLoadSample={handleLoadSample}
        onOpenModal={(type) => handleNavigate(type as ActiveTab)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Helper breadcrumb for tool pages */}
        {activeTab !== 'home' &&
          [
            'background-remover',
            'bg-remover',
            'upscaler',
            'ocr',
            'compress',
            'crop',
            'rotate',
            'pdf',
            'watermark',
            'filter',
            'convert',
            'resize',
            'guide',
          ].includes(activeTab) && (
            <div className="mb-6 flex items-center justify-between">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('home');
                }}
                className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Tools</span>
              </a>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pixminify Studio
              </span>
            </div>
          )}

        {/* Home Page: Serial Tools Showcase & Quick Launch */}
        {activeTab === 'home' && (
          <HomePage onSelectTool={handleNavigate} />
        )}

        {/* AI Background Remover Tab */}
        {(activeTab === 'background-remover' || activeTab === 'bg-remover') && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <BackgroundRemoverTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="background-remover" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* AI Image Upscaler Tab */}
        {activeTab === 'upscaler' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <AiUpscalerTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="upscaler" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Image to Text (OCR) Tab */}
        {activeTab === 'ocr' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <OcrTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="ocr" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Compress Tab (Primary Minification Studio) */}
        {activeTab === 'compress' && (
          items.length === 0 ? (
            <ToolUploadPage
              title="Compress Image"
              subtitle="Reduce image file size quickly while maintaining quality."
              acceptedFormats="Supports JPG, PNG, WebP, AVIF"
              accept="image/png,image/jpeg,image/webp,image/avif"
              multiple={true}
              buttonText="Upload Images"
              accentColor="blue"
              onImageSelected={handleFilesAdded}
            />
          ) : (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Header banner */}
              <div className="flex items-center justify-between flex-wrap gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Compress Images Online
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {items.length} {items.length === 1 ? 'image' : 'images'} in queue
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="add-more-compress-input"
                    className="btn-interactive px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold cursor-pointer border border-blue-200 transition-all"
                  >
                    + Add More
                  </label>
                  <input
                    id="add-more-compress-input"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/avif"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) handleFilesAdded(Array.from(e.target.files));
                    }}
                  />
                  <button
                    onClick={handleClearAll}
                    className="btn-interactive px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Global Settings Bar */}
              <GlobalSettingsBar
                settings={settings}
                onChangeSettings={setSettings}
                onApplyToAll={handleApplyToAll}
                itemCount={items.length}
                isProcessing={isProcessing}
              />

              {/* Image Queue List & Summary */}
              <ImageList
                items={items}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                onOpenCompare={(item) => setCompareItem(item)}
                isProcessing={isProcessing}
                onShowResult={handleShowResult}
              />

              {/* SEO Content Section */}
              <div className="pt-8">
                <AdBanner format="horizontal" className="max-w-5xl mx-auto mb-8" />
                <ToolSeoSection tab="compress" onSelectTab={handleNavigate} />
              </div>
            </div>
          )
        )}

        {/* Crop Tool Tab */}
        {activeTab === 'crop' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <CropTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="crop" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Rotate Tool Tab */}
        {activeTab === 'rotate' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <RotateTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="rotate" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Image to PDF Tool Tab */}
        {activeTab === 'pdf' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <ImageToPdfTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="pdf" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Watermark Tool Tab */}
        {activeTab === 'watermark' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <WatermarkTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="watermark" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Color & Filter Tool Tab */}
        {activeTab === 'filter' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <FiltersTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="filter" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Convert Format Tab */}
        {activeTab === 'convert' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <FormatConverterTool onLoadSample={handleLoadSample} onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="convert" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Resize Social Tab */}
        {activeTab === 'resize' && (
          <div className="space-y-12 animate-in fade-in duration-200">
            <SocialResizerTool onHasImageChange={setToolHasImage} onShowResult={handleShowResult} />
            {toolHasImage && (
              <>
                <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
                <ToolSeoSection tab="resize" onSelectTab={handleNavigate} />
              </>
            )}
          </div>
        )}

        {/* Universal Download / Result Tab */}
        {(activeTab === 'result' || activeTab === 'download') && (
          <div className="animate-in fade-in duration-200">
            <ResultPage
              result={activeResult}
              onSelectTab={handleNavigate}
            />
          </div>
        )}

        {/* Format & Speed Guide Tab */}
        {activeTab === 'guide' && (
          <div className="animate-in fade-in duration-200">
            <FormatGuide />
          </div>
        )}

        {/* Blog / Guides Section */}
        {activeTab === 'blog' && (
          <div className="animate-in fade-in duration-200">
            {activeBlogSlug && getArticleBySlug(activeBlogSlug) ? (
              <BlogArticlePage
                article={getArticleBySlug(activeBlogSlug)!}
                onSelectArticle={handleNavigateArticle}
                onSelectTab={handleNavigate}
              />
            ) : (
              <BlogHomePage
                onSelectArticle={handleNavigateArticle}
                onSelectTab={handleNavigate}
              />
            )}
          </div>
        )}

        {/* More Tools Coming Soon Dedicated Page */}
        {activeTab === 'coming-soon' && (
          <ComingSoonPage onSelectTab={handleNavigate} />
        )}

        {/* About Dedicated Page */}
        {activeTab === 'about' && (
          <AboutPage onSelectTab={handleNavigate} />
        )}

        {/* Contact Dedicated Page */}
        {activeTab === 'contact' && (
          <ContactPage onSelectTab={handleNavigate} />
        )}

        {/* Privacy Policy Dedicated Page */}
        {activeTab === 'privacy' && (
          <PrivacyPage onSelectTab={handleNavigate} />
        )}

        {/* Terms & Conditions Dedicated Page */}
        {activeTab === 'terms' && (
          <TermsPage onSelectTab={handleNavigate} />
        )}

        {/* Cookies Dedicated Page */}
        {activeTab === 'cookies' && (
          <CookiesPage onSelectTab={handleNavigate} />
        )}

        {/* FAQ Dedicated Page */}
        {activeTab === 'faq' && (
          <FaqPage onSelectTab={handleNavigate} />
        )}

        {/* Pricing Dedicated Page */}
        {activeTab === 'pricing' && (
          <PricingPage onSelectTab={handleNavigate} />
        )}

        {/* 404 Dedicated Not Found Page */}
        {activeTab === 'not-found' && (
          <NotFoundPage onSelectTab={handleNavigate} />
        )}
      </main>

      {/* Interactive Visual Split Comparison Modal */}
      {compareItem && (
        <SplitCompareModal
          item={compareItem}
          onClose={() => setCompareItem(null)}
        />
      )}

      {/* Information & Legal Modal Dialog fallback if triggered directly */}
      {activeModal && (
        <InfoModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onSelectTool={(tab) => {
            setActiveModal(null);
            handleNavigate(tab);
          }}
        />
      )}

      {/* Footer matching requested reference design */}
      {showFooter && (
        <Footer
          onSelectTab={handleNavigate}
          onOpenModal={(type) => handleNavigate(type as ActiveTab)}
        />
      )}
    </div>
  );
}
