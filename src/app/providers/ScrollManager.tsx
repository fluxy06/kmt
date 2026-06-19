import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { initHeaderOffsetObserver, scrollToTop } from "../../shared/lib/scroll";
import { isHomeNavigationState } from "../../shared/lib/navigation";

const ScrollManager = () => {
  const { pathname, state } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return initHeaderOffsetObserver();
  }, []);

  useLayoutEffect(() => {
    if (pathname === "/about") {
      scrollToTop("auto");
      return;
    }

    if (pathname === "/") {
      const hasHomeScrollRequest = isHomeNavigationState(state) && Boolean(state?.scrollTarget);

      if (hasHomeScrollRequest) {
        return;
      }
    }

    scrollToTop("auto");
  }, [pathname, state]);

  return null;
};

export default ScrollManager;
