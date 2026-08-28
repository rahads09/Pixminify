import React from 'react';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Scale,
  Shield,
  HelpCircle,
  Mail,
  Ban,
  FileCheck2,
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
          <span>Website Terms of Use</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Terms &{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Conditions
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Last Updated: August 2026. Please read these Terms of Use carefully before accessing or using the Pixminify website and image processing tools.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Summary of Key Rights */}
      <div className="p-6 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3">
        <h3 className="font-bold text-indigo-950 text-base flex items-center space-x-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          <span>Key Principles of Your Use</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-indigo-900 font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Free for personal, educational, and commercial projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>You retain 100% intellectual property ownership of your files</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Zero forced watermarks or attribution on generated images</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>No paid subscriptions or hidden recurring charges</span>
          </div>
        </div>
      </div>

      {/* Main Terms Body */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing, browsing, or using Pixminify (available at https://www.pixminify.com and associated subpages), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our accompanying Privacy Policy. If you do not agree with any part of these terms, you must not use our website or tools.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">2. Permitted Use & Commercial Rights</h2>
          <p>
            Pixminify grants you a worldwide, non-exclusive, revocable, non-transferable license to use our web-based tools to compress, convert, resize, crop, rotate, filter, watermark, and generate PDF documents from image files.
          </p>
          <p>
            You are entirely free to use the resulting compressed and edited images for any lawful personal, educational, non-profit, or commercial purpose (including websites, print publications, marketing assets, client deliverables, and software products) without paying royalties or attributing Pixminify.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">3. User Content & Intellectual Property</h2>
          <div className="space-y-2">
            <p>
              <strong>Your Content:</strong> You retain complete, unencumbered ownership and all copyright, trademark, and intellectual property rights in and to all images, graphics, and materials you process through Pixminify. Pixminify does not claim, acquire, or license any rights to your content.
            </p>
            <p>
              <strong>Pixminify Intellectual Property:</strong> All website designs, software code, user interface components, algorithms, logos, branding, graphics, and educational blog articles created by Pixminify are protected by copyright, trademark, and intellectual property laws. You may not scrape, mirror, reverse-engineer, or redistribute the website codebase without express written permission.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">4. Prohibited Activities & Acceptable Use</h2>
          <p>When using Pixminify, you agree that you will not:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>Process, create, or distribute any content that is unlawful, defamatory, harassing, sexually explicit, abusive, or infringing on any third-party intellectual property or privacy rights.</li>
            <li>Use automated bots, scrapers, crawlers, or high-frequency scripts to overload, disrupt, or impair our web servers or infrastructure.</li>
            <li>Attempt to bypass, disable, or tamper with security measures, ad placements, or site integrity.</li>
            <li>Use the website in any manner that violates applicable local, national, or international laws or regulations.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Tool Availability & Accuracy Limitations</h2>
          <p>
            While we continuously test and optimize our client-side image processing algorithms across modern web browsers, image rendering fidelity and compression ratios depend heavily on your browser version, device hardware, available RAM, and source image characteristics.
          </p>
          <p className="text-xs bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-600">
            <strong>Important Recommendation:</strong> Always maintain separate, unedited backups of your original master image files before processing and downloading compressed versions.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">6. Third-Party Links & Services</h2>
          <p>
            Our website may contain links to third-party websites, documentation, or services (such as Google Analytics or advertising networks). We are not responsible for the availability, content, policies, or practices of any third-party websites. Accessing external links is solely at your own risk.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">7. Disclaimer of Warranties</h2>
          <p className="text-xs sm:text-sm uppercase tracking-wide font-medium text-slate-600">
            Pixminify and all tools, features, and content are provided on an "as is" and "as available" basis without warranties of any kind, whether express, implied, statutory, or otherwise, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall Pixminify, its operators, contributors, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages (including loss of data, loss of profits, loss of goodwill, or business interruption) arising out of or in connection with your use or inability to use the website or tools.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">9. Modifications to Service & Terms</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any aspect of our tools or website at any time without prior notice. We may also revise these Terms of Use periodically. Continued use of the website following any changes constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Insert Applicable Jurisdiction], without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in the applicable courts of [Insert Applicable Jurisdiction].
          </p>
        </section>

        {/* Section 11 */}
        <section className="space-y-3 pt-2 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">11. Contact Information</h2>
          <p>
            If you have questions or inquiries regarding these Terms of Use, please reach out to us at:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1">
            <div><strong>General Inquiries:</strong> <a href="mailto:hello@pixminify.com" className="text-blue-600 font-semibold hover:underline">hello@pixminify.com</a></div>
            <div><strong>Legal & Support:</strong> <a href="mailto:contact@pixminify.com" className="text-blue-600 font-semibold hover:underline">contact@pixminify.com</a></div>
            <div className="text-slate-500 text-xs pt-1">Pixminify Platform • https://www.pixminify.com</div>
          </div>
        </section>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
