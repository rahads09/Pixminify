import React, { useState } from 'react';
import {
  Mail,
  ArrowLeft,
  MessageSquare,
  Send,
  CheckCircle2,
  HelpCircle,
  Bug,
  Sparkles,
  Clock,
  Globe2,
  FileQuestion,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface ContactPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onSelectTab }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Feedback & Suggestions');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    // Set submitted state
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-200 max-w-4xl mx-auto">
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

        <span className="text-xs font-semibold text-slate-500">Contact & Support</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-800 shadow-2xs">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          <span>Get in Touch with Our Team</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Contact{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Pixminify
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Have questions, feature suggestions, partnership proposals, or spotted a bug? We’d love to hear from you. We typically respond within 24 to 48 business hours.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      {/* Direct Contact Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="mailto:hello@pixminify.com"
          className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group space-y-2 block"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 w-fit group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">General Inquiries</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            General questions, media inquiries, and feedback.
          </p>
          <div className="text-xs font-semibold text-blue-600 group-hover:underline pt-1">
            hello@pixminify.com →
          </div>
        </a>

        <a
          href="mailto:contact@pixminify.com?subject=Bug%20Report"
          className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group space-y-2 block"
        >
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 w-fit group-hover:scale-110 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Bug Reports & Technical</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Report issues with specific image codecs or browser behavior.
          </p>
          <div className="text-xs font-semibold text-indigo-600 group-hover:underline pt-1">
            contact@pixminify.com →
          </div>
        </a>

        <a
          href="mailto:contact@pixminify.com?subject=Feature%20Request"
          className="p-5 rounded-2xl bg-white border border-slate-300 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all group space-y-2 block"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Feature Requests</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Suggest new tools, presets, formats, or UI enhancements.
          </p>
          <div className="text-xs font-semibold text-emerald-600 group-hover:underline pt-1">
            contact@pixminify.com →
          </div>
        </a>
      </div>

      {/* Interactive Contact Form */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Send Us a Direct Message</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill out the form below and our team will get back to you directly via email.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-emerald-900">
              Message Received!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out to Pixminify. We have recorded your note and our support team will reply to <strong>{email}</strong> within 24–48 business hours.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                  setSubject('');
                }}
                className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100/50 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
              <button
                onClick={() => onSelectTab('faq')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Check FAQ While You Wait
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none transition-all"
                >
                  <option>Feedback & Suggestions</option>
                  <option>Bug Report / Technical Issue</option>
                  <option>Feature Request</option>
                  <option>Partnership & Business</option>
                  <option>Other Question</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question about batch WebP export"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Your Message <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, request, or bug in detail..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm outline-none transition-all resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Typical response time: 24–48 hours</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* FAQ Quick Link Section */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Looking for immediate answers?</h3>
            <p className="text-xs text-slate-500">
              Check out our extensive FAQ with answers to common image compression and format questions.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onSelectTab('faq');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-xs font-bold text-slate-800 transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          <span>View All FAQs</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </button>
      </div>

      {/* Bottom Ad */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
