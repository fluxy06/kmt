import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { fetchAnalyticsDashboard, type AnalyticsDashboard } from "../../../shared/lib/analytics";
import { useAdminTheme } from "../AdminThemeContext";

type AnalyticsPanelProps = {
  token?: string;
};

const emptyAnalytics: AnalyticsDashboard = {
  stats: [
    { title: "Посетители", value: "0", change: "+0.0%", hint: "за 7 дней" },
    { title: "Просмотры", value: "0", change: "+0.0%", hint: "за 7 дней" },
    { title: "Конверсия", value: "0.0%", change: "+0.0%", hint: "за 30 дней" },
    { title: "Новые заявки", value: "0", change: "+0.0%", hint: "за 7 дней" },
  ],
  traffic: new Array<number>(12).fill(0),
  sources: [],
  depth: new Array<number>(6).fill(0),
  engagement: { avgTime: "0м 0с", pagesPerVisit: "0.0", bounceRate: "0%" },
  topPages: [],
  events: [],
  metricId: "GLOBAL-KMT",
  updatedAt: "--:--",
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const AnalyticsPanel = ({ token }: AnalyticsPanelProps) => {
  const t = useAdminTheme();
  const [metrics, setMetrics] = useState<AnalyticsDashboard>(emptyAnalytics);

  const cardCls = t.isLight
    ? `rounded-3xl p-6 ${t.surface}`
    : "rounded-3xl border border-[#2a2a2a] bg-[#121212] p-6 shadow-lg shadow-black/30";
  const statCardCls = t.isLight
    ? `rounded-2xl p-5 ${t.surface}`
    : "rounded-2xl border border-[#2a2a2a] bg-gradient-to-b from-[#1c1c1c] to-[#151515] p-5 shadow-lg shadow-black/20";
  const trackCls = t.isLight ? "bg-gray-200" : "bg-[#1f1f1f]";
  const depthBgCls = t.isLight ? "bg-gray-100/80" : "bg-gradient-to-r from-[#1f1f1f] to-[#272727]";
  const metricBadgeCls = t.isLight
    ? `px-4 py-2 rounded-full text-sm ${t.surface} ${t.subtext}`
    : "px-4 py-2 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-sm text-gray-300";

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const refresh = async () => {
      try {
        const data = await fetchAnalyticsDashboard(token);
        if (!isMounted) return;
        setMetrics({
          ...emptyAnalytics,
          ...data,
          traffic: data.traffic.length ? data.traffic : emptyAnalytics.traffic,
          depth: data.depth.length ? data.depth : emptyAnalytics.depth,
        });
      } catch {
        if (!isMounted) return;
      }
    };

    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 7000);
    return () => { isMounted = false; window.clearInterval(interval); };
  }, [token]);

  const trafficPath = useMemo(() => {
    const points = metrics.traffic
      .map((value, index) => `L ${10 + index * 32} ${160 - clamp(value, 0, 120)}`)
      .join(" ");
    return `M 10 ${160 - clamp(metrics.traffic[0], 0, 120)} ${points}`;
  }, [metrics.traffic]);

  const trafficFillPath = useMemo(() => {
    const points = metrics.traffic
      .map((value, index) => `L ${10 + index * 32} ${160 - clamp(value, 0, 120)}`)
      .join(" ");
    return `M 10 160 L 10 ${160 - clamp(metrics.traffic[0], 0, 120)} ${points} L ${10 + (metrics.traffic.length - 1) * 32} 160 Z`;
  }, [metrics.traffic]);

  return (
    <section className={`w-full h-full relative ${t.text}`}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-10 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ y: [0, -18, 0], x: [0, 12, 0], scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-start justify-between gap-6"
      >
        <div>
          <h1 className={`text-3xl font-semibold ${t.text}`}>Аналитика</h1>
          <p className={`text-sm mt-1 ${t.subtext}`}>
            Глобальные метрики по всем пользователям сайта из серверного хранилища.
          </p>
          <p className={`text-xs mt-2 ${t.subtext}`}>
            Автообновление каждые 7 секунд · последнее обновление {metrics.updatedAt}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={metricBadgeCls}>
            Metric ID: {metrics.metricId}
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-8"
      >
        {metrics.stats.map((item) => (
          <motion.div
            key={item.title}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.4 }}
            className={statCardCls}
          >
            <div className={`text-sm ${t.subtext}`}>{item.title}</div>
            <div className={`mt-2 text-2xl font-semibold ${t.text}`}>{item.value}</div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-emerald-500">{item.change}</span>
              <span className={t.subtext}>{item.hint}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Traffic + Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cardCls}
        >
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${t.text}`}>Трафик по дням</h2>
            <span className={`text-xs ${t.subtext}`}>последние 12 дней</span>
          </div>
          <div className="mt-6 h-48 w-full relative">
            <svg viewBox="0 0 400 160" className="w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
                d={trafficPath}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
                d={trafficFillPath}
                fill="url(#lineGradient)"
                stroke="none"
              />
            </svg>
            <div className={`absolute inset-0 flex items-end justify-between px-2 text-[10px] ${t.subtext}`}>
              {metrics.traffic.map((_, index) => (
                <span key={`day-${index}`}>Д{index + 1}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cardCls}
        >
          <h2 className={`text-lg font-semibold ${t.text}`}>Источники трафика</h2>
          <div className="mt-6 space-y-4">
            {metrics.sources.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={t.text}>{item.label}</span>
                  <span className={t.subtext}>{item.value}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${trackCls}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-[#6c5dd3] to-[#8b5cf6]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Depth + Top pages + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className={cardCls}
        >
          <h2 className={`text-lg font-semibold ${t.text}`}>Глубина просмотра</h2>
          <div className={`mt-5 space-y-4 text-sm ${t.subtext}`}>
            <div className="flex items-center justify-between">
              <span>Среднее время</span>
              <span className={t.text}>{metrics.engagement.avgTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Страниц за визит</span>
              <span className={t.text}>{metrics.engagement.pagesPerVisit}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Показатель отказов</span>
              <span className={t.text}>{metrics.engagement.bounceRate}</span>
            </div>
          </div>
          <div className={`mt-6 h-24 rounded-2xl flex items-end justify-around p-3 ${depthBgCls}`}>
            {metrics.depth.map((value, index) => (
              <motion.div
                key={`depth-${index}`}
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
                className="w-4 rounded-full bg-gradient-to-t from-[#6c5dd3] to-[#8b5cf6]"
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cardCls}
        >
          <h2 className={`text-lg font-semibold ${t.text}`}>Топ страниц</h2>
          <div className="mt-5 space-y-4">
            {metrics.topPages.map((item) => (
              <div key={item.title}>
                <div className="flex items-center justify-between text-sm">
                  <span className={t.text}>{item.title}</span>
                  <span className={t.subtext}>{item.value}%</span>
                </div>
                <div className={`mt-2 h-2 rounded-full ${trackCls}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#34d399] to-[#10b981]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className={cardCls}
        >
          <h2 className={`text-lg font-semibold ${t.text}`}>События Метрики</h2>
          <ul className={`mt-5 space-y-4 text-sm ${t.subtext}`}>
            {metrics.events.map((event) => (
              <li key={event.title} className="flex items-center justify-between">
                <span>{event.title}</span>
                <span className={event.trend === "up" ? "text-emerald-500" : "text-rose-400"}>
                  {event.change}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsPanel;
