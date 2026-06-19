import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fetchTestimonials } from "../../features/services";
import type { Testimonial } from "../../entities/Testimonial/testimonial";

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-[#44be32]" : "text-gray-400/40"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const TestimonialsSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    fetchTestimonials().then(setItems).catch(() => setItems([]));
  }, []);

  if (items !== null && items.length === 0) return null;

  return (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.35 }}
        className="mx-auto w-full max-w-[1200px]"
      >
        <h2 className="theme-text font-['Montserrat_Alternates'] text-[clamp(20px,2vw,36px)] font-bold mb-6">
          Отзывы клиентов
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items === null && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="theme-surface rounded-2xl p-6 space-y-3">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((__, j) => (
                  <div key={j} className="w-4 h-4 rounded skeleton-shimmer" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded skeleton-shimmer" />
                <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                <div className="h-3 w-4/6 rounded skeleton-shimmer" />
              </div>
              <div className="border-t pt-3" style={{ borderColor: "var(--border-color)" }}>
                <div className="h-3 w-1/3 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
          {items !== null && items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="theme-surface rounded-2xl p-6 flex flex-col gap-3"
            >
              <Stars rating={t.rating} />
              <p className="theme-text font-[Montserrat_Alternates] text-sm leading-relaxed flex-1 whitespace-pre-wrap">
                {t.text}
              </p>
              <div className="mt-2 border-t pt-3" style={{ borderColor: "var(--border-color)" }}>
                <p className="theme-text font-semibold font-['Montserrat_Alternates'] text-sm">
                  {t.author}
                </p>
                {t.role && (
                  <p className="theme-subtext font-[Montserrat_Alternates] text-xs mt-0.5">
                    {t.role}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsSection;
