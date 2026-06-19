import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  initAnalyticsLifecycle,
  trackEvent,
  trackPageView,
  trackScrollDepth,
} from "../../shared/lib/analytics";
import { hasCookieConsent } from "../../shared/lib/cookieConsent";

const getScrollPercent = () => {
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  if (height <= 0) return 0;
  return (scrollTop / height) * 100;
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalyticsLifecycle();
  }, []);

  useEffect(() => {
    if (!hasCookieConsent()) return;
    trackPageView(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!hasCookieConsent()) return;

    let scrollTicking = false;

    const onScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.setTimeout(() => {
        trackScrollDepth(getScrollPercent());
        scrollTicking = false;
      }, 250);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (anchor?.href.startsWith("tel:")) {
        trackEvent("phone_click", location.pathname);
        trackEvent("lead_submit", location.pathname);
      }
      if (anchor?.href.startsWith("mailto:")) {
        trackEvent("email_click", location.pathname);
        trackEvent("lead_submit", location.pathname);
      }

      const button = target.closest("button");
      const buttonText = button?.textContent?.toLowerCase() || "";
      if (buttonText.includes("рассчитать")) {
        trackEvent("calculator_open", location.pathname);
        trackEvent("lead_submit", location.pathname);
      }
      if (buttonText.includes("заказать") || buttonText.includes("связаться")) {
        trackEvent("cta_click", location.pathname);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
