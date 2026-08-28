import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Zap,
  ServerOff,
  Code2,
  Cpu,
  Layers,
  Heart,
  Globe2,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface AboutPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectTab }) => {
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

        <span className="text-xs font-semibold text-slate-500">About Pixminify</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Our Vision & In-Browser Technology</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Private, In-Browser Image Optimization for{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Everyone
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Pixminify was founded on a simple principle: you shouldn't have to upload your private photos, business assets, or personal memories to remote cloud servers just to resize, crop, convert, or compress them.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Core Mission & The Problem We Solve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-slate-900">The Problem with Traditional Tools</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Most online image editors force you to upload large gigabytes of photos across the internet to their remote servers. This introduces three major issues:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Privacy Risks:</strong> Private documents and personal photos sit on third-party servers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Slow Upload Queues:</strong> Bandwidth lag and server queues slow down your workflow.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-rose-500 font-bold">•</span>
              <span><strong>Aggressive Paywalls:</strong> Annoying file limits, watermarks, or monthly subscriptions.</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
          <h2 className="text-lg font-bold text-slate-900">The Pixminify Solution</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Pixminify brings the power of desktop image workstations straight into your web browser using modern web standards:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>100% Client-Side:</strong> Images process in your device RAM. Zero bytes sent to cloud servers.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Instant Speed:</strong> Zero upload lag. Real-time preview rendering and batch exports.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Completely Free:</strong> No accounts, no paywalls, and no forced branding on your photos.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* In-Browser Architecture Explained */}
      <div className="p-6 sm:p-10 rounded-2xl bg-slate-900 text-white space-y-6 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Under the Hood: How Pixminify Works
            </h2>
            <p className="text-xs text-slate-400">
              Modern WebAssembly, HTML5 Canvas 2D, and Web Workers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h3 className="text-sm font-bold text-blue-400">HTML5 Canvas Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              High-precision bicubic resampling, clipping paths, rotate transformations, and alpha-channel matrix filters.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h3 className="text-sm font-bold text-cyan-400">Native Image Encoders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browser-native encoders for WebP, AVIF, JPEG, and PNG achieve dramatic file size savings while maintaining visual fidelity.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <h3 className="text-sm font-bold text-emerald-400">Zero Server Traffic</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Files are converted into localized in-memory Blob URLs (<code className="font-mono text-[11px] text-emerald-300">blob:http...</code>) that exist only within your active browser tab.
            </p>
          </div>
        </div>
      </div>

      {/* Target Audiences */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Built for Creators, Developers & Teams</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Trusted by diverse professionals who need fast, secure photo workflows
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-xs text-slate-900">Web Developers</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pass Google PageSpeed & Core Web Vitals audits by batch-converting assets to WebP and AVIF.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-xs text-slate-900">Photographers</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Resize proof galleries, apply text or logo copyright watermarks, and compress web portfolios.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-xs text-slate-900">E-Commerce Sellers</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Standardize square 1:1 product thumbnails for Shopify, Amazon, and Etsy marketplaces.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-300 shadow-sm text-center space-y-2">
            <div className="w-8 h-8 mx-auto rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-bold text-xs text-slate-900">Content Creators</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Instantly resize images for YouTube thumbnails, Instagram Stories, LinkedIn banners, and X posts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center space-y-4 shadow-lg shadow-blue-600/10">
        <h2 className="text-xl sm:text-2xl font-black">
          Experience the In-Browser Speed Today
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
          No signups, no installations, no server uploads. Launch our primary compression studio or pick any tool from our suite.
        </p>
        <button
          onClick={() => {
            onSelectTab('compress');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm hover:bg-blue-50 transition-colors shadow-md cursor-pointer"
        >
          <span>Launch Image Compressor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
