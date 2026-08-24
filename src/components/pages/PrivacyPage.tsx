import React from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  EyeOff,
  ServerOff,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface PrivacyPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onSelectTab }) => {
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

        <span className="text-xs font-semibold text-slate-500">Legal & Privacy</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Total Privacy Guarantee</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Privacy{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Last Updated: 2026. Pixminify is built with a zero-server-upload architecture to protect your personal and confidential images.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Privacy Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Server Uploads</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All compression, conversion, cropping, and filtering algorithms execute solely in your local browser sandbox.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 w-fit">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Zero Image Storage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not host databases, cloud storage buckets, or temporary caches for your processed photos.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Account Needed</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Use all tools freely without submitting your name, email, payment details, or personal credentials.
          </p>
        </div>
      </div>

      {/* Main Privacy Policy Body */}
      <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Information We Do Not Collect</h2>
          <p>
            When you drag and drop, paste, or select images on Pixminify, the binary files are loaded directly into browser memory (HTML5 File API and Web Workers). 
            <strong> At no point are your image files transmitted to our servers or any third-party computing infrastructure.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. EXIF & Geolocation Metadata</h2>
          <p>
            Modern cameras and smartphones frequently attach GPS coordinates, camera model information, and timestamps inside EXIF tags. Pixminify provides an optional toggle to strip all EXIF metadata upon compression to prevent accidental location leaks before you share photos online.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Analytics & Ad Serving</h2>
          <p>
            To keep our suite 100% free forever for all users globally, we may display unobtrusive third-party ads (such as Google AdSense). These advertising partners may use standard non-personally identifiable cookies or web beacons to display relevant ads. You can review cookie controls in our Cookies Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Contact & Regulatory Compliance</h2>
          <p>
            Because we do not store, process, or sell personal data on remote servers, Pixminify adheres strictly with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act) requirements by design.
          </p>
        </section>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
