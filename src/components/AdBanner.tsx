import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
  interface ImportMeta {
    env?: Record<string, string>;
  }
}

export type AdFormat =
  | 'auto'
  | 'horizontal'
  | 'rectangle'
  | 'in-article'
  | 'leaderboard'
  | 'vertical'
  | 'multiplex';

export interface AdSenseProps {
  /** Google AdSense Publisher ID (e.g. 'ca-pub-1234567890123456') */
  client?: string;
  /** Google AdSense Ad Unit ID (e.g. '1234567890') */
  slot?: string;
  /** Ad unit layout format */
  format?: AdFormat;
  /** Optional layout parameter (e.g., 'in-article') */
  layout?: string;
  /** Optional layout key for native responsive in-feed/in-article ads */
  layoutKey?: string;
  /** Enable full-width responsive ad units on mobile devices */
  fullWidthResponsive?: boolean;
  /** Container CSS classes */
  className?: string;
  /** Inline container styles */
  style?: React.CSSProperties;
  /**
   * Set to true only if you want to preview the slot outline in dev/staging.
   * Defaults to false (keeps empty slots completely collapsed & unobtrusive).
   */
  debugPlaceholder?: boolean;
  /** Accessible label */
  ariaLabel?: string;
}

/**
 * Helper to dynamically load the AdSense script tag only once when a valid client ID is present.
 */
