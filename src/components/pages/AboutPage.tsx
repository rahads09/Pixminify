import React from 'react';
import {
  Info,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Globe2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface AboutPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectTab }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-200 max-w-5xl mx-auto">
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

        <span className="text-xs font-semibold text-slate-500">Company & Vision</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-800 shadow-2xs">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>About Pixminify Suite</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Next-Generation Image Tools,{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
            100% Private & In-Browser
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Pixminify was founded on a simple principle: you shouldn't have to upload your private photos to remote servers just to resize, crop, or compress them.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Mission & Technology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">The Technology Behind Pixminify</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            By leveraging modern WebAssembly (Wasm), HTML5 Canvas 2D engines, and modern browser codecs (WebP & AVIF), Pixminify executes complex multi-threaded compression algorithms directly inside your client device’s RAM.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero server compute lag — instantaneous file processing</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Handles massive multi-megabyte DSLR raw images with ease</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Works seamlessly even without an active internet connection (offline PWA)</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Strict Privacy by Architecture</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Traditional online image editors upload your personal photos to their servers, where they might be retained, analyzed, or leaked. With Pixminify, our servers never receive or store a single pixel of your data.
          </p>
          <ul className="space-y-2 text-xs text-slate-700 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No user accounts, tracking cookies, or forced logins required</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full EXIF location & camera metadata stripping available</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>GDPR, CCPA, and enterprise compliant by default</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="p-8 rounded-2xl bg-slate-900 text-white border border-slate-700 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center">Built for Creators, Developers & Teams Worldwide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 w-fit mx-auto sm:mx-0">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Lightning Fast</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Batch process dozens of photos simultaneously with zero waiting queues or subscription paywalls.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 w-fit mx-auto sm:mx-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Always Free</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No hidden subscriptions, watermark overlays on output files, or artificial limits on file conversions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/30 w-fit mx-auto sm:mx-0">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Community Driven</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built with open web standards and continuous feature additions guided by user feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Ad Placement */}
      <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
    </div>
  );
};
