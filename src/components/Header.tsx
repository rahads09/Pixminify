import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  RefreshCw,
  Maximize2,
  BookOpen,
  Home,
  Crop,
  RotateCw,
  FileText,
  Stamp,
  SlidersHorizontal,
  Info,
  Mail,
  Cookie,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { ModalType } from './InfoModal';
import { getPathForTab } from '../utils/seo';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLoadSample?: (url: string, name: string) => void;
  onOpenModal?: (type: ModalType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenModal,
}) => {
  const [isWaffleOpen, setIsWaffleOpen] = useState(false);
  const waffleRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (waffleRef.current && !waffleRef.current.contains(event.target as Node)) {
        setIsWaffleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenInfo = (e: React.MouseEvent, type: ActiveTab) => {
    e.preventDefault();
    setIsWaffleOpen(false);
    setActiveTab(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTab = (e: React.MouseEvent, tab: ActiveTab) => {
    e.preventDefault();
    setIsWaffleOpen(false);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <a
            href="/"
            onClick={(e) => handleSelectTab(e, 'home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                Pix<span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">minify</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <a
              id="nav-home-tab"
              href="/"
              onClick={(e) => handleSelectTab(e, 'home')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>All Tools</span>
            </a>

            <a
              id="nav-compress-tab"
              href="/compress/"
              onClick={(e) => handleSelectTab(e, 'compress')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'compress'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Compress</span>
            </a>

            <a
              id="nav-crop-tab"
              href="/crop/"
              onClick={(e) => handleSelectTab(e, 'crop')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'crop'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop</span>
            </a>

            <a
              id="nav-rotate-tab"
              href="/rotate/"
              onClick={(e) => handleSelectTab(e, 'rotate')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'rotate'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate</span>
            </a>

            <a
              id="nav-convert-tab"
              href="/convert/"
              onClick={(e) => handleSelectTab(e, 'convert')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'convert'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Convert</span>
            </a>

            <a
              id="nav-pdf-tab"
              href="/pdf/"
              onClick={(e) => handleSelectTab(e, 'pdf')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </a>

            <a
              id="nav-watermark-tab"
              href="/watermark/"
              onClick={(e) => handleSelectTab(e, 'watermark')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'watermark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>Watermark</span>
            </a>

            <a
              id="nav-blog-tab"
              href="/blog/"
              onClick={(e) => handleSelectTab(e, 'blog')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Blog</span>
            </a>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% In-Browser</span>
            </div>

            {/* 9-Dot Menu Launcher Button */}
            <div className="relative" ref={waffleRef}>
              <button
                id="nine-dot-menu-button"
                onClick={() => setIsWaffleOpen(!isWaffleOpen)}
                aria-label="App & Information Menu"
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isWaffleOpen
                    ? 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-500/20'
                    : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-2xs'
                }`}
                title="Apps & Information Menu"
              >
                {/* 9-Dot matrix */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="5" r="2.2" />
                  <circle cx="12" cy="5" r="2.2" />
                  <circle cx="19" cy="5" r="2.2" />
                  <circle cx="5" cy="12" r="2.2" />
                  <circle cx="12" cy="12" r="2.2" />
                  <circle cx="19" cy="12" r="2.2" />
                  <circle cx="5" cy="19" r="2.2" />
                  <circle cx="12" cy="19" r="2.2" />
                  <circle cx="19" cy="19" r="2.2" />
                </svg>
              </button>

              {/* 9-Dot Floating Popup Menu */}
              {isWaffleOpen && (
                <div
                  id="nine-dot-popup"
                  className="absolute right-0 mt-2 w-[320px] sm:w-[460px] md:w-[500px] max-h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-2xl border border-slate-300 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100 space-y-3"
                >
                  {/* Quick App Launcher Grid */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5 px-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tools & Studios
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        100% Free
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compress', label: 'Compress', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                        { id: 'crop', label: 'Crop', icon: Crop, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                        { id: 'rotate', label: 'Rotate', icon: RotateCw, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                        { id: 'convert', label: 'Convert', icon: RefreshCw, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
                        { id: 'resize', label: 'Resize', icon: Maximize2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                        { id: 'pdf', label: 'To PDF', icon: FileText, color: 'text-rose-600 bg-rose-50 border-rose-200' },
                        { id: 'watermark', label: 'Watermark', icon: Stamp, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                        { id: 'filter', label: 'Filters', icon: SlidersHorizontal, color: 'text-teal-600 bg-teal-50 border-teal-200' },
                        { id: 'blog', label: 'Blog', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                        { id: 'guide', label: 'Speed Guide', icon: BookOpen, color: 'text-slate-700 bg-slate-100 border-slate-300' },
                      ].map((item) => {
                        const Icon = item.icon;
                        const targetPath = getPathForTab(item.id as ActiveTab);
                        return (
                          <a
                            key={item.id}
                            href={targetPath}
                            onClick={(e) => handleSelectTab(e, item.id as ActiveTab)}
                            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-300 transition-all text-center group cursor-pointer"
                          >
                            <div className={`p-2 rounded-xl border ${item.color} mb-1 group-hover:scale-105 transition-transform shadow-2xs`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-600">
                              {item.label}
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Information & Legal Menu Items */}
                  <div className="pt-3">
                    <div className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Company & Legal
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      <a
                        href="/about/"
                        onClick={(e) => handleOpenInfo(e, 'about')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>About Us</span>
                      </a>

                      <a
                        href="/contact/"
                        onClick={(e) => handleOpenInfo(e, 'contact')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Contact Us</span>
                      </a>

                      <a
                        href="/privacy/"
                        onClick={(e) => handleOpenInfo(e, 'privacy')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:bg-emerald-50/50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Privacy Policy</span>
                      </a>

                      <a
                        href="/terms/"
                        onClick={(e) => handleOpenInfo(e, 'terms')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Terms</span>
                      </a>

                      <a
                        href="/cookies/"
                        onClick={(e) => handleOpenInfo(e, 'cookies')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-amber-50/50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <Cookie className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Cookies</span>
                      </a>

                      <a
                        href="/faq/"
                        onClick={(e) => handleOpenInfo(e, 'faq')}
                        className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50/50 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>FAQ & Help</span>
                      </a>
                    </div>
                  </div>

                  {/* Bottom Footer Note */}
                  <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium">Pixminify Suite</span>
                    <a
                      href="/pricing/"
                      onClick={(e) => handleOpenInfo(e, 'pricing')}
                      className="text-blue-600 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Free Forever</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Horizontal Navigation Scroll */}
        <div className="flex lg:hidden items-center space-x-1 py-2 border-t border-slate-200 overflow-x-auto">
          {[
            { id: 'home', label: 'All Tools', icon: Home },
            { id: 'compress', label: 'Compress', icon: Zap },
            { id: 'crop', label: 'Crop', icon: Crop },
            { id: 'rotate', label: 'Rotate', icon: RotateCw },
            { id: 'convert', label: 'Convert', icon: RefreshCw },
            { id: 'resize', label: 'Resize', icon: Maximize2 },
            { id: 'pdf', label: 'PDF', icon: FileText },
            { id: 'watermark', label: 'Watermark', icon: Stamp },
            { id: 'filter', label: 'Filter', icon: SlidersHorizontal },
            { id: 'blog', label: 'Blog', icon: BookOpen },
            { id: 'guide', label: 'Speed Guide', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const targetPath = getPathForTab(tab.id as ActiveTab);
            return (
              <a
                key={tab.id}
                href={targetPath}
                onClick={(e) => handleSelectTab(e, tab.id as ActiveTab)}
                className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
};
