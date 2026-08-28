import React, { useState } from 'react';
import {
  Globe,
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { ModalType } from './InfoModal';

interface FooterProps {
  onSelectTab?: (tab: ActiveTab) => void;
  onOpenModal?: (type: ModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenModal }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const languages = [
    'English',
    'Español',
    'Français',
    'Deutsch',
    'Italiano',
    'Português',
    '日本語',
    '한국어',
    '中文 (简体)',
    'বাংলা',
  ];

  const handleToolClick = (e: React.MouseEvent, tab: ActiveTab) => {
    e.preventDefault();
    if (onSelectTab) onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#20222b] text-[#9ca3af] mt-20 pt-16 pb-12 border-t border-[#2e313b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Brand & Summary Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#2e313b]">
          <div className="space-y-2 max-w-lg">
            <a
              href="/"
              onClick={(e) => handleToolClick(e, 'home')}
              className="inline-flex items-center space-x-2 text-white font-black text-xl tracking-tight hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Zap className="w-4 h-4 fill-current text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Pixminify
              </span>
            </a>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Fast, free, and 100% private in-browser image optimization suite. Compress, crop, resize, rotate, convert, watermark, and build PDFs with zero server uploads.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Client-Side • Zero Server Storage</span>
          </div>
        </div>

        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 text-sm">
          {/* IMAGE TOOLS Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              IMAGE TOOLS
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="/compress/"
                  onClick={(e) => handleToolClick(e, 'compress')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Image Compressor
                </a>
              </li>
              <li>
                <a
                  href="/crop/"
                  onClick={(e) => handleToolClick(e, 'crop')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Image Cropper
                </a>
              </li>
              <li>
                <a
                  href="/resize/"
                  onClick={(e) => handleToolClick(e, 'resize')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Image Resizer
                </a>
              </li>
              <li>
                <a
                  href="/rotate/"
                  onClick={(e) => handleToolClick(e, 'rotate')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Rotate & Flip
                </a>
              </li>
              <li>
                <a
                  href="/convert/"
                  onClick={(e) => handleToolClick(e, 'convert')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Image Converter
                </a>
              </li>
              <li>
                <a
                  href="/pdf/"
                  onClick={(e) => handleToolClick(e, 'pdf')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Image to PDF
                </a>
              </li>
            </ul>
          </div>

          {/* MORE TOOLS & CREATIVE Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              CREATIVE SUITE
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="/watermark/"
                  onClick={(e) => handleToolClick(e, 'watermark')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Add Watermark
                </a>
              </li>
              <li>
                <a
                  href="/filter/"
                  onClick={(e) => handleToolClick(e, 'filter')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Photo Filters
                </a>
              </li>
              <li>
                <a
                  href="/guide/"
                  onClick={(e) => handleToolClick(e, 'guide')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Speed & SEO Guide
                </a>
              </li>
              <li>
                <a
                  href="/coming-soon/"
                  onClick={(e) => handleToolClick(e, 'coming-soon')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center space-x-1.5"
                >
                  <span>Upcoming Tools</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800/60">Roadmap</span>
                </a>
              </li>
            </ul>
          </div>

          {/* LEGAL Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              LEGAL & TRUST
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="/privacy/"
                  onClick={(e) => handleToolClick(e, 'privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms/"
                  onClick={(e) => handleToolClick(e, 'terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="/cookies/"
                  onClick={(e) => handleToolClick(e, 'cookies')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* COMPANY & KNOWLEDGE Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs sm:text-sm">
              COMPANY
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="/about/"
                  onClick={(e) => handleToolClick(e, 'about')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact/"
                  onClick={(e) => handleToolClick(e, 'contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/blog/"
                  onClick={(e) => handleToolClick(e, 'blog')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Blog & Guides
                </a>
              </li>
              <li>
                <a
                  href="/faq/"
                  onClick={(e) => handleToolClick(e, 'faq')}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  FAQ & Help
                </a>
              </li>
            </ul>
          </div>

          {/* APP BADGES Column */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1 space-y-3 flex flex-col items-start lg:items-end">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              PWA READY
            </div>
            {/* Google Play Store Badge */}
            <div
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-black/40 border border-slate-700/80 hover:border-slate-500 hover:bg-black/60 transition-all text-white cursor-pointer group shadow-xs w-48"
              title="Install Android PWA App"
            >
              <svg className="w-5 h-5 mr-2.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M3.609 1.814L13.792 12 3.61 22.186A2.22 2.22 0 0 1 3 20.613V3.387c0-.608.225-1.167.609-1.573z"
                />
                <path
                  fill="#FBBC04"
                  d="M17.447 8.347l-3.655 3.653 3.655 3.653 4.129-2.384a1.867 1.867 0 0 0 0-3.238l-4.129-2.384z"
                />
                <path
                  fill="#EA4335"
                  d="M3.609 1.814l10.183 10.186 3.655-3.653L5.805.861C5.07.437 4.218.791 3.609 1.814z"
                />
                <path
                  fill="#34A853"
                  d="M3.609 22.186c.609 1.023 1.461 1.377 2.196.953l11.642-6.724-3.655-3.653L3.609 22.186z"
                />
              </svg>
              <div className="text-left leading-tight">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                  INSTALL ON
                </div>
                <div className="text-xs font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Google Play / Web
                </div>
              </div>
            </div>

            {/* Apple App Store Badge */}
            <div
              className="inline-flex items-center px-3.5 py-2 rounded-xl bg-black/40 border border-slate-700/80 hover:border-slate-500 hover:bg-black/60 transition-all text-white cursor-pointer group shadow-xs w-48"
              title="Install iOS PWA App"
            >
              <svg className="w-5 h-5 mr-2.5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.65-.8 1.1-1.92.98-3.04-.95.04-2.1.63-2.78 1.43-.59.69-1.12 1.83-.98 2.92 1.06.08 2.14-.52 2.78-1.31" />
              </svg>
              <div className="text-left leading-tight">
                <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                  ADD TO HOME
                </div>
                <div className="text-xs font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  iOS / Safari
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Horizontal Divider */}
        <div className="border-t border-[#353844] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Language Selector Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-[#191b22] hover:bg-[#252834] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{selectedLanguage}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Language Picker Popover */}
            {isLangOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-44 bg-[#191b22] border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 grid grid-cols-1 gap-1 text-xs">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setIsLangOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      selectedLanguage === lang
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Social Media Vector Icons & Dynamic Copyright Notice */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-4 text-slate-400">
              {/* X / Twitter */}
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                className="hover:text-white transition-colors p-1"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>

            {/* Copyright notice with dynamic year */}
            <div className="text-xs text-slate-400 font-medium">
              © {currentYear} Pixminify. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
