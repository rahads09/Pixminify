import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Wand2,
  Layers,
  FileCode,
  EyeOff,
  Video,
  FileText,
  Palette,
  Maximize,
  Clock,
  CheckCircle2,
  Send,
  Bell,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface ComingSoonPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ onSelectTab }) => {
  const [requestedTool, setRequestedTool] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const upcomingTools = [
    {
      id: 'bg-remover',
      name: 'AI Background Remover',
      badge: 'In Active Alpha',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: Wand2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      description: '1-click neural portrait and product background eraser. Download clean transparent PNGs instantly without uploading to servers.',
      timeline: 'Q3 2026',
    },
    {
      id: 'vectorizer',
      name: 'Raster to SVG Vectorizer',
      badge: 'In Development',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: FileCode,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Convert low-resolution pixelated PNG and JPG icons, logos, and illustrations into crisp, infinitely scalable SVG vectors.',
      timeline: 'Q3 2026',
    },
    {
      id: 'metadata-inspector',
      name: 'EXIF Metadata Inspector & Stripper',
      badge: 'In Development',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: EyeOff,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      description: 'Inspect camera settings, shutter speed, ISO, and GPS location coordinates, with 1-click privacy wiping before social posting.',
      timeline: 'Q3 2026',
    },
    {
      id: 'upscaler',
      name: 'Photo Super-Resolution Upscaler',
      badge: 'Planned',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Maximize,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      description: 'Double or quadruple image resolution (2x, 4x) using bicubic spline sharpening and edge-preserving reconstruction.',
      timeline: 'Q4 2026',
    },
    {
      id: 'gif-maker',
      name: 'Animated GIF Maker & Splitter',
      badge: 'Planned',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: Video,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      description: 'Assemble image sequences into lightweight loop GIFs with frame delay customization, or decompose GIFs into individual PNG frames.',
      timeline: 'Q4 2026',
    },
    {
      id: 'ocr-text',
      name: 'OCR Image Text Extractor',
      badge: 'Planned',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: FileText,
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      description: 'Extract editable text from scanned receipts, invoices, slides, book pages, and mobile screenshots locally in your browser.',
      timeline: 'Q4 2026',
    },
    {
      id: 'palette',
      name: 'Color Palette Extractor',
      badge: 'Design Suite',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: Palette,
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
      description: 'Automatically extract dominant colors, HEX/RGB codes, CSS variables, and harmonious color swatches from any photograph.',
      timeline: 'Q4 2026',
    },
    {
      id: 'batch-rename',
      name: 'Batch Renamer & Sequencer',
      badge: 'Utility',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: Layers,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      description: 'Bulk rename hundreds of photos with custom prefixes, dates, sequential zero-padded indexes, and clean formatted names in a single zip.',
      timeline: 'Q4 2026',
    },
  ];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedTool.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200 max-w-6xl mx-auto">
      {/* Breadcrumb & Navigation */}
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

        <span className="text-xs font-semibold text-slate-500">Pixminify Labs & Roadmap</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-violet-50 border border-violet-200 text-violet-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Pixminify In-Browser Innovation Lab</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          More Tools are{' '}
          <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
            Coming Soon
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          We are continuously developing next-generation photo utilities running 100% locally in WebAssembly. Here is a sneak peek at what’s on our product pipeline.
        </p>
      </div>

      {/* Top Google Ads Banner Slot */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Grid of Upcoming Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {upcomingTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl border ${tool.iconBg} shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {tool.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target: {tool.timeline}</span>
                </span>
                <span className="text-[11px] font-semibold text-violet-600">In Pipeline</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggest a Tool / Request Feature Box */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700 shadow-md">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 text-white border border-white/20">
            <Bell className="w-6 h-6 text-yellow-300" />
          </div>

          <h2 className="text-2xl font-bold">Have a Specific Image Tool You Need?</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tell our engineering team what feature or format you would love to see next in Pixminify. We prioritize building what our users ask for most.
          </p>

          {isSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs sm:text-sm flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! Your tool suggestion has been logged with our dev team.</span>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={requestedTool}
                  onChange={(e) => setRequestedTool(e.target.value)}
                  placeholder="e.g. AI Image Sharpener, HEIC to JPG..."
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-slate-600 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-400"
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your email (optional)"
                  className="sm:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-slate-600 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Mid-Page Ad Banner */}
      <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
    </div>
  );
};
