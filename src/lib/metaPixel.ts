declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

const isDebug = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("meta_debug");

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    if (isDebug()) {
      console.warn(`[MetaPixel] fbq not available — skipped "${eventName}"`);
    }
    return;
  }

  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }

  if (isDebug()) {
    console.log(`[MetaPixel] Fired "${eventName}"`, params ?? "");
  }
}
