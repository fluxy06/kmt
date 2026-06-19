export const ANCHOR_OFFSET = 16;

const DEFAULT_HEADER_SELECTOR = "header";
let cachedHeaderHeight = 0;
let cleanupHeaderObserver: (() => void) | null = null;

const getHeaderElement = (selector = DEFAULT_HEADER_SELECTOR) => {
  const header = document.querySelector(selector);
  return header instanceof HTMLElement ? header : null;
};

export const initHeaderOffsetObserver = (selector = DEFAULT_HEADER_SELECTOR) => {
  if (cleanupHeaderObserver) {
    return cleanupHeaderObserver;
  }

  const header = getHeaderElement(selector);

  if (!header) {
    cleanupHeaderObserver = () => {
      cleanupHeaderObserver = null;
    };
    return cleanupHeaderObserver;
  }

  cachedHeaderHeight = header.offsetHeight;

  if (!("ResizeObserver" in window)) {
    cleanupHeaderObserver = () => {
      cleanupHeaderObserver = null;
    };
    return cleanupHeaderObserver;
  }

  const observer = new ResizeObserver(() => {
    cachedHeaderHeight = header.offsetHeight;
  });

  observer.observe(header);

  cleanupHeaderObserver = () => {
    observer.disconnect();
    cleanupHeaderObserver = null;
  };

  return cleanupHeaderObserver;
};

export const getHeaderOffset = (selector = DEFAULT_HEADER_SELECTOR) => {
  if (cachedHeaderHeight > 0) {
    return cachedHeaderHeight;
  }

  const header = getHeaderElement(selector);
  return header ? header.offsetHeight : 0;
};

export const getAnchorTop = (target: HTMLElement, extraOffset = ANCHOR_OFFSET) => {
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  return Math.max(0, targetTop - getHeaderOffset() - extraOffset);
};

export const scrollToTop = (behavior: ScrollBehavior = "auto") => {
  window.scrollTo({ top: 0, left: 0, behavior });
};

export const scrollElementToViewportCenter = (
  target: HTMLElement,
  behavior: ScrollBehavior = "smooth",
) => {
  target.scrollIntoView({ behavior, block: "center", inline: "nearest" });
};

export const tryScrollToHash = (hash: string, behavior: ScrollBehavior = "smooth") => {
  const target = document.querySelector(hash);

  if (!(target instanceof HTMLElement)) {
    return false;
  }

  window.scrollTo({ top: getAnchorTop(target), behavior });
  return true;
};
