import React from 'react';
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
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { AdBanner } from './AdBanner';
import { getPathForTab } from '../utils/seo';

interface HomePageProps {
  onSelectTool: (tab: ActiveTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTool }) => {
  const tools = [
    {
      id: 'compress' as ActiveTab,
      name: 'Compress Image',
      tag: 'Most Popular',
      tagColor: 'bg-blue-100 text-blue-700',
      icon: Zap,
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-200',
      description: 'Minify JPEG, PNG, WebP, AVIF up to 90% without visible quality loss.',
      badge: 'Batch Processing',
    },
    {
      id: 'crop' as ActiveTab,
      name: 'Crop Image',
      tag: 'New Tool',
      tagColor: 'bg-emerald-100 text-emerald-700',
      icon: Crop,
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      description: 'Trim photos with freeform or standard aspect ratios (1:1, 16:9, 4:3, circular).',
      badge: 'Pixel Perfect',
    },
    {
      id: 'rotate' as ActiveTab,
      name: 'Rotate & Flip',
      tag: 'Essential',
      tagColor: 'bg-indigo-100 text-indigo-700',
      icon: RotateCw,
      iconBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      description: 'Rotate 90°, custom fine-angle rotation (-180° to +180°), and horizontal/vertical flips.',
      badge: 'High Precision',
    },
    {
      id: 'pdf' as ActiveTab,
      name: 'Image to PDF',
      tag: 'Document Ready',
      tagColor: 'bg-rose-100 text-rose-700',
      icon: FileText,
      iconBg: 'bg-rose-500/10 text-rose-600 border-rose-200',
      description: 'Combine multiple images into a single clean PDF with custom page orientation & margins.',
      badge: 'Multi-Page Export',
    },
    {
      id: 'watermark' as ActiveTab,
      name: 'Add Watermark',
      tag: 'Copyright Shield',
      tagColor: 'bg-amber-100 text-amber-700',
      icon: Stamp,
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-200',
      description: 'Protect your photos with customizable text or PNG logos, opacity, rotation, and tile pattern.',
      badge: 'Anti-Theft',
    },
    {
      id: 'convert' as ActiveTab,
      name: 'Convert Format',
      tag: 'Next-Gen Codecs',
      tagColor: 'bg-sky-100 text-sky-700',
      icon: RefreshCw,
      iconBg: 'bg-sky-500/10 text-sky-600 border-sky-200',
      description: 'Batch convert photos between PNG, JPG, WebP, and ultra-efficient AVIF format in seconds.',
      badge: '1-Click Convert',
    },
    {
      id: 'filter' as ActiveTab,
      name: 'Photo Filters & Color',
      tag: 'Creative Suite',
      tagColor: 'bg-cyan-100 text-cyan-700',
      icon: SlidersHorizontal,
      iconBg: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
      description: 'Tune brightness, contrast, saturation, blur, grayscale, and 1-click aesthetic presets.',
      badge: 'Live Preview',
    },
    {
      id: 'resize' as ActiveTab,
      name: 'Social Media Resizer',
      tag: 'Templates',
      tagColor: 'bg-purple-100 text-purple-700',
      icon: Maximize2,
      iconBg: 'bg-purple-500/10 text-purple-600 border-purple-200',
      description: 'Generate 1-click resized packages for Instagram, YouTube thumbnails, X, Facebook & LinkedIn.',
      badge: 'Zip Export',
    },
    {
      id: 'guide' as ActiveTab,
      name: 'Speed & SEO Guide',
      tag: 'Calculator',
      tagColor: 'bg-teal-100 text-teal-700',
      icon: BookOpen,
      iconBg: 'bg-teal-500/10 text-teal-600 border-teal-200',
      description: 'Estimate bandwidth savings, page speed improvement, and core web vitals SEO boost.',
      badge: 'Interactive',
    },
    {
      id: 'coming-soon' as ActiveTab,
      name: 'More Tools Coming Soon',
      tag: 'Labs & Roadmap',
      tagColor: 'bg-violet-100 text-violet-800 font-bold',
      icon: Sparkles,
      iconBg: 'bg-violet-500/10 text-violet-600 border-violet-200',
      description: 'AI Background Remover, SVG Vectorizer, EXIF Stripper, GIF Maker, OCR Text Extractor & Upscaler are coming soon.',
      badge: 'Upcoming Tools',
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-4 pt-2 sm:pt-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>All-in-One In-Browser Photo Suite</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          All the{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
            Image Tools You Need
          </span>
          , in One Place
        </h1>

        <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto leading-relaxed font-normal">
          Fast, simple, and free image tools for editing, optimizing, converting, resizing, and more. Everything runs 100% in your browser, keeping your images private and your workflow fast.
        </p>
      </section>

      {/* Top Google Ads Banner Slot */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Serial Tools Grid Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore Tools</h2>
            <p className="text-xs text-slate-600 mt-0.5">Click any tool to start editing immediately</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Private & Free</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const targetPath = getPathForTab(tool.id);
            return (
              <a
                key={tool.id}
                href={targetPath}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTool(tool.id);
                }}
                className="group relative p-6 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-300 hover:border-blue-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${tool.iconBg} group-hover:scale-105 transition-transform shadow-2xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${tool.tagColor}`}>
                      {tool.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-600 font-semibold">{tool.badge}</span>
                  <div className="flex items-center space-x-1 text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Mid-Page Google Ads Banner Slot */}
      <AdBanner format="horizontal" className="max-w-5xl mx-auto" />

      {/* Feature Guarantee Badges */}
      <section className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Zero Server Uploads</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Your files never leave your computer. WebAssembly & HTML5 Canvas process everything locally.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Instant Performance</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              No waiting in queues or cloud server delays. Batch process multiple photos with instantaneous speed.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Lossless & High Quality</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              State-of-the-art compression algorithms with real-time visual split comparison for pristine fidelity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
