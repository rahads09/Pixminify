import React, { useState } from 'react';
import { BookOpen, Gauge } from 'lucide-react';
import { AdBanner } from './AdBanner';

export const FormatGuide: React.FC = () => {
  const [monthlyViews, setMonthlyViews] = useState(50000);
  const [avgImageCount, setAvgImageCount] = useState(10);

  // Calculate bandwidth savings
  const avgUncompressedKB = 1800; // 1.8MB original payload
  const avgCompressedKB = 220; // 220KB with Pixminify WebP/AVIF (88% reduction)
  const savingsPerViewMB = (avgUncompressedKB - avgCompressedKB) * avgImageCount / 1024;
  const monthlyBandwidthSavedGB = Math.round((savingsPerViewMB * monthlyViews) / 1024);
  const estimatedTimeSavedSec = 2.4; // Average seconds saved on mobile 4G

  const formats = [
    {
      name: 'WebP',
      badge: 'Recommended for Web',
      savings: '60% - 85%',
      browserSupport: '98.5% (Chrome, Safari, Firefox, Edge)',
      transparency: true,
      animation: true,
      bestFor: 'Modern websites, blogs, e-commerce, and hero banners.',
    },
    {
      name: 'AVIF',
      badge: 'Maximum Compression',
      savings: '75% - 93%',
      browserSupport: '93.2% (Modern Chrome, Firefox, Safari 16+)',
      transparency: true,
      animation: true,
      bestFor: 'High-traffic websites looking for maximum speed scores (PageSpeed 95+).',
    },
    {
      name: 'JPEG / JPG',
      badge: 'Universal Standard',
      savings: '30% - 60%',
      browserSupport: '100% (All devices)',
      transparency: false,
      animation: false,
      bestFor: 'Legacy systems, email marketing templates, and print proofs.',
    },
    {
      name: 'PNG',
      badge: 'Lossless & Sharp',
      savings: '20% - 40%',
      browserSupport: '100% (All devices)',
      transparency: true,
      animation: false,
      bestFor: 'Logos, icons, UI screenshots, and diagrams requiring sharp vector-like edges.',
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Image Optimization Guide & Speed Calculator</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Choose the Right Image Format & Skyrocket PageSpeed
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Images make up over 65% of the average webpage payload. Modern formats like WebP and AVIF drastically reduce bandwidth and accelerate mobile load times.
        </p>
      </div>

      {/* Interactive Bandwidth & Speed Impact Calculator */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-xs">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Interactive Website Speed & Bandwidth Impact Calculator
            </h3>
            <p className="text-xs text-slate-600">
              Estimate monthly CDN data savings and load time reduction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-2">
                <span>Monthly Pageviews:</span>
                <span className="font-mono font-bold text-blue-600">{monthlyViews.toLocaleString()} views</span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={monthlyViews}
                onChange={(e) => setMonthlyViews(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-700 mb-2">
                <span>Images Per Page:</span>
                <span className="font-mono font-bold text-blue-600">{avgImageCount} images</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={avgImageCount}
                onChange={(e) => setAvgImageCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Impact Stats Card */}
          <div className="p-5 rounded-xl bg-sky-50/60 border border-sky-100 flex flex-col justify-center space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Monthly CDN Saved</div>
                <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-mono">
                  ~{monthlyBandwidthSavedGB} GB
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Faster Page Load</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
                  -{estimatedTimeSavedSec}s
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 pt-2 border-t border-sky-200/60">
              ⚡ Accelerates Largest Contentful Paint (LCP) and boosts Google Search ranking factors.
            </div>
          </div>
        </div>
      </div>

      {/* Mid-Guide Ad Placement */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-4" />

      {/* Format Comparison Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Detailed Format Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((fmt) => (
            <div
              key={fmt.name}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-slate-900">{fmt.name}</div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {fmt.badge}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Compression Ratio:</span>
                    <span className="font-mono font-bold text-emerald-600">{fmt.savings}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Browser Support:</span>
                    <span className="text-slate-700">{fmt.browserSupport}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Alpha Transparency:</span>
                    <span className="text-slate-700 font-bold">
                      {fmt.transparency ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-blue-600">Best for: </span>
                {fmt.bestFor}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Guide Ad Placement */}
      <AdBanner format="horizontal" className="max-w-4xl mx-auto my-6" />
    </div>
  );
};
