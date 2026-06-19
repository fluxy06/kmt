import { getCookie } from "./cookies";

export const COOKIE_CONSENT_KEY = "kmt_cookie_consent";
export const THEME_COOKIE_KEY = "kmt_theme";

export type CookieConsent = "accepted" | "declined";

export const getCookieConsent = (): CookieConsent | null => {
  const consent = getCookie(COOKIE_CONSENT_KEY);
  return consent === "accepted" || consent === "declined" ? consent : null;
};

export const hasCookieConsent = () => getCookieConsent() === "accepted";
