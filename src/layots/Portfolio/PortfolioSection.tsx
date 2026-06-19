import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fetchPortfolio } from "../../features/services";
import type { PortfolioItem } from "../../entities/Portfolio/portfolio";
import { optimizeCloudinaryUrl } from "../../shared/lib/cloudinary";

const PortfolioSection = () => {
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchPortfolio()
      .then(setItems)
      .catch((err) => {
        console.error("[PortfolioSection] fetch failed:", err);
        setItems([]);
      });
  }, []);

  if (items !== null && items.length === 0) return null;

  return (
    <section id="portfolio" className="w-full px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-300">
        <motion.h2
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35 }}
          className="font-['Montserrat_Alternates'] text-[clamp(28px,3.5vw,56px)] font-black theme-text mb-8"
        >
          Наши работы
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items === null && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-4/3 rounded-2xl skeleton-shimmer" />
          ))}
          {items !== null && items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-4/3"
              onClick={() => setLightbox(item)}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            >
              <img
                src={optimizeCloudinaryUrl(item.imageUrl, 800)}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-['Montserrat_Alternates'] font-bold text-base leading-tight">
                  {item.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={optimizeCloudinaryUrl(lightbox.imageUrl, 1600)}
              alt={lightbox.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="mt-3 text-center text-white font-['Montserrat_Alternates'] font-bold text-xl">
              {lightbox.title}
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default PortfolioSection;
