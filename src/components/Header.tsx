import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  HelpCircle,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Layers,
  ArrowRight,
  CheckCircle2,
  LayoutGrid,
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

interface ToolItem {
  id: ActiveTab;
  name: string;
  shortDesc: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  badge?: string;
  badgeColor?: string;
}

interface ToolCategory {
  title: string;
  icon: React.ElementType;
  items: ToolItem[];
}

const TOOL_CATEGORIES: ToolCategory[] = [
  {
    title: 'IMAGE TOOLS',
    icon: SlidersHorizontal,
    items: [
      {
        id: 'compress',
        name: 'Compress',
        shortDesc: 'Reduce file size up to 90%',
        icon: Zap,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50 border-blue-200',
        badge: 'Popular',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      },
      {
        id: 'resize',
        name: 'Resize',
        shortDesc: 'Scale by dimensions & social presets',
        icon: Maximize2,
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50 border-purple-200',
      },
      {
        id: 'crop',
        name: 'Crop',
        shortDesc: 'Custom ratios & circular crop',
        icon: Crop,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50 border-emerald-200',
      },
      {
        id: 'rotate',
        name: 'Rotate',
        shortDesc: '90°/180° rotation & horizontal flip',
        icon: RotateCw,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50 border-indigo-200',
      },
      {
        id: 'filter',
        name: 'Filter',
        shortDesc: 'Color adjustments & photo presets',
        icon: SlidersHorizontal,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50 border-teal-200',
      },
      {
        id: 'watermark',
        name: 'Watermark',
        shortDesc: 'Text & logo copyright stamps',
        icon: Stamp,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50 border-amber-200',
      },
    ],
  },
  {
    title: 'CONVERT & DOCUMENT',
    icon: Layers,
    items: [
      {
        id: 'convert',
        name: 'Convert',
        shortDesc: 'JPG, PNG, WebP & AVIF conversion',
        icon: RefreshCw,
        iconColor: 'text-cyan-600',
        iconBg: 'bg-cyan-50 border-cyan-200',
      },
      {
        id: 'pdf',
        name: 'Image to PDF',
        shortDesc: 'Combine photos into single PDF',
        icon: FileText,
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-50 border-rose-200',
      },
    ],
  },
  {
    title: 'SMART TOOLS',
    icon: Sparkles,
    items: [
      {
        id: 'background-remover',
        name: 'Background Remover',
        shortDesc: 'Instant AI cutout & transparent PNG',
        icon: Sparkles,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50 border-blue-200',
        badge: 'AI',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      {
        id: 'upscaler',
        name: 'Image Upscaler',
        shortDesc: '2x & 4x neural super-resolution',
        icon: Maximize2,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50 border-indigo-200',
        badge: 'AI',
        badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      },
      {
        id: 'ocr',
        name: 'OCR / Image to Text',
        shortDesc: 'Extract text in 25+ languages',
        icon: FileText,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50 border-amber-200',
        badge: 'OCR',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      },
    ],
  },
];

const ALL_TOOLS_FLAT: ToolItem[] = TOOL_CATEGORIES.flatMap((c) => c.items);

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNineDotOpen, setIsNineDotOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileToolsExpanded, setMobileToolsExpanded] = useState(true);

  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const nineDotRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(target)
      ) {
        setIsToolsOpen(false);
      }
      if (
        nineDotRef.current &&
        !nineDotRef.current.contains(target)
      ) {
        setIsNineDotOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        const elem = target as HTMLElement;
        if (!elem.closest('#mobile-menu-toggle')) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsToolsOpen(false);
        setIsNineDotOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnterTools = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsToolsOpen(true);
  };

  const handleMouseLeaveTools = () => {
    timeoutRef.current = setTimeout(() => {
      setIsToolsOpen(false);
    }, 180);
  };

  const handleSelectTab = useCallback((e: React.MouseEvent, tab: ActiveTab) => {
    e.preventDefault();
    setIsToolsOpen(false);
    setIsNineDotOpen(false);
    setIsMobileMenuOpen(false);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  const isToolActive = [
    'compress',
    'crop',
    'rotate',
    'convert',
    'resize',
    'pdf',
    'watermark',
    'filter',
    'bg-remover',
    'background-remover',
    'upscaler',
    'ocr',
  ].includes(activeTab);

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* 1. Left: Pixminify Logo & Brand */}
          <div className="flex items-center shrink-0">
            <a
              id="header-logo"
              href="/"
              onClick={(e) => handleSelectTab(e, 'home')}
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
              aria-label="Pixminify"
            >
              <img
                src="/pixminify-logo.png"
                alt="Pixminify"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain group-hover:scale-105 transition-transform shrink-0"
                loading="eager"
                decoding="async"
              />
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Pix<span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">minify</span>
                </span>
              </div>
            </a>
          </div>

          {/* 2. Center: Visually Centered Primary Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 max-w-2xl mx-auto space-x-1" aria-label="Main Navigation">
            
            {/* Tools Dropdown / Mega Menu Button (No icon before Tools) */}
            <div
              className="relative"
              ref={toolsDropdownRef}
              onMouseEnter={handleMouseEnterTools}
              onMouseLeave={handleMouseLeaveTools}
            >
              <button
                id="nav-tools-dropdown-button"
                type="button"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
                className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isToolsOpen || isToolActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <span>Tools</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isToolsOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown Panel */}
              {isToolsOpen && (
                <div
                  id="nav-tools-mega-menu"
                  role="menu"
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[760px] xl:w-[840px] max-w-[calc(100vw-2rem)] z-50 animate-in fade-in zoom-in-98 duration-150"
                >
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-5 lg:p-6 overflow-hidden">
                    {/* Top Header inside Mega Menu */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Pixminify Tool Suite
                        </span>
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          11 Fast In-Browser Tools
                        </span>
                      </div>
                      <a
                        href="/"
                        onClick={(e) => handleSelectTab(e, 'home')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 hover:underline cursor-pointer"
                      >
                        <span>Explore All Tools</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* 3-Column Categorized Grid */}
                    <div className="grid grid-cols-3 gap-5 lg:gap-6">
                      {TOOL_CATEGORIES.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                          <div key={category.title} className="space-y-2.5">
                            {/* Category Header */}
                            <div className="flex items-center space-x-1.5 px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              <CategoryIcon className="w-3.5 h-3.5 text-slate-500" />
                              <span>{category.title}</span>
                            </div>

                            {/* Items */}
                            <div className="space-y-1">
                              {category.items.map((tool) => {
                                const Icon = tool.icon;
                                const targetPath = getPathForTab(tool.id);
                                const isCurrent = activeTab === tool.id || (tool.id === 'background-remover' && activeTab === 'bg-remover');

                                return (
                                  <a
                                    key={tool.id}
                                    id={`mega-tool-${tool.id}`}
                                    href={targetPath}
                                    role="menuitem"
                                    onClick={(e) => handleSelectTab(e, tool.id)}
                                    className={`flex items-start space-x-2.5 p-2 rounded-xl transition-all group cursor-pointer border ${
                                      isCurrent
                                        ? 'bg-blue-50/80 border-blue-200 shadow-2xs'
                                        : 'hover:bg-slate-50 border-transparent hover:border-slate-200'
                                    }`}
                                  >
                                    <div
                                      className={`p-2 rounded-xl border shrink-0 group-hover:scale-105 transition-transform shadow-2xs ${tool.iconBg} ${tool.iconColor}`}
                                    >
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center space-x-1.5">
                                        <span
                                          className={`text-xs font-bold truncate ${
                                            isCurrent
                                              ? 'text-blue-700'
                                              : 'text-slate-900 group-hover:text-blue-600'
                                          }`}
                                        >
                                          {tool.name}
                                        </span>
                                        {tool.badge && (
                                          <span
                                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md border shrink-0 ${tool.badgeColor}`}
                                          >
                                            {tool.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 leading-tight">
                                        {tool.shortDesc}
                                      </p>
                                    </div>
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mega Menu Footer Note */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/70 -mx-5 -mb-5 lg:-mx-6 lg:-mb-6 px-5 lg:px-6 py-3">
                      <div className="flex items-center space-x-1.5 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>100% Client-Side Privacy — Zero Server Uploads</span>
                      </div>
                      <a
                        href="/pricing/"
                        onClick={(e) => handleSelectTab(e, 'pricing')}
                        className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        Free Forever
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Blog Link */}
            <a
              id="nav-blog-link"
              href="/blog/"
              onClick={(e) => handleSelectTab(e, 'blog')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              Blog
            </a>

            {/* FAQ Link */}
            <a
              id="nav-faq-link"
              href="/faq/"
              onClick={(e) => handleSelectTab(e, 'faq')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              FAQ
            </a>

            {/* About Link */}
            <a
              id="nav-about-link"
              href="/about/"
              onClick={(e) => handleSelectTab(e, 'about')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              About
            </a>

            {/* Contact Link */}
            <a
              id="nav-contact-link"
              href="/contact/"
              onClick={(e) => handleSelectTab(e, 'contact')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              Contact
            </a>
          </nav>

          {/* 3. Right: Header Actions (Badge + 9-Dot Menu + Mobile Hamburger) */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Privacy Badge on Tablet/Desktop */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% In-Browser</span>
            </div>

            {/* Restored 9-Dot Grid App Launcher Menu */}
            <div className="relative" ref={nineDotRef}>
              <button
                id="header-nine-dot-menu"
                type="button"
                onClick={() => setIsNineDotOpen(!isNineDotOpen)}
                aria-expanded={isNineDotOpen}
                aria-label="Pixminify Tools Launcher (9-dot menu)"
                title="All Tools Launcher"
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isNineDotOpen
                    ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-2xs ring-2 ring-blue-500/20'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-2xs'
                }`}
              >
                {/* 9-Dot Grid Icon */}
                <div className="grid grid-cols-3 gap-[2.5px] w-4 h-4">
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                  <div className={`w-1 h-1 rounded-[1px] ${isNineDotOpen ? 'bg-blue-600' : 'bg-slate-700'}`} />
                </div>
              </button>

              {/* 9-Dot Quick Launcher Grid Popover */}
              {isNineDotOpen && (
                <div
                  id="nine-dot-popover-menu"
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-[320px] sm:w-[360px] bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-98 duration-150"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <LayoutGrid className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Quick Tools Launcher
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      11 Tools
                    </span>
                  </div>

                  {/* 3-Column Tool Tile Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {ALL_TOOLS_FLAT.map((tool) => {
                      const Icon = tool.icon;
                      const targetPath = getPathForTab(tool.id);
                      const isCurrent = activeTab === tool.id || (tool.id === 'background-remover' && activeTab === 'bg-remover');

                      return (
                        <a
                          key={tool.id}
                          id={`nine-dot-tool-${tool.id}`}
                          href={targetPath}
                          onClick={(e) => handleSelectTab(e, tool.id)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all group cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50 border-blue-300 shadow-2xs'
                              : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl border shrink-0 mb-1.5 group-hover:scale-110 transition-transform ${tool.iconBg} ${tool.iconColor}`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-[11px] font-bold leading-tight line-clamp-1 ${
                            isCurrent ? 'text-blue-700' : 'text-slate-800 group-hover:text-blue-600'
                          }`}>
                            {tool.name}
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <a
                      href="/"
                      onClick={(e) => handleSelectTab(e, 'home')}
                      className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      View All Tools Page
                    </a>
                    <span className="text-emerald-700 font-medium">100% Free</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Hamburger Toggle Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              className={`lg:hidden p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                isMobileMenuOpen
                  ? 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-500/20'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Mobile / Tablet Responsive Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          ref={mobileMenuRef}
          className="lg:hidden border-t border-slate-200 bg-white max-h-[calc(100vh-4.5rem)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">
            
            {/* Quick Home Link */}
            <a
              id="mobile-nav-home"
              href="/"
              onClick={(e) => handleSelectTab(e, 'home')}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home & All Tools</span>
            </a>

            {/* Tools Accordion Section */}
            <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50 space-y-3">
              <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={() => setMobileToolsExpanded(!mobileToolsExpanded)}
              >
                <div className="flex items-center space-x-2">
                  <LayoutGrid className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    All Tools ({ALL_TOOLS_FLAT.length})
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 flex items-center space-x-1"
                  aria-label="Toggle tools list"
                >
                  <span>{mobileToolsExpanded ? 'Hide' : 'Show All'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      mobileToolsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileToolsExpanded && (
                <div className="space-y-4 pt-1">
                  {TOOL_CATEGORIES.map((category) => {
                    const CategoryIcon = category.icon;
                    return (
                      <div key={category.title} className="space-y-1.5">
                        <div className="flex items-center space-x-1.5 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <CategoryIcon className="w-3 h-3 text-slate-500" />
                          <span>{category.title}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {category.items.map((tool) => {
                            const Icon = tool.icon;
                            const targetPath = getPathForTab(tool.id);
                            const isCurrent = activeTab === tool.id || (tool.id === 'background-remover' && activeTab === 'bg-remover');

                            return (
                              <a
                                key={tool.id}
                                id={`mobile-tool-${tool.id}`}
                                href={targetPath}
                                onClick={(e) => handleSelectTab(e, tool.id)}
                                className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all cursor-pointer min-h-[44px] ${
                                  isCurrent
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                                }`}
                              >
                                <div
                                  className={`p-1.5 rounded-lg border shrink-0 ${
                                    isCurrent
                                      ? 'bg-white/20 border-white/30 text-white'
                                      : `${tool.iconBg} ${tool.iconColor}`
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="text-xs font-bold truncate">
                                      {tool.name}
                                    </span>
                                    {tool.badge && !isCurrent && (
                                      <span
                                        className={`text-[9px] font-extrabold px-1 py-0.2 rounded border shrink-0 ${tool.badgeColor}`}
                                      >
                                        {tool.badge}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Navigation Links in Mobile */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                id="mobile-nav-blog"
                href="/blog/"
                onClick={(e) => handleSelectTab(e, 'blog')}
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                  activeTab === 'blog'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Blog Articles</span>
              </a>

              <a
                id="mobile-nav-faq"
                href="/faq/"
                onClick={(e) => handleSelectTab(e, 'faq')}
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                  activeTab === 'faq'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
                <span>FAQ & Help</span>
              </a>

              <a
                id="mobile-nav-about"
                href="/about/"
                onClick={(e) => handleSelectTab(e, 'about')}
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                  activeTab === 'about'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <span>About Us</span>
              </a>

              <a
                id="mobile-nav-contact"
                href="/contact/"
                onClick={(e) => handleSelectTab(e, 'contact')}
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Legal & Pricing Links Footer in Mobile Menu */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-2 justify-between text-[11px] text-slate-500">
              <a
                href="/privacy/"
                onClick={(e) => handleSelectTab(e, 'privacy')}
                className="hover:text-blue-600 cursor-pointer"
              >
                Privacy
              </a>
              <span>•</span>
              <a
                href="/terms/"
                onClick={(e) => handleSelectTab(e, 'terms')}
                className="hover:text-blue-600 cursor-pointer"
              >
                Terms
              </a>
              <span>•</span>
              <a
                href="/cookies/"
                onClick={(e) => handleSelectTab(e, 'cookies')}
                className="hover:text-blue-600 cursor-pointer"
              >
                Cookies
              </a>
              <span>•</span>
              <a
                href="/pricing/"
                onClick={(e) => handleSelectTab(e, 'pricing')}
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Free Forever
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
