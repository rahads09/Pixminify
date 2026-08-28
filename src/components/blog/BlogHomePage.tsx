import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { BlogArticle, BlogCategory, ActiveTab } from '../../types';
import { BLOG_ARTICLES, BLOG_CATEGORIES } from '../../data/blogArticles';
import { AdBanner } from '../AdBanner';

interface BlogHomePageProps {
  onSelectArticle: (slug: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BlogHomePage: React.FC<BlogHomePageProps> = ({
  onSelectArticle,
  onSelectTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    return BLOG_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticle = BLOG_ARTICLES[0]; // How to compress images

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('home');
          }}
          className="hover:text-blue-600 transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-bold">Blog & Guides</span>
      </nav>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Educational Guides & Image Science</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Pixminify Blog
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Helpful guides, tutorials, tips, and practical resources for editing, optimizing, converting, and working with images.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides by title, format, or topic (e.g. WebP, crop, resize)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Guides ({BLOG_ARTICLES.length})
          </button>
          {BLOG_CATEGORIES.map((cat) => {
            const count = BLOG_ARTICLES.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Guides Section (When not searching and viewing All) */}
      {!searchQuery && selectedCategory === 'All' && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900">Featured Guides</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_ARTICLES.slice(0, 3).map((article) => (
              <div
                key={`featured-${article.slug}`}
                className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 shadow-lg overflow-hidden border border-slate-700/50 flex flex-col justify-between"
              >
                <div className="absolute right-0 top-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30">
                    <span>{article.category}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    <a
                      href={`/blog/${article.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectArticle(article.slug);
                      }}
                      className="hover:text-blue-300 transition-colors"
                    >
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="relative z-10 pt-4 mt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readingTime}</span>
                  </span>
                  <a
                    href={`/blog/${article.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(article.slug);
                    }}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ad Placement */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-4" />

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-black text-slate-900">
              {selectedCategory === 'All' ? 'All Published Guides' : `${selectedCategory} Guides`}
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
              {filteredArticles.length}
            </span>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching guides found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search keywords or choosing a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Visual Header Banner */}
                <div className={`h-32 bg-gradient-to-br ${article.coverGradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/90 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      {article.category}
                    </span>
                    <span className="text-[11px] font-semibold text-white/80 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readingTime}</span>
                    </span>
                  </div>
                  <div className="text-white/90 font-bold text-xs flex items-center space-x-1 relative z-10">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pixminify Studio Guide</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.publishDate}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      <a
                        href={`/blog/${article.slug}/`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectArticle(article.slug);
                        }}
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      By {article.author.name}
                    </span>
                    <a
                      href={`/blog/${article.slug}/`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectArticle(article.slug);
                      }}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Trust & Privacy Guarantee Section */}
      <section className="max-w-6xl mx-auto p-8 rounded-3xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">100% In-Browser Privacy</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Every tool demonstrated in these guides processes your photos client-side with zero cloud uploads.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Instant Performance</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Hardware-accelerated WebAssembly and Canvas ensure batch jobs complete in milliseconds.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Completely Free Forever</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              No account registrations, no subscriptions, and no watermarks added to your images.
            </p>
          </div>
        </div>
      </section>

      {/* Pre-Footer Banner Ad Slot */}
      <AdBanner format="horizontal" className="max-w-5xl mx-auto" />
    </div>
  );
};
