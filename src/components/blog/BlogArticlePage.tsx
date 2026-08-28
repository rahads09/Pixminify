import React, { useState } from 'react';
import {
  ChevronRight,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  ListOrdered,
  BookOpen,
} from 'lucide-react';
import { BlogArticle, ActiveTab } from '../../types';
import { getRelatedArticles } from '../../data/blogArticles';
import { AdBanner, AdInArticle, AdRectangle } from '../AdBanner';

interface BlogArticlePageProps {
  article: BlogArticle;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectArticle: (slug: string) => void;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({
  article,
  onSelectTab,
  onSelectArticle,
}) => {
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const relatedArticles = getRelatedArticles(article, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Read "${article.title}" on Pixminify:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <article className="space-y-10 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 overflow-x-auto">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('home');
            }}
            className="hover:text-blue-600 transition-colors shrink-0"
          >
            Home
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <a
            href="/blog/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('blog');
            }}
            className="hover:text-blue-600 transition-colors shrink-0"
          >
            Blog
          </a>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-500 shrink-0">{article.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        <a
          href="/blog/"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('blog');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Guides</span>
        </a>
      </div>

      {/* Header / Hero Section */}
      <header className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            {article.category}
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{article.readingTime}</span>
          </span>
          <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Published {article.publishDate}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Lead paragraph */}
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200">
          {article.content.intro}
        </p>

        {/* Author details & Social Share */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{article.author.name}</div>
              <div className="text-[11px] text-slate-500">{article.author.role}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center space-x-1">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share:</span>
            </span>
            <button
              onClick={handleShareTwitter}
              title="Share on Twitter / X"
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer text-xs font-bold"
            >
              X / Twitter
            </button>
            <button
              onClick={handleShareLinkedIn}
              title="Share on LinkedIn"
              className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer text-xs font-bold"
            >
              LinkedIn
            </button>
            <button
              onClick={handleCopyLink}
              title="Copy Link to Clipboard"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center space-x-1 cursor-pointer text-xs font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <span>Copy Link</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout with Sticky / Floating Table of Contents */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Table of Contents (Desktop Sidebar) */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="sticky top-24 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Table of Contents</span>
            </div>
            <nav className="space-y-1.5 text-xs">
              {article.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block py-1 px-2.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 transition-colors font-medium"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            {/* Quick Tool Callout in Sidebar */}
            <div className="pt-4 border-t border-slate-200">
              <div className="p-4 rounded-xl bg-blue-600 text-white space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-blue-200">
                  Recommended Tool
                </div>
                <div className="text-xs font-bold">{article.relatedToolName}</div>
                <p className="text-[11px] text-blue-100">
                  100% Free & In-Browser
                </p>
                <a
                  href={`/${article.relatedToolTab}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectTab(article.relatedToolTab);
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-white hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Sidebar Ad Placement */}
            <AdRectangle className="hidden lg:flex" />
          </div>
        </aside>

        {/* Article Body Sections */}
        <div className="lg:col-span-8 space-y-12">
          {/* Mobile Collapsible Table of Contents */}
          <div className="block lg:hidden p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Quick Navigation</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
              {article.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="py-1 px-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>

          {/* Top Banner Ad Placement */}
          <AdBanner format="horizontal" className="my-2" />

          {/* Render Sections */}
          {article.content.sections.map((section, sIdx) => (
            <React.Fragment key={section.id}>
              <section
                id={section.id}
                className="space-y-4 pt-6 scroll-mt-24 border-t border-slate-100 first:border-0 first:pt-0"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {section.title}
                </h2>

                {section.subtitle && (
                  <p className="text-sm font-semibold text-blue-600">
                    {section.subtitle}
                  </p>
                )}

                {/* Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                  {section.body.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Bullet Points if any */}
                {section.bulletPoints && (
                  <ul className="space-y-2 pl-4 text-sm sm:text-base text-slate-700">
                    {section.bulletPoints.map((bp, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Table if any */}
                {section.table && (
                  <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <tr>
                          {section.table.headers.map((header, idx) => (
                            <th key={idx} className="px-4 py-3">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {section.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                          >
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-3 font-medium text-slate-700">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Step List if any */}
                {section.stepList && (
                  <div className="space-y-4 my-6">
                    {section.stepList.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {step.description}
                          </p>
                          {step.stepNumber === 1 && (
                            <div className="pt-1">
                              <a
                                href={`/${article.relatedToolTab}/`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onSelectTab(article.relatedToolTab);
                                }}
                                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all border border-blue-200 shadow-2xs"
                              >
                                <span>Open {article.relatedToolName}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tip Box */}
                {section.proTip && (
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start space-x-3.5 my-4">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                        Pro Tip
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-900 mt-1 leading-relaxed font-medium">
                        {section.proTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Warning Box */}
                {section.warning && (
                  <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start space-x-3.5 my-4">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800">
                        Important Consideration
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed font-medium">
                        {section.warning}
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Natural in-article ad break after section 2 */}
              {sIdx === 1 && (
                <AdInArticle className="my-6" />
              )}
            </React.Fragment>
          ))}

          {/* Key Takeaways Section */}
          <section id="key-takeaways" className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-4 scroll-mt-24">
            <div className="flex items-center space-x-2 text-blue-900">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-black">Key Takeaways & Summary</h2>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="p-1 rounded-full bg-blue-200 text-blue-800 mt-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Interactive FAQ Section with Schema */}
          <section id="faq" className="space-y-6 pt-6 scroll-mt-24">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-2xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 shrink-0 ml-3 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Dedicated Tool CTA Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4 border border-slate-800">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Direct Tool Access</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {article.ctaHeadline}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {article.ctaDescription}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={`/${article.relatedToolTab}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectTab(article.relatedToolTab);
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md hover:shadow-blue-500/25 flex items-center space-x-2 cursor-pointer"
              >
                <span>{article.ctaButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% In-Browser & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Related Articles Banner Ad Slot */}
      <AdBanner format="horizontal" className="max-w-6xl mx-auto my-6" />

      {/* Related Articles Section */}
      <section className="max-w-6xl mx-auto pt-12 border-t border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">
              Related Articles & Guides
            </h2>
            <p className="text-xs text-slate-500">
              Continue reading to master digital image editing and performance optimization.
            </p>
          </div>
          <a
            href="/blog/"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('blog');
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All Guides →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <div
              key={rel.slug}
              className="group rounded-2xl bg-white border border-slate-200 hover:border-blue-500 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase text-blue-600 tracking-wider">
                  {rel.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  <a
                    href={`/blog/${rel.slug}/`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(rel.slug);
                    }}
                  >
                    {rel.title}
                  </a>
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {rel.excerpt}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{rel.readingTime}</span>
                <a
                  href={`/blog/${rel.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectArticle(rel.slug);
                  }}
                  className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-all flex items-center space-x-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};
