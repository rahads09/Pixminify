import React from 'react';
import {
  Cookie,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Settings2,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface CookiesPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const CookiesPage: React.FC<CookiesPageProps> = ({ onSelectTab }) => {
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

        <span className="text-xs font-semibold text-slate-500">Legal & Cookies</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs">
          <Cookie className="w-3.5 h-3.5 text-amber-600" />
          <span>Cookie & Storage Notice</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Cookie{' '}
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          How Pixminify uses local storage and cookies to maintain your tool preferences and display non-intrusive ads.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 w-fit">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Local Browser Storage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pixminify saves your preferred compression presets (e.g. 80% quality, WebP target format) into your browser's local `localStorage` so your favorite settings persist across sessions.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 w-fit">
            <Settings2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Third-Party Ad Cookies</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Third-party advertising partners like Google AdSense may place cookies to serve ads based on your prior visits to this or other websites. You can disable personalized advertising in Google Ads Settings.
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">What are Cookies?</h2>
          <p>
            Cookies are small text files that websites store on your computer or mobile device when you browse. They are used to make websites work properly, recall your session preferences, and deliver relevant advertisements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Managing Your Cookie Preferences</h2>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, standard browser storage for saving tool preferences will continue to work locally within your device.
          </p>
        </section>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