function ensureAdSenseScriptLoaded(clientId: string): void {
  if (typeof document === 'undefined' || !clientId) return;
  const scriptId = 'google-adsense-script';
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    clientId
  )}`;
  document.head.appendChild(script);
}

/**
 * Reusable Google AdSense Component.
 * - Safely integrates Google AdSense responsive ad units with React lifecycle
 * - Automatically collapses empty/unfilled ad slots to prevent blank space and layout shift
 * - Completely unmounted (returns null) when VITE_ADSENSE_CLIENT_ID is unset, ensuring zero layout shift or errors
 * - Expands seamlessly once live ads are connected and served
 */
export const AdSense: React.FC<AdSenseProps> = ({
  client = import.meta.env?.VITE_ADSENSE_CLIENT_ID || '',
  slot = '',
  format = 'auto',
  layout,
  layoutKey,
  fullWidthResponsive = true,
  className = '',
  style,
  debugPlaceholder = false,
  ariaLabel = 'Advertisement',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);
  const [adStatus, setAdStatus] = useState<'idle' | 'filled' | 'unfilled'>('idle');

  // If no AdSense client ID or slot is configured and debug mode is off, collapse completely
  const hasClient = Boolean(client && client.trim() !== '');
  const hasSlot = Boolean(slot && slot.trim() !== '');

  // When unconfigured and not in debug placeholder mode, render absolutely nothing
  if (!hasClient && !hasSlot && !debugPlaceholder) {
    return null;
  }

  // Map format presets to AdSense standard attributes
  const getFormatAttributes = () => {
    switch (format) {
      case 'horizontal':
      case 'leaderboard':
        return {
          adFormat: 'horizontal,auto',
          layoutStyle: { display: 'block' },
        };
      case 'rectangle':
        return {
          adFormat: 'rectangle,auto',
          layoutStyle: { display: 'inline-block', minWidth: '300px' },
        };
      case 'in-article':
        return {
          adFormat: 'fluid',
          adLayout: layout || 'in-article',
          layoutStyle: { display: 'block', textAlign: 'center' as const },
        };
      case 'vertical':
        return {
          adFormat: 'vertical,auto',
          layoutStyle: { display: 'inline-block', minWidth: '160px' },
        };
      case 'multiplex':
        return {
          adFormat: 'autorelaxed',
          layoutStyle: { display: 'block' },
        };
      case 'auto':
      default:
        return {
          adFormat: 'auto',
          layoutStyle: { display: 'block' },
        };
    }
  };

  const { adFormat, adLayout, layoutStyle } = getFormatAttributes();

  useEffect(() => {
    if (!hasClient && !hasSlot) return;

    // Load official AdSense script if client ID is specified
    if (client) {
      ensureAdSenseScriptLoaded(client);
    }

    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch {
      // Gracefully ignore ad blocker or sandboxed network interruptions
    }

    // Monitor for AdSense status changes on the ins element
    const currentAdRef = adRef.current;
    if (currentAdRef) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-ad-status'
          ) {
            const status = currentAdRef.getAttribute('data-ad-status');
            if (status === 'filled') {
              setAdStatus('filled');
            } else if (status === 'unfilled') {
              setAdStatus('unfilled');
            }
          }
        });
      });

      observer.observe(currentAdRef, { attributes: true });

      return () => {
        observer.disconnect();
      };
    }
  }, [hasClient, hasSlot, client]);

  // If ad status is unfilled and debug is off, keep slot collapsed/unobtrusive
  if (adStatus === 'unfilled' && !debugPlaceholder) {
    return null;
  }

  // Developer preview placeholder mode (only active if explicitly requested via debugPlaceholder=true)
  if (debugPlaceholder && !hasClient && !hasSlot) {
    return (
      <div
        className={`adsense-slot-container my-4 clear-both w-full flex flex-col items-center justify-center ${className}`}
        aria-label={ariaLabel}
        style={style}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1 select-none">
          {ariaLabel} (Preview)
        </span>
        <div className="w-full max-w-4xl py-3 px-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] font-bold text-slate-700">
              AdSense
            </span>
            <span>
              Format: <strong className="text-slate-700">{format}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {slot ? `Slot: ${slot}` : 'Unconnected (Collapsed in Prod)'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`adsense-slot-container w-full clear-both text-center ${
        adStatus === 'filled' ? 'my-4' : 'my-0'
      } ${className}`}
      aria-label={ariaLabel}
      role="region"
      style={style}
    >
      {adStatus === 'filled' && (
        <div className="text-[9px] uppercase font-bold tracking-wider text-slate-400 mb-1 select-none text-center">
          {ariaLabel}
        </div>
      )}

      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          ...layoutStyle,
          overflow: 'hidden',
        }}
        data-ad-client={client || undefined}
        data-ad-slot={slot || undefined}
        data-ad-format={adFormat}
        data-ad-layout={adLayout || layout || undefined}
        data-ad-layout-key={layoutKey || undefined}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};

export const AdSenseSlot = AdSense;

/**
 * Standard Responsive Horizontal Banner / Leaderboard (728x90 / 320x50 Responsive)
 */
export const AdBanner: React.FC<AdSenseProps> = ({
  format = 'horizontal',
  className = '',
  ...props
}) => {
  return (
    <AdSense
      format={format === 'leaderboard' ? 'leaderboard' : 'horizontal'}
      className={className}
      {...props}
    />
  );
};

/**
 * Responsive Medium/Large Rectangle Ad Slot (300x250 / 336x280)
 */
export const AdRectangle: React.FC<AdSenseProps> = ({
  className = '',
  ...props
}) => {
  return (
    <AdSense
      format="rectangle"
      className={`max-w-[336px] mx-auto ${className}`}
      {...props}
    />
  );
};

/**
 * Native Fluid In-Article Ad Slot for Blog & Long-form Content
 */
export const AdInArticle: React.FC<AdSenseProps> = ({
  className = '',
  ...props
}) => {
  return (
    <AdSense
      format="in-article"
      className={`max-w-3xl mx-auto ${className}`}
      {...props}
    />
  );
};

/**
 * Desktop Leaderboard Ad Slot (728x90 Responsive)
 */
export const AdLeaderboard: React.FC<AdSenseProps> = ({
  className = '',
  ...props
}) => {
  return (
    <AdSense
      format="leaderboard"
      className={`max-w-4xl mx-auto ${className}`}
      {...props}
    />
  );
};

/**
 * Bottom Pre-Footer Ad Placement
 */
export const AdFooter: React.FC<AdSenseProps> = ({
  className = '',
  ...props
}) => {
  return (
    <AdSense
      format="horizontal"
      className={`max-w-5xl mx-auto ${className}`}
      {...props}
    />
  );
};

export default AdSense;
