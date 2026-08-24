import React, { useState } from 'react';
import {
  Zap,
  Crop,
  RotateCw,
  RefreshCw,
  Maximize2,
  FileText,
  Stamp,
  SlidersHorizontal,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HomeToolsViewProps {
  onSelectTool: (tab: ActiveTab) => void;
  onLoadSample: (url: string, name: string) => void;
}

interface ToolCard {
  id: ActiveTab;
  title: string;
  category: 'optimize' | 'edit' | 'convert' | 'security';
  badge?: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  gradient: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

export const HomeToolsView: React.FC<HomeToolsViewProps> = ({
  onSelectTool,
  onLoadSample,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const tools: ToolCard[] = [
    {
      id: 'compress',
      title: 'Compress Image',
      category: 'optimize',
      badge: 'Popular',
      description: 'Shrink JPEG, PNG, WebP & AVIF file sizes up to 93% with zero visual quality loss.',
      features: ['Batch optimization', 'Custom target KB size', 'EXIF strip & WebP export'],
      icon: Zap,
      gradient: 'from-blue-600 to-indigo-600',
      accentBg: 'bg-blue-50 text-blue-600',
      accentBorder: 'border-blue-200 hover:border-blue-400',
      accentText: 'text-blue-600',
    },
    {
      id: 'crop',
      title: 'Crop Image',
      category: 'edit',
      badge: 'New',
      description: 'Trim unwanted outer areas with standard aspect ratios (1:1, 16:9, 9:16, 4:3) or freeform.',
      features: ['Social media aspect ratios', 'Interactive drag grid', 'Lossless crop export'],
      icon: Crop,
      gradient: 'from-sky-500 to-blue-600',
      accentBg: 'bg-sky-50 text-sky-600',
      accentBorder: 'border-sky-200 hover:border-sky-400',
      accentText: 'text-sky-600',
    },
    {
      id: 'rotate',
      title: 'Rotate & Flip',
      category: 'edit',
      badge: 'New',
      description: 'Rotate images 90°, 180°, 270°, mirror horizontally or vertically with live angle control.',
      features: ['90° & 180° rotation', 'Horizontal & Vertical flip', 'Fine-degree slider'],
      icon: RotateCw,
      gradient: 'from-indigo-500 to-cyan-600',
      accentBg: 'bg-indigo-50 text-indigo-600',
      accentBorder: 'border-indigo-200 hover:border-indigo-400',
      accentText: 'text-indigo-600',
    },
    {
      id: 'convert',
      title: 'Convert Format',
      category: 'convert',
      badge: 'Batch',
      description: 'Instant conversion between WebP, AVIF, PNG, and JPEG with custom compression.',
      features: ['Fast browser engine', 'Batch download as ZIP', 'Transparent alpha support'],
      icon: RefreshCw,
      gradient: 'from-teal-500 to-blue-600',
      accentBg: 'bg-teal-50 text-teal-600',
      accentBorder: 'border-teal-200 hover:border-teal-400',
      accentText: 'text-teal-600',
    },
    {
      id: 'resize',
      title: 'Resize Image',
      category: 'edit',
      badge: 'Multi-size',
      description: 'Resize photos by exact pixel dimensions, percentage scaling, or 1-click social media presets.',
      features: ['Instagram, YT & X presets', 'Maintain aspect ratio', 'High-res scaling'],
      icon: Maximize2,
      gradient: 'from-violet-500 to-indigo-600',
      accentBg: 'bg-violet-50 text-violet-600',
      accentBorder: 'border-violet-200 hover:border-violet-400',
      accentText: 'text-violet-600',
    },
    {
      id: 'pdf',
      title: 'Image to PDF',
      category: 'convert',
      badge: 'New',
      description: 'Convert one or multiple images into a clean, compact PDF document in seconds.',
      features: ['Multi-page reordering', 'A4 & Letter page sizes', 'Custom margins & orientation'],
      icon: FileText,
      gradient: 'from-rose-500 to-orange-500',
      accentBg: 'bg-rose-50 text-rose-600',
      accentBorder: 'border-rose-200 hover:border-rose-400',
      accentText: 'text-rose-600',
    },
    {
      id: 'watermark',
      title: 'Add Watermark',
      category: 'security',
      badge: 'Protect',
      description: 'Stamp your photos with custom text or transparent logo watermarks to protect your copyright.',
      features: ['9-Point grid or full tile pattern', 'Custom font, color & opacity', 'Upload custom PNG logo'],
      icon: Stamp,
      gradient: 'from-amber-500 to-pink-600',
      accentBg: 'bg-amber-50 text-amber-600',
      accentBorder: 'border-amber-200 hover:border-amber-400',
      accentText: 'text-amber-600',
    },
    {
      id: 'filter',
      title: 'Color Adjust & Filters',
      category: 'edit',
      badge: 'Enhance',
      description: 'Adjust brightness, contrast, saturation, blur, grayscale, or apply 1-click photo filter presets.',
      features: ['Instant photo looks', 'Brightness & contrast tuning', 'Grayscale, sepia & blur'],
      icon: SlidersHorizontal,
      gradient: 'from-cyan-500 to-blue-600',
      accentBg: 'bg-cyan-50 text-cyan-600',
      accentBorder: 'border-cyan-200 hover:border-cyan-400',
      accentText: 'text-cyan-600',
    },
    {
      id: 'guide',
      title: 'Speed & Format Guide',
      category: 'optimize',
      badge: 'Analytics',
      description: 'Interactive calculator to estimate monthly bandwidth savings and Google PageSpeed boosts.',
      features: ['Core Web Vitals impact', 'WebP vs AVIF benchmark', 'CDN cost estimation'],
      icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-600',
      accentBg: 'bg-emerald-50 text-emerald-600',
      accentBorder: 'border-emerald-200 hover:border-emerald-400',
      accentText: 'text-emerald-600',
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-10">
      {/* Hero Welcome & Quick Search */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>All-in-One Fast In-Browser Image Studio</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Every tool you need to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
            edit, optimize & convert
          </span>{' '}
          images
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Ultra-fast, private, and simple. All processing happens 100% locally in your browser with zero server uploads.
        </p>

        {/* Search bar & quick filters */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="tools-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g. crop, watermark, pdf, compress, rotate)..."
              className="w-full pl-11 pr-4 py-3 bg-white/95 backdrop-blur-md rounded-2xl border border-sky-200/80 text-slate-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-medium">
            {[
              { id: 'all', label: 'All Tools' },
              { id: 'optimize', label: '⚡ Optimize' },
              { id: 'edit', label: '✂️ Edit & Transform' },
              { id: 'convert', label: '🔄 Convert & PDF' },
              { id: 'security', label: '🛡️ Protection' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid Display in Serial */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Available Image Tools</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {filteredTools.length} tools
            </span>
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click any tool card to launch immediately
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                id={`tool-card-${tool.id}`}
                onClick={() => onSelectTool(tool.id)}
                className={`group relative bg-white/90 backdrop-blur-md rounded-2xl border ${tool.accentBorder} p-6 shadow-[0_4px_20px_-4px_rgba(56,189,248,0.08)] hover:shadow-[0_12px_28px_-6px_rgba(56,189,248,0.2)] transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1`}
              >
                <div>
                  {/* Top row with Icon & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${tool.accentBg} shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {tool.badge && (
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>

                  {/* Features list */}
                  <div className="space-y-1.5 mb-5">
                    {tool.features.map((feat, i) => (
                      <div key={i} className="flex items-center text-[11px] text-slate-500 space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Open Tool</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Try Sample Images Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Don't have an image ready?</h4>
            <p className="text-xs text-slate-600">Try our high-resolution demo samples with any tool instantly.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              onLoadSample(
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2000&q=100',
                'sample_landscape_mountains.jpg'
              );
              onSelectTool('compress');
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium shadow-xs transition-all cursor-pointer"
          >
            🏔️ Landscape (2.4 MB)
          </button>
          <button
            onClick={() => {
              onLoadSample(
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&q=100',
                'sample_portrait_photo.jpg'
              );
              onSelectTool('crop');
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium shadow-xs transition-all cursor-pointer"
          >
            👤 Portrait (1.8 MB)
          </button>
        </div>
      </div>

      {/* Trust & Features Footer Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-white/70 border border-slate-200/80 flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">100% In-Browser Privacy</div>
            <div className="text-[11px] text-slate-500">Your files never touch a server</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/70 border border-slate-200/80 flex items-center space-x-3">
          <Zap className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">Zero Upload Waiting</div>
            <div className="text-[11px] text-slate-500">Instant client-side multi-threading</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/70 border border-slate-200/80 flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">High Visual Fidelity</div>
            <div className="text-[11px] text-slate-500">Preserves colors, sharpness & EXIF</div>
          </div>
        </div>
      </div>
    </div>
  );
};
