import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ArrowLeft,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  FileQuestion,
  Cpu,
  Smartphone,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner, AdRectangle } from '../AdBanner';

interface FaqPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

interface FaqItem {
  question: string;
  answer: string;
  category: 'Privacy & Security' | 'Compression & Formats' | 'Tools & Features' | 'Devices & Support';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Privacy & Security',
    question: 'Are my images uploaded to any remote server or cloud database?',
    answer: 'No. Absolutely never. Pixminify runs 100% locally inside your web browser using HTML5 Canvas 2D and modern JavaScript APIs. Your photos and graphics never leave your computer, smartphone, or tablet. Zero bytes of your image data are sent across the internet.',
  },
  {
    category: 'Privacy & Security',
    question: 'Do you keep copies or logs of my photos?',
    answer: 'No. Because all image processing happens exclusively in your device RAM memory, we have no capability, infrastructure, or desire to access, view, or store your photos. When you close or refresh the browser tab, the temporary memory holding your images is wiped automatically.',
  },
  {
    category: 'Privacy & Security',
    question: 'Can I safely edit confidential business documents or personal family photos?',
    answer: 'Yes. Pixminify is ideal for sensitive corporate assets, confidential legal scans, medical IDs, and personal family photographs precisely because no remote third-party ever receives or stores the files.',
  },
  {
    category: 'Compression & Formats',
    question: 'What is the difference between WebP, AVIF, JPEG, and PNG?',
    answer: 'JPEG is best for standard photography with balanced compatibility. PNG supports lossless clarity and transparent backgrounds. WebP is a modern next-generation web format developed by Google offering 25–35% smaller file sizes than JPEG with identical visual quality. AVIF is an ultra-modern format offering up to 50% savings over JPEG, supported by all modern browsers.',
  },
  {
    category: 'Compression & Formats',
    question: 'How much file size can I save with Pixminify Image Compressor?',
    answer: 'Depending on the source image and target format, compression savings typically range between 50% and 93%. For instance, converting a 4MB PNG screenshot to WebP at 80% quality often reduces the file to under 250KB without any noticeable difference in visual sharpness.',
  },
  {
    category: 'Compression & Formats',
    question: 'What is the recommended quality percentage for web images?',
    answer: 'For standard website graphics, ecommerce product galleries, and blog headers, a quality level between 75% and 82% offers the optimal sweet spot between dramatic bandwidth reduction and crisp visual fidelity.',
  },
  {
    category: 'Tools & Features',
    question: 'How does the Image to PDF converter work?',
    answer: 'The Image to PDF tool lets you drop multiple JPG, PNG, or WebP files, reorder them, select your preferred page orientation (Portrait, Landscape, or Auto-fit), choose page margins, and download a single multi-page PDF document generated client-side.',
  },
  {
    category: 'Tools & Features',
    question: 'Can I batch convert dozens of images at once?',
    answer: 'Yes! Pixminify supports batch image processing. You can select multiple images simultaneously, apply global compression settings, and download all compressed files individually or as a clean ZIP package with one click.',
  },
  {
    category: 'Tools & Features',
    question: 'Does rotating an image decrease its visual quality?',
    answer: 'When rotating at exact 90°, 180°, or 270° angles or flipping horizontally/vertically, pixel grid coordinates are transposed losslessly without resampling distortion.',
  },
  {
    category: 'Tools & Features',
    question: 'Can I add watermark logos with transparent backgrounds?',
    answer: 'Yes! The Watermark tool allows you to type custom copyright text or upload a transparent PNG logo. You can adjust position (9 anchor points), scale, opacity, rotation angle, or enable a repetitive tile pattern across the entire image.',
  },
  {
    category: 'Devices & Support',
    question: 'Does Pixminify work on mobile phones and tablets?',
    answer: 'Yes. Pixminify is fully responsive and optimized for touch interactions on iOS (Safari, Chrome) and Android devices. You can take photos directly with your camera or select from your photo library.',
  },
  {
    category: 'Devices & Support',
    question: 'Can I use Pixminify offline?',
    answer: 'Yes. Pixminify is engineered with Progressive Web App (PWA) caching principles. Once the web application code is cached in your browser, you can compress, crop, and convert images even without an active internet connection.',
  },
  {
    category: 'Devices & Support',
    question: 'Is Pixminify really 100% free with no hidden charges?',
    answer: 'Yes, Pixminify is completely free for both personal and commercial use. There are no paid tiers, no subscription prompts, no monthly usage quotas, and no forced watermarks.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onSelectTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]); // First two open by default

  const categories = ['All', 'Privacy & Security', 'Compression & Formats', 'Tools & Features', 'Devices & Support'];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tools</span>
        </button>

        <span className="text-xs font-semibold text-slate-500">Help & Questions</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-800 shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>Knowledge Base & Answers</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Frequently Asked{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Questions
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Everything you need to know about our in-browser image tools, privacy architecture, supported formats, and performance optimization.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. privacy, WebP, PDF, mobile, batch)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 p-6 rounded-2xl bg-white border border-slate-200">
            <FileQuestion className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No matching questions found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search term or browse all categories.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Still Have Questions CTA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-slate-900">Still have questions?</h3>
          <p className="text-xs text-slate-500">
            Can't find the answer you're looking for? Reach out directly to our friendly support team.
          </p>
        </div>
        <button
          onClick={() => {
            onSelectTab('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
        >
          <span>Contact Support</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
