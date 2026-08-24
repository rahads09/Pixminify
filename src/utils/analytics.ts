// Google Analytics 4 (GA4) Integration for Pixminify
// Measurement ID: G-9XR01T7FHT

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-9XR01T7FHT';

/**
 * Tracks a pageview in Google Analytics 4.
 * Works seamlessly with client-side SPA routing and browser navigation.
 */
export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined') return;

  const pageTitle = title || document.title;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pageLocation = window.location.origin + normalizedPath;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: normalizedPath,
      send_to: GA_MEASUREMENT_ID,
    });
  }
};

/**
 * Safely tracks custom anonymous user action events (zero PII collected)
 */
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, string | number | boolean> = {}
): void => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      send_to: GA_MEASUREMENT_ID,
    });
  }
};
