import React, { useState } from 'react';
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Clock,
  Shield,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AdBanner } from '../AdBanner';

interface ContactPageProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onSelectTab }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Feedback / Feature Request',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
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

        <span className="text-xs font-semibold text-slate-500">Contact & Support</span>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-2xs">
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span>We'd Love to Hear From You</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Get in Touch with{' '}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 bg-clip-text text-transparent">
            Pixminify
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          Have an idea for a new photo tool, found a bug, or have a partnership inquiry? Drop our team a message below.
        </p>
      </div>

      {/* Top Google Ads Banner */}
      <AdBanner format="leaderboard" className="max-w-4xl mx-auto" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 w-fit">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Direct Email</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For security disclosures, press, or enterprise inquiries, contact:
            </p>
            <a
              href="mailto:findrtalent@gmail.com"
              className="text-xs font-bold text-blue-600 hover:underline block break-all"
            >
              findrtalent@gmail.com
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Response Time</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our dev team typically reviews and replies to all inquiries within 24 to 48 business hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 w-fit">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Quick Help</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Looking for instant answers on compression, file formats, or privacy?
            </p>
            <button
              onClick={() => onSelectTab('faq')}
              className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
            >
              View FAQ & Help Guide →
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 p-8 rounded-2xl bg-white border border-slate-300 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out, <strong className="text-slate-900">{formData.name}</strong>. Our engineering team has received your message and will review it promptly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'Feedback / Feature Request', message: '' });
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic / Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
                >
                  <option value="Feedback / Feature Request">Feedback / Feature Request</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Upcoming Tool Suggestion">Upcoming Tool Suggestion</option>
                  <option value="Commercial / Partnership">Commercial / Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you with Pixminify?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto" />
    </div>
  );
};
