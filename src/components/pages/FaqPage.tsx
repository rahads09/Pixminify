import React, { useState } from 'react';
import {
  HelpCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  FileText,
  Search,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface FaqPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onSelectTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is Pixminify really 100% free with no limits?',
      a: 'Yes! There are no hidden subscription tiers, credit meters, or watermarks placed on your photos. You can compress, crop, rotate, and convert as many photos as you need without restriction.',
      category: 'General',
    },
    {
      q: 'Are my images uploaded to any cloud server?',
      a: 'Never. Pixminify works entirely in your browser using modern HTML5 Canvas, Web Workers, and WebAssembly. Your photos remain on your computer throughout the entire process.',
      category: 'Privacy',
    },
    {
      q: 'Which image format should I choose: WebP, AVIF, or JPEG?',
      a: 'WebP is the best general choice for modern websites (80% smaller than JPEG with universal 99% browser support). AVIF provides the highest possible compression ratio (up to 93% reduction) for high-traffic sites. JPEG remains ideal for email newsletters and older legacy apps.',
      category: 'Formats',
    },
    {
      q: 'Can I batch compress multiple photos at the same time?',
      a: 'Yes! Drag and drop dozens of images into the Drop Zone simultaneously. Pixminify uses multi-threaded browser workers to optimize the queue rapidly.',
      category: 'Tools',
    },
    {
      q: 'Does compressing an image remove its EXIF GPS data?',
      a: 'By default, you can enable the "Strip EXIF Metadata" option in the settings bar to purge camera models, GPS locations, and timestamps from your exported photos for privacy protection.',
      category: 'Privacy',
    },
    {
      q: 'Can I convert my compressed images into a single PDF document?',
      a: 'Yes! Use our "Image to PDF" tool to arrange, reorder, adjust page orientations (Portrait or Landscape), configure margins, and download a consolidated multi-page PDF.',
      category: 'Tools',
    },
    {
      q: 'How does the Social Media Resizer work?',
      a: 'The Social Media Resizer provides pre-calibrated pixel dimensions for Instagram (Square, Portrait, Story), YouTube thumbnails (1280x720), X/Twitter headers, LinkedIn banners, and Facebook posts. You can download individual sizes or a complete zipped archive with one click.',
      category: 'Tools',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-200 max-w-4xl mx-auto">
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

        <span className="text-xs font-semibold text-slate-500">Knowledge Base</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-50 border border-purple-200 text-purple-800 shadow-2xs">
          <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
          <span>Frequently Asked Questions</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          How Can We{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Help You?
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Answers to common questions about image compression algorithms, format conversion, and security.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. WebP, batch, privacy)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white shadow-xs text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl bg-white border border-slate-300 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3 pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {faq.category}
                  </span>
                  <span>{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Still have questions?</h3>
          <p className="text-xs text-slate-600 mt-0.5">Reach out directly to our engineering support team.</p>
        </div>
        <button
          onClick={() => onSelectTab('contact')}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer shrink-0"
        >
          Contact Support →
        </button>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
