import { hasCookieConsent } from "./cookieConsent";
import { buildApiUrl } from "./api";

const ANALYTICS_SESSION_KEY = "kmt_analytics_session_id";
const ANALYTICS_PAGEVIEW_KEY = "kmt_analytics_pageview_id";

type TrafficSource = "Прямые" | "Поиск" | "Соцсети" | "Реклама" | "Переходы";

type EventType = "PAGE_VIEW" | "EVENT" | "SCROLL";

type AnalyticsEventPayload = {
  eventId: string;
  sessionId: string;
  path: string;
  eventType: EventType;
  eventName?: string;
  pageViewId?: string;
  source?: TrafficSource;
  depthPercent?: number;
  timestamp: number;
};

export type AnalyticsDashboard = {
  stats: { title: string; value: string; change: string; hint: string }[];
  traffic: number[];
  sources: { label: string; value: number }[];
  depth: number[];
  engagement: { avgTime: string; pagesPerVisit: string; bounceRate: string };
  topPages: { title: string; value: number }[];
  events: { title: string; change: string; trend: "up" | "down" }[];
  metricId: string;
  updatedAt: string;
};

const queue: AnalyticsEventPayload[] = [];
let flushTimer: number | null = null;

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const getSessionId = () => {
  const existing = window.sessionStorage.getItem(ANALYTICS_SESSION_KEY);
  if (existing) return existing;
  const next = uid();
  window.sessionStorage.setItem(ANALYTICS_SESSION_KEY, next);
  return next;
};

const resolveSource = (): TrafficSource => {
  const params = new URLSearchParams(window.location.search);
  const medium = (params.get("utm_medium") || "").toLowerCase();
  if (medium.includes("cpc") || medium.includes("ads") || medium.includes("banner")) {
    return "Реклама";
  }

  const referrer = document.referrer.toLowerCase();
  if (!referrer) return "Прямые";
  if (/(yandex|google|bing|mail\.ru)/.test(referrer)) return "Поиск";
  if (/(vk|instagram|facebook|t\.me|ok\.ru)/.test(referrer)) return "Соцсети";
  return "Переходы";
};

const flush = async (useBeacon = false) => {
  if (!queue.length) return;
  const events = queue.splice(0, queue.length);
  const body = JSON.stringify({ events });

  if (useBeacon && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/kmt/analytics/collect", blob);
    return;
  }

  try {
    await fetch(buildApiUrl("/kmt/analytics/collect"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // ignore network errors, next events will still be collected
  }
};

const scheduleFlush = () => {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(async () => {
    flushTimer = null;
    await flush();
  }, 1200);
};

const enqueue = (payload: AnalyticsEventPayload) => {
  if (typeof window === "undefined" || !hasCookieConsent()) return;
  if (payload.path.startsWith("/kmt/admin")) return;

  queue.push(payload);
  if (queue.length >= 20) {
    void flush();
    return;
  }
  scheduleFlush();
};

export const clearAnalytics = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ANALYTICS_SESSION_KEY);
  window.sessionStorage.removeItem(ANALYTICS_PAGEVIEW_KEY);
};

export const trackPageView = (path: string) => {
  if (typeof window === "undefined" || !hasCookieConsent()) return;
  const sessionId = getSessionId();
  const pageViewId = uid();
  window.sessionStorage.setItem(ANALYTICS_PAGEVIEW_KEY, pageViewId);

  enqueue({
    eventId: uid(),
    sessionId,
    path,
    eventType: "PAGE_VIEW",
    pageViewId,
    source: resolveSource(),
    timestamp: Date.now(),
  });
};

export const trackEvent = (name: string, path: string) => {
  if (typeof window === "undefined" || !hasCookieConsent()) return;
  enqueue({
    eventId: uid(),
    sessionId: getSessionId(),
    path,
    eventType: "EVENT",
    eventName: name,
    pageViewId: window.sessionStorage.getItem(ANALYTICS_PAGEVIEW_KEY) || undefined,
    timestamp: Date.now(),
  });
};

// Дашборд использует только максимум глубины на просмотр, поэтому шлём не
// каждый тик скролла, а лишь пересечения порогов 20/40/60/80/100% — монотонно,
// максимум 5 событий на просмотр вместо строки в БД каждые 250мс
let lastDepthBucket = 0;
let lastDepthPageViewId: string | null = null;

export const trackScrollDepth = (depthPercent: number) => {
  if (typeof window === "undefined" || !hasCookieConsent()) return;
  const pageViewId = window.sessionStorage.getItem(ANALYTICS_PAGEVIEW_KEY);
  if (!pageViewId) return;

  const clamped = Math.max(0, Math.min(100, Math.round(depthPercent)));
  const bucket = Math.min(5, Math.floor(clamped / 20));

  if (pageViewId !== lastDepthPageViewId) {
    lastDepthPageViewId = pageViewId;
    lastDepthBucket = 0;
  }
  if (bucket <= lastDepthBucket) return;
  lastDepthBucket = bucket;

  enqueue({
    eventId: uid(),
    sessionId: getSessionId(),
    path: window.location.pathname,
    eventType: "SCROLL",
    pageViewId,
    depthPercent: bucket * 20,
    timestamp: Date.now(),
  });
};

export const initAnalyticsLifecycle = () => {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeunload", () => {
    void flush(true);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      void flush(true);
    }
  });
};

export const fetchAnalyticsDashboard = async (token: string): Promise<AnalyticsDashboard> => {
  const response = await fetch(buildApiUrl("/kmt/analytics/dashboard"), {
    cache: "no-store",
    headers: { "X-Admin-Token": token },
  });
  if (!response.ok) {
    throw new Error("Не удалось загрузить аналитику");
  }

  return response.json() as Promise<AnalyticsDashboard>;
};
