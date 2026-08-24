import React from 'react';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Scale,
  Shield,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface TermsPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onSelectTab }) => {
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

        <span className="text-xs font-semibold text-slate-500">Legal & Terms</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-2xs">
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Usage Guidelines</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Terms &{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Conditions
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Last Updated: 2026. Clear, transparent terms granting full rights to use Pixminify for personal, educational, and commercial workflows.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Key Permissions Box */}
      <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3">
        <h3 className="font-bold text-indigo-950 text-base flex items-center space-x-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          <span>Summary of Your Rights</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-900 font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free for unlimited personal and commercial use</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You retain 100% full copyright & ownership of your images</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No mandatory watermark or branding on compressed outputs</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No paid subscriptions or sudden recurring fees</span>
          </div>
        </div>
      </div>

      {/* Main Terms Body */}
      <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Pixminify web application, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Permitted Commercial & Personal Use</h2>
          <p>
            You are granted a worldwide, non-exclusive license to use Pixminify to compress, resize, crop, convert, watermark, and format images for any lawful personal or commercial project without royalty payments or attribution requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. Ownership of Content</h2>
          <p>
            Pixminify claims no intellectual property rights or ownership over photos, logos, graphics, or documents you process through the application. All processed outputs remain your exclusive property.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Disclaimer of Warranties</h2>
          <p>
            Pixminify is provided on an "as is" and "as available" basis. While we strive to implement robust image encoding engines, we do not warrant that results will be uninterrupted or error-free. Always keep backups of original raw source images.
          </p>
        </section>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
