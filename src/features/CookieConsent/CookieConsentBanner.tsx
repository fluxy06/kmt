import { useState } from "react";
import { Link } from "react-router-dom";
import {
  COOKIE_CONSENT_KEY,
  THEME_COOKIE_KEY,
  getCookieConsent,
  type CookieConsent,
} from "../../shared/lib/cookieConsent";
import { deleteCookie, setCookie } from "../../shared/lib/cookies";
import { clearAnalytics } from "../../shared/lib/analytics";

const CookieConsentBanner = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(() => getCookieConsent());

  const handleAccept = () => {
    setCookie(COOKIE_CONSENT_KEY, "accepted", { days: 365, sameSite: "Lax" });
    setConsent("accepted");
  };

  const handleDecline = () => {
    setCookie(COOKIE_CONSENT_KEY, "declined", { days: 365, sameSite: "Lax" });
    deleteCookie(THEME_COOKIE_KEY);
    clearAnalytics();
    setConsent("declined");
  };

  if (consent !== null) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="theme-card theme-text mx-auto max-w-4xl rounded-2xl border theme-border shadow-lg shadow-black/10 backdrop-blur-sm">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:gap-6">
          <p className="theme-subtext text-sm md:text-[15px] leading-relaxed">
            Мы используем технические cookie и метрики (просмотры, клики, глубину скролла)
            для внутренней серверной аналитики в админке без передачи данных третьим лицам. Вы можете принять
            или отклонить хранение cookie. Подробнее в{" "}
            <Link to="/privacy-policy" className="underline hover:no-underline">
              политике конфиденциальности
            </Link>
            .
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handleDecline}
              className="rounded-lg border theme-border px-4 py-2 text-sm font-medium transition hover:opacity-80"
            >
              Отказаться
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
