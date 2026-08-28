import React from 'react';
import {
  FileQuestion,
  Home,
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
  Search,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface NotFoundPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onSelectTab }) => {
  const quickTools = [
    { id: 'compress' as ActiveTab, name: 'Compress Image', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'crop' as ActiveTab, name: 'Crop Image', icon: Crop, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'rotate' as ActiveTab, name: 'Rotate & Flip', icon: RotateCw, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'convert' as ActiveTab, name: 'Convert Format', icon: RefreshCw, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { id: 'resize' as ActiveTab, name: 'Resize Social', icon: Maximize2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'pdf' as ActiveTab, name: 'Image to PDF', icon: FileText, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'watermark' as ActiveTab, name: 'Add Watermark', icon: Stamp, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'filter' as ActiveTab, name: 'Photo Filters', icon: SlidersHorizontal, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200 max-w-4xl mx-auto py-6 sm:py-10">
      {/* 404 Hero Section */}
      <div className="text-center max-w-2xl mx-auto space-y-5">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-800 shadow-2xs">
          <FileQuestion className="w-3.5 h-3.5 text-rose-600" />
          <span>Error 404 • Page Not Found</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          We couldn't find the page you're looking for
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
          The link you clicked may be broken, outdated, or the address may have been typed incorrectly. Let's get you back on track with our free image tools.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectTab('home')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>

          <button
            onClick={() => onSelectTab('blog')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer border border-slate-200"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Explore Blog Guides</span>
          </button>
        </div>
      </div>

      {/* Ad Placement */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />

      {/* Popular Tools Directory */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-base font-bold text-slate-900">
            Or jump directly to a tool:
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            All tools operate 100% in your browser with zero file uploads
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onSelectTab(tool.id)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group text-center cursor-pointer"
              >
                <div className={`p-2.5 rounded-xl border ${tool.color} mb-2 group-hover:scale-110 transition-transform shadow-2xs`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
