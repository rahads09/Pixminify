import React from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
  interface ImportMeta {
    env?: Record<string, string>;
  }
}

export interface AdSlotProps {
  /** Google AdSense Publisher ID (defaults to VITE_ADSENSE_CLIENT_ID if present) */
  client?: string;
  /** Google AdSense Ad Unit ID */
  slot?: string;
  /** Layout format (defaults to 'auto') */
  format?: 'auto' | 'horizontal' | 'rectangle' | 'in-article' | 'leaderboard';
  /** Additional container classes */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
  /** Force preview placeholder only in manual debug/dev mode */
  debugPlaceholder?: boolean;
}

/**
 * AdSlot: Responsive, AdSense-ready placeholder component.
 * 
 * - When NO AdSense configuration exists: Remains completely collapsed/hidden (returns null),
 *   creating ZERO empty blank boxes, ZERO layout shift, and ZERO errors.
 * - When AdSense Client ID and Slot ID are later provided: Seamlessly expands into a responsive
 *   AdSense banner container adapting across 320px, 375px, 768px, 1024px, 1440px, and 1920px.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  client = import.meta.env?.VITE_ADSENSE_CLIENT_ID || '',
  slot = import.meta.env?.VITE_ADSENSE_SLOT_ID || '',
  format = 'auto',
  className = '',
  style,
  debugPlaceholder = false,
}) => {
  const hasClient = Boolean(client && client.trim() !== '');
  const hasSlot = Boolean(slot && slot.trim() !== '');

  // Completely collapsed when unconfigured
  if (!hasClient && !hasSlot && !debugPlaceholder) {
    return null;
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 clear-both text-center transition-all ${className}`}
      style={style}
      role="region"
      aria-label="Advertisement"
    >
      {hasClient && hasSlot ? (
        <ins
          className="adsbygoogle block w-full overflow-hidden"
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : debugPlaceholder ? (
        <div className="w-full py-2 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="font-bold text-slate-600">AdSlot (Ready for AdSense)</span>
          <span>Unconfigured • Collapsed in Production</span>
        </div>
      ) : null}
    </div>
  );
};
