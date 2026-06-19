import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import CostCalculatorModal from "../../features/Calculator/ServiceCalculatorModal";
import Modal from "../../features/Modal/Modal";
import MapTilerContactMap from "./MapTilerContactMap";
import { useAppSelector } from "../../app/store/hooks";

const ContactShowcase = () => {
  const reduceMotion = useReducedMotion();
  const config = useAppSelector((s) => s.siteConfig.config);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState("");

  const handleQuote = (message: string) => {
    setQuoteMessage(message);
    setIsCalculatorOpen(false);
    setIsContactOpen(true);
  };

  const workingHoursLines = config.workingHours.split("\n").filter(Boolean);

  const contactCards = [
    { icon: "📍", title: "Адрес", lines: [config.address] },
    { icon: "📞", title: "Телефон", lines: config.phones },
    { icon: "✉️", title: "Email", lines: config.emails },
    { icon: "🕒", title: "Режим работы", lines: workingHoursLines },
  ];

  return (
    <section className="w-full scroll-mt-32 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <motion.button
            type="button"
            onClick={() => setIsCalculatorOpen(true)}
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="theme-control rounded-full border border-[#51d536]/40 bg-[#51d536]/15 px-5 py-1.5 text-sm font-semibold uppercase tracking-wide shadow-[0_0_14px_rgba(81,213,54,0.35)] backdrop-blur-sm transition hover:bg-[#51d536]/25"
          >
            Рассчитать стоимость услуг
          </motion.button>
          <p className="theme-subtext mt-3 max-w-xl text-sm font-semibold sm:text-lg">
            Готовы начать работу? Свяжитесь с нами удобным способом — по телефону, почте или приезжайте в офис.
          </p>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contactCards.map((card, index) => (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
                  borderColor: "var(--border-color)",
                }}
                className="theme-surface rounded-3xl border p-5 transition duration-300"
              >
                <p className="text-3xl leading-none">{card.icon}</p>
                <h3 className="theme-text mt-2 font-['Montserrat_Alternates'] text-xl font-semibold">
                  {card.title}
                </h3>
                <div className="theme-subtext mt-2 text-sm leading-relaxed">
                  {card.lines.map((line) => {
                    if (card.title === "Телефон") {
                      return (
                        <a key={line} href={`tel:${line.replace(/[^\d+]/g, "")}`}
                          className="block hover:underline">{line}</a>
                      );
                    }
                    if (card.title === "Email") {
                      return (
                        <a key={line} href={`mailto:${line}`} className="block hover:underline">{line}</a>
                      );
                    }
                    return <p key={line}>{line}</p>;
                  })}
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
            className="theme-surface relative overflow-hidden rounded-3xl"
          >
            <div className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-slate-500/20 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-slate-500/15 blur-2xl" />
            <MapTilerContactMap />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isCalculatorOpen && (
          <CostCalculatorModal
            onClose={() => setIsCalculatorOpen(false)}
            onQuote={handleQuote}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isContactOpen && (
          <Modal
            defaultMessage={quoteMessage}
            onClose={() => { setIsContactOpen(false); setQuoteMessage(""); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactShowcase;
