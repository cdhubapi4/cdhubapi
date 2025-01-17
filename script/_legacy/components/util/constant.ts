const HOST = typeof window != "undefined" ? `${window.location.origin}` : "https://space-chat.io";

export const PRODUCTION_URL = HOST;
export const isApp =
  typeof window != "undefined" ? window.location.href.includes("https://arbitor.space-chat.io") : false;
export const BASE_URL = isApp ? "https://arbitor.space-chat.io" : HOST;
export const isPWA =
  typeof window != "undefined"
    ? window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone
    : false;
