import React, { useState } from 'react';
import {
  Cookie,
  ArrowLeft,
  CheckCircle2,
  Info,
  Sliders,
  Shield,
  ExternalLink,
  Globe,
  Settings,
  Trash2,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface CookiesPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const CookiesPage: React.FC<CookiesPageProps> = ({ onSelectTab }) => {
  const [clearedPreferences, setClearedPreferences] = useState(false);

  const handleClearLocalStorage = () => {
    try {
      localStorage.clear();
      setClearedPreferences(true);
      setTimeout(() => setClearedPreferences(false), 3000);
    } catch (e) {
      console.warn('Could not clear local storage', e);
    }
  };

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
          <span>Cookie & Storage Disclosure</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Cookie{' '}
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Last Updated: August 2026. This Cookie Policy explains how Pixminify uses cookies, local browser storage, and related technologies to provide a fast, personalized, and functional user experience.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Cookie Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 w-fit">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Essential Local Storage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Stores your preferred tool settings (e.g. target quality, default output format, EXIF strip toggle) solely in your browser.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Analytics Cookies</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Google Analytics 4 cookies (<code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">_ga</code>) collect aggregate, anonymized traffic insights to guide feature improvements.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 w-fit">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Advertising Cookies</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ad network cookies (e.g. Google AdSense) prevent repetitive ad displays and support keeping our image tools 100% free.
          </p>
        </div>
      </div>

      {/* Main Cookie Policy Content */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. What Are Cookies and Local Storage?</h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you visit websites. They help websites remember your preferences, keep you logged in, and analyze site performance.
          </p>
          <p>
            HTML5 Local Storage is a client-side database built into modern web browsers that allows web applications to store key-value data directly on your device without sending that data to remote servers on every page request.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">2. Cookies and Storage Used on Pixminify</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Type</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Tool Preferences</td>
                  <td className="p-3">Pixminify (Local)</td>
                  <td className="p-3">Remembers quality sliders, format choice, and UI preferences.</td>
                  <td className="p-3">Persistent (localStorage)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Analytics (_ga, _ga_*)</td>
                  <td className="p-3">Google Analytics 4</td>
                  <td className="p-3">Measures anonymous visitor numbers, session duration, and pageviews.</td>
                  <td className="p-3">Up to 2 years</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Ad Delivery (__gads)</td>
                  <td className="p-3">Google AdSense</td>
                  <td className="p-3">Frequency capping, ad fraud prevention, and personalized/non-personalized ads.</td>
                  <td className="p-3">13 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. How to Manage and Disable Cookies in Your Browser</h2>
          <p>
            You have the right to accept or decline cookies. You can configure or modify your web browser controls to accept or refuse cookies at any time. If you choose to reject cookies, you may still use our website and all our image processing tools without limitation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <span className="font-semibold text-slate-800 group-hover:text-blue-600">Google Chrome Cookie Settings</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <span className="font-semibold text-slate-800 group-hover:text-blue-600">Mozilla Firefox Cookie Settings</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <span className="font-semibold text-slate-800 group-hover:text-blue-600">Apple Safari Cookie Settings</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <span className="font-semibold text-slate-800 group-hover:text-blue-600">Microsoft Edge Cookie Settings</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Advertising Network Opt-Out Links</h2>
          <p>
            To manage your advertising personalization preferences across advertising partners, visit:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>
              <strong>Google Ads Settings:</strong>{' '}
              <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">
                https://adssettings.google.com/
              </a>
            </li>
            <li>
              <strong>Digital Advertising Alliance:</strong>{' '}
              <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">
                https://optout.aboutads.info/
              </a>
            </li>
            <li>
              <strong>European Interactive Digital Advertising Alliance (EDAA):</strong>{' '}
              <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">
                https://www.youronlinechoices.eu/
              </a>
            </li>
          </ul>
        </section>

        {/* Section 5: Interactive Storage Manager */}
        <section className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Settings className="w-4 h-4 text-slate-700" />
            <span>Manage Pixminify Local Storage on This Device</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Clicking the button below will immediately clear any local preset settings (such as custom quality sliders or default output formats) saved in your browser for Pixminify.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClearLocalStorage}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset Local Preferences</span>
            </button>
            {clearedPreferences && (
              <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Local storage cleared successfully!</span>
              </span>
            )}
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 pt-2 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">5. Questions & Contact</h2>
          <p>
            If you have questions regarding our use of cookies or local storage, please reach out to:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
            <strong>Support & Questions:</strong> <a href="mailto:contact@pixminify.com" className="text-blue-600 font-semibold hover:underline ml-1">contact@pixminify.com</a>
          </div>
        </section>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
