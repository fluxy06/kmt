import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fetchActiveServices } from "../services";
import type { Bilbord } from "../../entities/Bilbord/bilbord";
import BilInter from "./BilInter";
import ServiceModal from "./ServiceModal";
import ServiceSkeleton from "./ServiceSkeleton";
import { useAppSelector } from "../../app/store/hooks";

const ServicesList = () => {
  const reduceMotion = useReducedMotion();
  const isLightTheme = useAppSelector((state) => state.theme.mode === "light");
  const [services, setServices] = useState<Bilbord[]>([]);
  const [selected, setSelected] = useState<Bilbord | null>(null);
  const [loading, setLoading] = useState(true);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchActiveServices()
      .then(setServices)
      .finally(() => setLoading(false));
  }, []);

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollPrev(container.scrollLeft > 2);
    setCanScrollNext(maxScrollLeft - container.scrollLeft > 2);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [services, loading, updateScrollButtons]);

   const handleScroll = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className={`w-full px-4 py-12 sm:px-6 ${isLightTheme ? "!bg-transparent" : ""}`}>
        <style>{`
          .services-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className={`mx-auto w-full max-w-[1200px] justify-center ${isLightTheme ? "!bg-transparent" : ""}`}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35 }}
            className="mb-6 flex items-end justify-between gap-4"
          >
            <h2 className="font-['Montserrat_Alternates'] text-[clamp(26px,3vw,42px)] font-black leading-tight theme-text">
              Наши услуги
            </h2>
            <div className="theme-divider mb-2 hidden flex-1 sm:block" style={{ height: "1px" }} />
          </motion.div>

          <div className="relative">
            <button
              type="button"
              onClick={() => handleScroll("prev")}
              disabled={!canScrollPrev}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-white shadow-lg backdrop-blur transition hover:bg-black/60 theme-control disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Предыдущие услуги"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => handleScroll("next")}
              disabled={!canScrollNext}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-white shadow-lg backdrop-blur transition hover:bg-black/60 theme-control disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Следующие услуги"
            >
              →
            </button>
            <div
              ref={scrollRef}
              className="services-scroll flex items-stretch gap-4 overflow-x-auto px-8 pb-2 scroll-smooth snap-x snap-mandatory lg:px-8 py-3"
              style={{ scrollbarWidth: "none" }}
            >
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="snap-start shrink-0 basis-full sm:basis-1/2 lg:basis-[calc((100%-2rem)/3)] lg:snap-none"
                    >
                      <ServiceSkeleton />
                    </div>
                  ))
                : services.map((service) => (
                    <div
                      key={service.id}
                      className="snap-start shrink-0 basis-full sm:basis-1/2 lg:basis-[calc((100%-2rem)/3)] lg:snap-none"
                    >
                      <BilInter
                        resource={service}
                        onClick={setSelected}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {selected && (
        <ServiceModal
          service={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default ServicesList;