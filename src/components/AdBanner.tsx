import React from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'leaderboard' | 'rectangle' | 'compact';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 ${className}`}>
      {/* Tiny subtle Advertisement tag */}
      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5 select-none">
        Advertisement
      </span>

      {/* Ad Container */}
      <div
        className={`w-full border border-dashed border-slate-300 rounded-xl bg-slate-50/80 overflow-hidden flex flex-col items-center justify-center p-3 transition-colors hover:border-slate-400 ${
          format === 'leaderboard'
            ? 'min-h-[90px] max-w-4xl'
            : format === 'rectangle'
            ? 'min-h-[250px] max-w-sm'
            : format === 'compact'
            ? 'min-h-[60px] max-w-xl'
            : 'min-h-[90px] max-w-5xl'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between w-full px-4 py-2 gap-2 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black shrink-0">
              Ad
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Google AdSense Placement Area
              </div>
              <div className="text-[11px] text-slate-500">
                Responsive Banner Slot • Clean & Privacy-Friendly
              </div>
            </div>
          </div>
          <div className="text-[11px] font-mono font-medium text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
            728×90 / Responsive
          </div>
        </div>
      </div>
    </div>
  );
};
