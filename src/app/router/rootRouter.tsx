import { lazy, Suspense, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import App from "../App";

const AboutPage = lazy(() => import("../../layots/About/AboutPage"));
const AdminPage = lazy(() => import("../../features/Admin/AdminPage"));
const PrivacyPolicyPage = lazy(() => import("../../layots/Legal/PrivacyPolicyPage"));
const OfferAgreementPage = lazy(() => import("../../layots/Legal/OfferAgreementPage"));
import NotFoundPage from "../../layots/NotFound/NotFoundPage";

const PageLoader = () => <div className="theme-page min-h-screen" aria-hidden="true" />;

const RouteTransition = ({ children }: { children: ReactNode }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key="route-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
};

const RootRouter = () => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={reduceMotion ? "static-routes" : location.pathname}>
          {/* ПУБЛИЧНЫЙ САЙТ */}
          <Route
            path="/"
            element={(
              <RouteTransition>
                <App />
              </RouteTransition>
            )}
          />
          <Route
            path="/about"
            element={(
              <RouteTransition>
                <AboutPage />
              </RouteTransition>
            )}
          />
          <Route
            path="/privacy-policy"
            element={(
              <RouteTransition>
                <PrivacyPolicyPage />
              </RouteTransition>
            )}
          />
          <Route
            path="/offer-agreement"
            element={(
              <RouteTransition>
                <OfferAgreementPage />
              </RouteTransition>
            )}
          />

          {/* АДМИНКА: токен из URL сразу переносится в sessionStorage,
              дальше работа идёт по чистому пути /kmt/admin */}
          <Route path="/kmt/admin" element={<AdminPage />} />
          <Route path="/kmt/admin/:token" element={<AdminPage />} />

          {/* 404 */}
          <Route path="*" element={<RouteTransition><NotFoundPage /></RouteTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default RootRouter;
