import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Contact from "../../shared/Buttons/Contact";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { toggleTheme } from "../../app/store/themeSlice";
import type { HomeScrollTarget } from "../../shared/lib/navigation";
import { scrollToTop, scrollElementToViewportCenter } from "../../shared/lib/scroll";

const preloadAboutPage = () => {
  void import("../About/AboutPage");
};

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useAppSelector((state) => state.theme.mode);
  const isLightTheme = theme === "light";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 56);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  const goToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    scrollToTop("smooth");
    window.history.replaceState(null, "", "/");
  };

  const navigateToAbout = () => {
    if (pathname === "/about") { scrollToTop("auto"); return; }
    navigate("/about");
  };

  const navigateToSection = (sectionId: HomeScrollTarget) => {
    const requestId = `${Date.now()}-${sectionId}`;
    if (pathname !== "/") {
      navigate("/", { state: { scrollTarget: sectionId, requestId } });
      return;
    }
    const target = document.getElementById(sectionId);
    if (!target) {
      navigate("/", { state: { scrollTarget: sectionId, requestId } });
      return;
    }
    scrollElementToViewportCenter(target, "smooth");
  };

  const navLinkClass =
    "relative transition-all duration-300 hover:opacity-80 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full font-[Montserrat_Alternates]";

  const headerBg = isScrolled
    ? isLightTheme
      ? "bg-white/92 shadow-sm shadow-black/8"
      : "bg-black/80 shadow-lg shadow-black/30"
    : "bg-transparent";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 border-b transition-all duration-300 ${
        isLightTheme ? "border-slate-300/55" : "border-white/15"
      } ${headerBg}`}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center px-4 py-3 theme-text sm:gap-4 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={goToTop}
          className={`font-bold text-[clamp(18px,3.4vw,50px)] font-[Montserrat_Alternates] ${
            isLightTheme ? "text-slate-900" : "text-white"
          }`}
        >
          КАМЕРТОН
        </Link>

        {/* Desktop nav */}
        <div className="ml-auto hidden items-center gap-x-4 text-[clamp(13px,1.4vw,16px)] sm:flex sm:gap-5">
          <button type="button" onMouseEnter={preloadAboutPage} onFocus={preloadAboutPage} onClick={navigateToAbout} className={navLinkClass}>о нас</button>
          <button type="button" onClick={() => navigateToSection("services")} className={navLinkClass}>услуги</button>
          <button type="button" onClick={() => navigateToSection("contacts")} className={navLinkClass}>контакты</button>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label={isLightTheme ? "Переключить на тёмную тему" : "Переключить на светлую тему"}
            onClick={() => dispatch(toggleTheme())}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 ${
              isLightTheme
                ? "border-slate-300/80 bg-white/45 text-amber-500 hover:bg-white/70 hover:text-amber-600"
                : "border-white/20 bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
            }`}
          >
            {isLightTheme ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.172 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 5.106a.75.75 0 0 0 1.06 1.06l1.591-1.59a.75.75 0 1 0-1.06-1.061l-1.591 1.59Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <Contact
            width={{ min: "110.33px", preferred: "16.2vw", max: "194.4px" }}
            height={{ min: "34px", preferred: "calc(16.2vw * 0.3)", max: "40px" }}
            label="Связаться"
          />
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="ml-auto flex items-center gap-2 sm:hidden">
          <button
            type="button"
            aria-label={isLightTheme ? "Тёмная тема" : "Светлая тема"}
            onClick={() => dispatch(toggleTheme())}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
              isLightTheme
                ? "border-slate-300/80 bg-white/45 text-amber-500"
                : "border-white/20 bg-white/10 text-slate-300"
            }`}
          >
            {isLightTheme ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.172 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.166 5.106a.75.75 0 0 0 1.06 1.06l1.591-1.59a.75.75 0 1 0-1.06-1.061l-1.591 1.59Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
              isLightTheme
                ? "border-slate-300/60 bg-white/40 text-slate-700 hover:bg-white/70"
                : "border-white/20 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.svg key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 3L15 15M3 15L15 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </motion.svg>
              ) : (
                <motion.svg key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect y="2.5" width="18" height="2" rx="1" fill="currentColor"/>
                  <rect y="8" width="18" height="2" rx="1" fill="currentColor"/>
                  <rect y="13.5" width="18" height="2" rx="1" fill="currentColor"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`overflow-hidden border-t sm:hidden ${
              isLightTheme ? "border-slate-300/55 bg-white/95" : "border-white/15 bg-black/90"
            }`}
          >
            <div className="mx-auto flex max-w-[1200px] flex-col px-6 py-4 gap-1">
              {[
                { label: "О нас", action: navigateToAbout },
                { label: "Услуги", action: () => navigateToSection("services") },
                { label: "Контакты", action: () => navigateToSection("contacts") },
              ].map(({ label, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className={`w-full rounded-xl px-4 py-3 text-left text-base font-medium font-[Montserrat_Alternates] transition-all duration-200 ${
                    isLightTheme
                      ? "text-slate-800 hover:bg-slate-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
              <div className="pt-2 pb-1">
                <Contact
                  width={{ min: "100%", preferred: "100%", max: "100%" }}
                  height={{ min: "44px", preferred: "44px", max: "44px" }}
                  label="Связаться"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
