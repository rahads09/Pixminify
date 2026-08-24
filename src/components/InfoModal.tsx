import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Mail,
  Info,
  Cookie,
  HelpCircle,
  Sparkles,
  Send,
  CheckCircle2,
  Lock,
  Zap,
} from 'lucide-react';

export type ModalType =
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'faq'
  | 'pricing'
  | null;

interface InfoModalProps {
  type: ModalType;
  onClose: () => void;
  onSelectTool?: (tab: any) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, onSelectTool }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
  };

  return (
    <div
      id="info-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            {type === 'about' && (
              <>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">About Pixminify</h3>
                  <p className="text-xs text-slate-500">100% Private, Client-Side Image Suite</p>
                </div>
              </>
            )}
            {type === 'contact' && (
              <>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Contact & Support</h3>
                  <p className="text-xs text-slate-500">We'd love to hear your feedback and feature requests</p>
                </div>
              </>
            )}
            {type === 'privacy' && (
              <>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Privacy Policy</h3>
                  <p className="text-xs text-slate-500">Zero Server Uploads & Total Local Privacy</p>
                </div>
              </>
            )}
            {type === 'terms' && (
              <>
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Terms & Conditions</h3>
                  <p className="text-xs text-slate-500">Usage terms for free personal & commercial use</p>
                </div>
              </>
            )}
            {type === 'cookies' && (
              <>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Cookies Policy</h3>
                  <p className="text-xs text-slate-500">Cookie usage & client-side local storage</p>
                </div>
              </>
            )}
            {type === 'faq' && (
              <>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-500">Common questions about image processing</p>
                </div>
              </>
            )}
            {type === 'pricing' && (
              <>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">100% Free Forever</h3>
                  <p className="text-xs text-slate-500">No subscriptions, no hidden limits, no paywalls</p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed max-h-[70vh]">
          {/* ABOUT CONTENT */}
          {type === 'about' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-900 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>The Pixminify Mission</span>
                </h4>
                <p className="text-xs text-blue-950">
                  Pixminify was engineered to provide photographers, web developers, designers, and everyday users with an enterprise-grade image optimization suite that runs entirely on your device.
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-base">Key Highlights:</h4>
              <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-600">
                <li><strong className="text-slate-900">100% Client-Side Engine:</strong> All compression, format conversion, cropping, and PDF creation happens in your browser’s RAM.</li>
                <li><strong className="text-slate-900">Zero Server Uploads:</strong> Your images are never sent over the wire to remote servers.</li>
                <li><strong className="text-slate-900">Unlimited Usage:</strong> No file quantity restrictions, watermarking on compression, or forced registrations.</li>
                <li><strong className="text-slate-900">Modern Codecs:</strong> Full support for WebP, AVIF, JPEG, and PNG.</li>
              </ul>
            </div>
          )}

          {/* CONTACT CONTENT */}
          {type === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Feature request, bug report, or feedback"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your thoughts or issues here..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Direct Email: <strong className="text-slate-800 font-mono">support@pixminify.com</strong>
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* PRIVACY POLICY CONTENT */}
          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start space-x-3">
                <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="block text-emerald-900 font-bold mb-0.5">Absolute Client-Side Privacy Guarantee</strong>
                  Pixminify operates entirely within your browser memory. We have zero servers that store, receive, or process your image files.
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Information We Collect</h4>
                <p className="text-xs text-slate-600">
                  We do not collect or store any personal data or uploaded photos. Any configuration changes (e.g. compression quality slider) are kept in your browser's local memory and are never transmitted.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Local Storage</h4>
                <p className="text-xs text-slate-600">
                  We use standard HTML5 local storage only to remember user interface preferences (such as selected theme or last used quality settings).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">3. Third-Party Advertisements</h4>
                <p className="text-xs text-slate-600">
                  We may serve non-intrusive banner advertisements via Google AdSense to cover development costs. Google AdSense may use standardized advertising cookies in compliance with GDPR/CCPA regulations.
                </p>
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {type === 'terms' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. Terms of Use</h4>
                <p className="text-xs text-slate-600">
                  By accessing and using Pixminify, you agree to these terms. The application is provided free of charge for both individual and commercial projects.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. Intellectual Property</h4>
                <p className="text-xs text-slate-600">
                  You retain 100% ownership and copyright of all photos, graphics, and documents processed using Pixminify. Pixminify claims no rights or access to your media.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">3. Disclaimer</h4>
                <p className="text-xs text-slate-600">
                  The tools are provided "as is" without warranty of any kind. Users are advised to keep backups of original files before compression or batch operations.
                </p>
              </div>
            </div>
          )}

          {/* COOKIES POLICY */}
          {type === 'cookies' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">What Cookies Do We Use?</h4>
                <p className="text-xs text-slate-600">
                  Pixminify does not set any first-party tracking cookies. We only rely on local client state to preserve tool configuration across page reloads.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Managing Cookie Preferences</h4>
                <p className="text-xs text-slate-600">
                  You can clear your browser's cache and local storage at any time via your browser settings.
                </p>
              </div>
            </div>
          )}

          {/* FAQ */}
          {type === 'faq' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 text-xs mb-1">Are my photos uploaded to any servers?</h5>
                <p className="text-xs text-slate-600">No. Every operation happens 100% inside your browser using HTML5 Canvas & WebAssembly.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 text-xs mb-1">Is there any limit on file size or batch quantity?</h5>
                <p className="text-xs text-slate-600">There are no artificial limits. You can process dozens of high-res images directly within your machine's hardware capabilities.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 text-xs mb-1">Which format gives the best compression?</h5>
                <p className="text-xs text-slate-600">WebP and AVIF formats generally achieve 30% to 70% smaller file sizes than traditional JPEG and PNG with equivalent visual clarity.</p>
              </div>
            </div>
          )}

          {/* PRICING */}
          {type === 'pricing' && (
            <div className="text-center py-4 space-y-4">
              <div className="inline-block p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-3xl font-black text-emerald-700">$0 / mo</span>
                <p className="text-xs text-emerald-800 font-semibold mt-1">Free Forever & Unlimited</p>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No credit cards, no tier upgrades, and no subscription traps. All batch compressors, crop editors, watermark tools, and PDF builders are completely free.
              </p>

              {onSelectTool && (
                <button
                  onClick={() => {
                    onClose();
                    onSelectTool('compress');
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Start Using Free Tools
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
