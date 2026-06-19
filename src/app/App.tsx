import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Footer from "../layots/Footer/footer";
import Header from "../layots/Header/header";
import "./App.css";
import MainPromo from "../layots/MainPromo/MainPromo";
import AboutSection from "../layots/About/AboutSection";
import ServicesList from "../features/BilInter/ServicesList";
import { isHomeNavigationState } from "../shared/lib/navigation";
import { scrollElementToViewportCenter } from "../shared/lib/scroll";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadSiteConfig } from "./store/siteConfigSlice";
import CookieConsentBanner from "../features/CookieConsent/CookieConsentBanner";
import BackgroundCanvas from "../shared/BackgroundCanvas/BackgroundCanvas";
import ScrollToTopButton from "../shared/ScrollToTopButton/ScrollToTopButton";

const PortfolioSection  = lazy(() => import("../layots/Portfolio/PortfolioSection"));
const TestimonialsSection = lazy(() => import("../layots/Testimonials/TestimonialsSection"));
const FaqSection        = lazy(() => import("../layots/FAQ/FaqSection"));
const ContactShowcase   = lazy(() => import("../layots/ContactShowcase/ContactShowcase"));

const SectionFallback = () => <div className="w-full py-12" aria-hidden="true" />;

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const metaTitle = useAppSelector((s) => s.siteConfig.config.metaTitle);
  const metaDescription = useAppSelector((s) => s.siteConfig.config.metaDescription);

  useEffect(() => {
    if (metaTitle) document.title = metaTitle;
  }, [metaTitle]);

  useEffect(() => {
    const el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (el && metaDescription) el.content = metaDescription;
  }, [metaDescription]);

  const servicesRef = useRef<HTMLElement | null>(null);
  const contactsRef = useRef<HTMLElement | null>(null);
  const handledRequestsRef = useRef<Set<string>>(new Set());

  useEffect(() => { dispatch(loadSiteConfig()); }, [dispatch]);

  useLayoutEffect(() => {
    if (!isHomeNavigationState(location.state) || !location.state.scrollTarget) return;
    const { requestId, scrollTarget } = location.state;
    if (requestId && handledRequestsRef.current.has(requestId)) return;
    const target = scrollTarget === "services" ? servicesRef.current : contactsRef.current;
    if (!target) return;
    scrollElementToViewportCenter(target, "smooth");
    if (requestId) handledRequestsRef.current.add(requestId);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="theme-page">
      <BackgroundCanvas />
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24">
          <MainPromo />
          <AboutSection />
          <section id="services" ref={servicesRef} className="scroll-mt-32">
            <ServicesList />
          </section>
          <Suspense fallback={<SectionFallback />}>
            <PortfolioSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <TestimonialsSection />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <FaqSection />
          </Suspense>
          <section id="contacts" ref={contactsRef}>
            <Suspense fallback={<SectionFallback />}>
              <ContactShowcase />
            </Suspense>
          </section>
        </main>
        <Footer />
        <CookieConsentBanner />
      </div>
      <ScrollToTopButton />
    </div>
    </MotionConfig>
  );
}

export default App;
