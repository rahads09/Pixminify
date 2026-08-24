import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Heart,
  Gift,
  Check,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface PricingPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectTab }) => {
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

        <span className="text-xs font-semibold text-slate-500">Pricing & Plans</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Free Forever Promise</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Simple, Transparent{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
            Free Access
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          No credit card required. No monthly subscriptions. No watermarks. Pixminify is built to empower creators with enterprise tools at zero cost.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Single Hero Free Tier Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-emerald-500 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1 rounded-bl-xl shadow-xs">
          Forever Free Tier
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Pixminify Unlimited</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Community Edition</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Full access to all present and upcoming photo processing tools</p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-4xl sm:text-5xl font-black text-slate-900">$0</div>
            <div className="text-xs font-semibold text-emerald-600">Free for life • No billing info</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
          {[
            'Unlimited image batch compression (WebP, AVIF, JPG, PNG)',
            'Full interactive Crop, Rotate, and Aspect Ratio tools',
            'Image to Multi-Page PDF generator with custom layouts',
            'Custom Text & Image Watermark generator with tile mode',
            'Social media 1-click resize package generator with ZIP export',
            'Photo Color Tuning & Live Filter adjustment suite',
            'Complete EXIF metadata & GPS privacy cleaning',
            'Zero server uploads — 100% private local processing in RAM',
            'Commercial usage rights for personal & client projects',
            'Instant access to all upcoming AI & Lab tools',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
              <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Supported by unobtrusive Google Ads to keep servers free</span>
          </div>

          <button
            onClick={() => onSelectTab('compress')}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            Start Editing Photos Now →
          </button>
        </div>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
