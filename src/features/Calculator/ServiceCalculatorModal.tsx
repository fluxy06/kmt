import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Bilbord } from "../../entities/Bilbord/bilbord";
import { useAppSelector } from "../../app/store/hooks";
import { fetchActiveServices } from "../services";

type CostCalculatorModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  onQuote?: (message: string) => void;
};

type ServiceSelection = Record<number, number>;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const urgencyLabels: Record<string, string> = {
  standard: "Стандарт",
  fast: "Быстро",
  express: "Экспресс",
};

const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({ isOpen = true, onClose, onQuote }) => {
  const reduceMotion = useReducedMotion();
  const isLightTheme = useAppSelector((state) => state.theme.mode === "light");
  const [isMounted, setIsMounted] = useState(false);
  const [services, setServices] = useState<Bilbord[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(1);
  const [urgency, setUrgency] = useState<"standard" | "fast" | "express">("standard");
  const [selection, setSelection] = useState<ServiceSelection>({});

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchActiveServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [closeModal]);

  const selectedCount = useMemo(() => Object.values(selection).reduce((acc, qty) => acc + qty, 0), [selection]);

  const result = useMemo(() => {
    const baseMonthly = services.reduce((total, service) => {
      const qty = selection[service.id] ?? 0;
      if (qty === 0) return total;
      return total + service.price * qty;
    }, 0);

    const urgencyMultiplier = urgency === "express" ? 1.35 : urgency === "fast" ? 1.15 : 1;
    const volumeDiscount = selectedCount >= 5 ? 0.9 : selectedCount >= 3 ? 0.95 : 1;
    const durationDiscount = months >= 6 ? 0.85 : months >= 3 ? 0.92 : 1;

    return {
      baseMonthly,
      urgencyMultiplier,
      volumeDiscount,
      durationDiscount,
      total: baseMonthly * months * urgencyMultiplier * volumeDiscount * durationDiscount,
    };
  }, [months, selectedCount, selection, services, urgency]);

  const toggleService = (serviceId: number) => {
    setSelection((prev) => {
      if (prev[serviceId]) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: 1 };
    });
  };

  const updateQuantity = (serviceId: number, qty: number) => {
    setSelection((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: qty };
    });
  };

  if (!isMounted || !isOpen) return null;

  const cardBase = isLightTheme ? "border-slate-300/80 bg-white/85" : "border-white/15 bg-white/5";
  const cardActive = isLightTheme ? "border-[#2f9f1c]/55 bg-[#51d536]/16" : "border-[#51d536]/55 bg-[#51d536]/10";
  const secondaryPanel = isLightTheme ? "border-slate-300/80 bg-white/80" : "border-white/15 bg-white/5";
  const totalPanel = isLightTheme ? "border-slate-300/85 bg-white/90" : "border-white/15 bg-black/20";
  const closeButton = isLightTheme
    ? "border-slate-300/80 bg-white/90 text-slate-900 hover:bg-white"
    : "border-white/20 bg-black/35 text-white hover:bg-black/55";

  return createPortal(
    <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0 }}
        transition={{ duration: 0.22 }}
        className={`fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-5 ${
          isLightTheme ? "bg-black/18" : "bg-black/70"
        } backdrop-blur-[3px]`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          className={`relative flex max-h-[90vh] w-full max-w-[920px] flex-col overflow-hidden rounded-[28px] border shadow-[0_25px_80px_rgba(0,0,0,0.35)] ${secondaryPanel}`}
        >
          <button
            type="button"
            aria-label="Закрыть"
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeModal();
            }}
            className={`absolute right-4 top-4 z-10 rounded-full border px-2.5 py-1.5 text-sm transition hover:scale-105 ${closeButton}`}
          >
            ✕
          </button>

          <div className="overflow-y-auto p-5 sm:p-8">
            <div className="mb-5 pr-10">
              <h3 className="theme-text font-['Montserrat_Alternates'] text-[clamp(22px,3.4vw,34px)] font-black leading-tight">
                Калькулятор стоимости размещения
              </h3>
              <p className="theme-subtext mt-2 text-sm sm:text-base">
                Выберите услуги, срок и срочность. Покажем ориентировочную стоимость по текущим ценам из базы.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="space-y-3">
                <h4 className="theme-text text-lg font-bold">Услуги</h4>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="skeleton-shimmer rounded-2xl"
                        style={{
                          height: "72px",
                          animationDelay: `${i * 0.12}s`,
                        }}
                      />
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <div className={`rounded-2xl border p-4 text-sm ${secondaryPanel}`}>Услуги пока не добавлены.</div>
                ) : (
                  <div className="space-y-2">
                    {services.map((service) => {
                      const qty = selection[service.id] ?? 0;
                      const active = qty > 0;

                      return (
                        <motion.div
                          key={service.id}
                          layout
                          whileHover={reduceMotion ? undefined : { y: -1 }}
                          className={`rounded-2xl border p-3 transition ${active ? cardActive : cardBase}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="theme-text text-sm font-semibold sm:text-base">{service.title}</p>
                              <p className="theme-subtext text-xs sm:text-sm">от {formatPrice(service.price)} / месяц</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleService(service.id)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                active
                                  ? "bg-[#51d536] text-black"
                                  : isLightTheme
                                    ? "border border-slate-300 bg-white text-slate-900"
                                    : "bg-white/10 text-white"
                              }`}
                            >
                              {active ? "Выбрано" : "Выбрать"}
                            </button>
                          </div>

                          {active && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="theme-subtext text-xs">Количество:</span>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={qty}
                                onChange={(event) => updateQuantity(service.id, Number(event.target.value))}
                                className={`w-20 rounded-lg border px-2 py-1 text-sm outline-none ${
                                  isLightTheme
                                    ? "border-slate-300 bg-white text-slate-900"
                                    : "border-white/20 bg-white/10 text-white"
                                }`}
                              />
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className={`rounded-2xl border p-4 sm:p-5 ${secondaryPanel}`}>
                <h4 className="theme-text text-lg font-bold">Параметры расчета</h4>

                <div className="mt-4">
                  <label className="theme-subtext text-sm">Срок размещения: {months} мес.</label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={months}
                    onChange={(event) => setMonths(Number(event.target.value))}
                    className="mt-2 w-full accent-[#51d536]"
                  />
                </div>

                <div className="mt-4">
                  <p className="theme-subtext mb-2 text-sm">Срочность запуска</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { key: "standard", label: "Стандарт" },
                      { key: "fast", label: "Быстро" },
                      { key: "express", label: "Экспресс" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setUrgency(option.key as "standard" | "fast" | "express")}
                        className={`rounded-xl border px-2 py-1.5 font-semibold transition ${
                          urgency === option.key
                            ? "border-[#51d536] bg-[#51d536] text-black"
                            : isLightTheme
                              ? "border-slate-300 bg-white text-slate-900"
                              : "border-white/20 bg-white/10 text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`mt-5 rounded-2xl border p-4 ${totalPanel}`}>
                  <p className="theme-subtext text-xs">Итоговая оценка</p>
                  <p className="mt-1 font-['Montserrat_Alternates'] text-2xl font-black text-[#2f9f1c] sm:text-3xl">
                    {formatPrice(result.total || 0)}
                  </p>
                  <p className="theme-subtext mt-1 text-xs">База: {formatPrice(result.baseMonthly)} / мес</p>
                  <p className="theme-subtext text-xs">Коэфф. срочности: ×{result.urgencyMultiplier}</p>
                  <p className="theme-subtext text-xs">Скидка за объем: ×{result.volumeDiscount}</p>
                  <p className="theme-subtext text-xs">Скидка за срок: ×{result.durationDiscount}</p>

                  {onQuote && result.total > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const lines = services
                          .filter((s) => (selection[s.id] ?? 0) > 0)
                          .map((s) => `- ${s.title} (${selection[s.id]} шт.) — ${formatPrice(s.price)}/мес`);
                        const message = [
                          "Расчёт стоимости:",
                          ...lines,
                          `Срок: ${months} мес. | Срочность: ${urgencyLabels[urgency]}`,
                          `Итого: ${formatPrice(result.total)}`,
                        ].join("\n");
                        onQuote(message);
                      }}
                      className="mt-4 w-full rounded-xl bg-[#51d536] px-4 py-2.5 text-sm font-bold text-black transition hover:bg-[#45c42d] active:scale-95"
                    >
                      Запросить расчёт
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </motion.div>,
    document.body,
  );
};

export default CostCalculatorModal;