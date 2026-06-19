import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAppSelector } from "../../app/store/hooks";

const FaqSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const faqs = useAppSelector((s) => s.siteConfig.config.faqs);
  const [open, setOpen] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="w-full px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.35 }}
        className="mx-auto w-full max-w-[800px]"
      >
        <h2 className="theme-text font-['Montserrat_Alternates'] text-[clamp(20px,2vw,36px)] font-bold mb-6">
          Вопросы и ответы
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="theme-surface rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors"
              >
                <span className="theme-text font-['Montserrat_Alternates'] font-semibold text-sm sm:text-base">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-5 h-5 shrink-0 text-[#44be32]"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="body"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="theme-subtext font-[Montserrat_Alternates] text-sm leading-relaxed px-6 pb-5 whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FaqSection;
