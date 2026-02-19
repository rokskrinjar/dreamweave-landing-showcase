/**
 * Navigate to an external URL, handling both iframe (preview) and standalone contexts.
 * In an iframe, Stripe pages block embedding, so we open in a new tab.
 * In production (no iframe), we redirect in the same tab.
 */
export const navigateToExternal = (url: string) => {
  const isInIframe = window.self !== window.top;
  if (isInIframe) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
};
