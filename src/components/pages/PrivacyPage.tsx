import React from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  Lock,
  EyeOff,
  ServerOff,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Mail,
  Sliders,
  Globe2,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner, AdRectangle } from '../AdBanner';

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

        <span className="text-xs font-semibold text-slate-500">Legal & Transparency</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Privacy & Data Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Privacy{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Last Updated: August 2026. This Privacy Policy explains how Pixminify handles your information, how our client-side image processing works, and what data is collected when you browse our website.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Privacy Highlights Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Client-Side Image Processing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            All image compression, cropping, resizing, conversion, and filtering algorithms execute solely in your local browser sandbox.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 w-fit">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Zero Image Storage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not operate remote databases, cloud buckets, or file servers to host, store, copy, or review your uploaded photos.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-2">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Account Required</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            You can use all tools freely without creating an account, logging in, or providing personal identification.
          </p>
        </div>
      </div>

      {/* Detailed Policy Body */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>1. How Pixminify Processes Your Images</span>
          </h2>
          <p>
            When you select, drag and drop, or paste image files into Pixminify tools (such as Image Compressor, Cropper, Resizer, Converter, Rotator, Watermark, Filters, or Image to PDF), the image data is read directly into your device's browser memory using standard HTML5 Canvas 2D APIs, Web Workers, and local Blob objects.
          </p>
          <p className="bg-emerald-50/70 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-xs font-medium leading-relaxed">
            <strong>Key Guarantee:</strong> Your image files never leave your computer or mobile device. At no point are your images transmitted across the internet to our servers or any third-party computing infrastructure. When you close or refresh your browser tab, the temporary memory holding the images is immediately discarded by your browser.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            2. Information We Do NOT Collect
          </h2>
          <p>Because Pixminify is designed as a client-side utility suite, we do not collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Your original raw photo files or their compressed/edited derivatives.</li>
            <li>User account credentials (passwords, usernames, profile photos).</li>
            <li>Payment details or credit card information (our tools are free).</li>
            <li>Embedded photo EXIF metadata (GPS coordinates, camera serials, timestamps). Pixminify includes an optional feature to purge EXIF metadata before you export images.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            3. Information Automatically Collected (Website Analytics & Technical Logs)
          </h2>
          <p>
            Like virtually all modern websites, when you visit Pixminify web pages, certain technical information is processed to maintain site reliability, security, and performance:
          </p>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block text-xs uppercase tracking-wider">Web Server & CDN Logs:</strong>
              <p className="text-slate-600">
                When your browser requests web page files (HTML, CSS, JavaScript), our hosting and Content Delivery Network (CDN) providers automatically log standard request headers, including IP address, browser type, device operating system, referring URL, and date/time stamps. These server logs are used strictly for network security, DDoS mitigation, and error diagnosis.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <strong className="text-slate-900 block text-xs uppercase tracking-wider">Google Analytics 4 (GA4):</strong>
              <p className="text-slate-600">
                We use Google Analytics (Measurement ID: <code className="font-mono bg-white px-1 py-0.5 rounded border text-slate-800">G-9XR01T7FHT</code>) with IP Anonymization enabled to gather aggregated, non-personally identifiable statistics about page traffic, bounce rates, and popular tools. Google Analytics uses first-party cookies to track anonymous interactions. You can opt out of Google Analytics by using browser privacy extensions or the official <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Analytics Opt-out Browser Add-on</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            4. Cookies and Advertising Partners
          </h2>
          <p>
            To support the ongoing hosting and free availability of Pixminify, we may partner with third-party advertising networks, such as Google AdSense.
          </p>
          <p>
            Advertising partners may use cookies, web beacons, and similar tracking technologies to serve advertisements based on your prior visits to Pixminify or other websites on the internet.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Google Ads Settings</a>.</li>
            <li>Alternatively, users can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">AboutAds.info</a>.</li>
          </ul>
          <p>
            For more specific details on cookie types, please consult our dedicated <button onClick={() => onSelectTab('cookies')} className="text-blue-600 underline font-semibold cursor-pointer">Cookie Policy</button>.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            5. Local Storage Preferences
          </h2>
          <p>
            Pixminify utilizes your browser's local key-value storage (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">localStorage</code>) solely to remember your preferred tool settings across sessions (such as compression quality percentage, target format, and UI preferences). This data is stored entirely on your device and is never transmitted to any external server.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            6. Children's Privacy Protection
          </h2>
          <p>
            Pixminify is a general-audience utility website and does not knowingly collect personally identifiable information from children under the age of 13 (or under 16 in certain jurisdictions). Because no personal information is requested or stored to use the tools, children can use the site safely without risk of personal data harvesting.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            7. External Links & Third-Party Services
          </h2>
          <p>
            Our website and blog articles may contain links to external websites, documentation, or references. We do not control the privacy practices or content of third-party websites. We encourage you to review the privacy policies of any third-party websites you visit.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            8. User Rights and Data Control
          </h2>
          <p>
            Depending on your jurisdiction (including the European Economic Area, the UK, and California), you may have legal rights regarding your personal data:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>The right to know what personal data is collected, used, or disclosed.</li>
            <li>The right to request deletion of any personal data held about you (e.g. communications sent to our email).</li>
            <li>The right to opt out of the sale or sharing of personal data for cross-context behavioral advertising.</li>
          </ul>
          <p>
            Because we do not store your images or maintain user accounts, there are no photo archives or account profiles to access, correct, or delete on our systems.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">
            9. Changes and Updates to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our tool capabilities, hosting infrastructure, or regulatory requirements. Any modifications will be posted on this page with an updated "Last Updated" date.
          </p>
        </section>

        {/* Section 10 */}
        <section className="space-y-3 pt-2 border-t border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            10. Contacting Us
          </h2>
          <p>
            If you have questions, feedback, or concerns regarding this Privacy Policy or our client-side processing architecture, please contact us at:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-1">
            <div><strong>General Inquiries:</strong> <a href="mailto:hello@pixminify.com" className="text-blue-600 font-semibold hover:underline">hello@pixminify.com</a></div>
            <div><strong>Privacy & Technical Support:</strong> <a href="mailto:contact@pixminify.com" className="text-blue-600 font-semibold hover:underline">contact@pixminify.com</a></div>
            <div className="text-slate-500 text-xs pt-1">Pixminify Image Optimization Platform • Website: https://www.pixminify.com</div>
          </div>
        </section>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
