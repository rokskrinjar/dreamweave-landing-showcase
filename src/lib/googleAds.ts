declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const CONVERSION_ID = "AW-978271506";

const isDebug = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("google_debug");

export function trackGoogleEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    if (isDebug()) {
      console.warn(`[GoogleAds] gtag not available — skipped "${eventName}"`);
    }
    return;
  }

  window.gtag("event", eventName, params);

  if (isDebug()) {
    console.log(`[GoogleAds] Fired "${eventName}"`, params ?? "");
  }
}

export function trackGoogleConversion(
  conversionLabel?: string,
  params?: Record<string, unknown>,
) {
  trackGoogleEvent("conversion", {
    send_to: conversionLabel
      ? `${CONVERSION_ID}/${conversionLabel}`
      : CONVERSION_ID,
    ...params,
  });
}
