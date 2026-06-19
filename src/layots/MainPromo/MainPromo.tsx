import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import headerBg from "../../assets/img/header-thumb.jpg";
import secBg from "../../assets/img/sec-thumb.jpg";
import featureBg from "../../assets/img/fr-thumb.jpg";
import accentBg from "../../assets/img/above-thumb.jpg";
import Contact from "../../shared/Buttons/Contact";
import { useAppSelector } from "../../app/store/hooks";

const ServiceCalculatorModal = lazy(
  () => import("../../features/Calculator/ServiceCalculatorModal"),
);

const MainPromo = () => {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const heroTitle = useAppSelector((s) => s.siteConfig.config.heroTitle);
  const heroSubtitle = useAppSelector((s) => s.siteConfig.config.heroSubtitle);

  const headingWords = heroTitle.split(" ");

  const wordContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };
  const wordItem = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const locationItems = [
    { label: "Центр", src: secBg, objectPosition: "50% 50%" },
    { label: "ТЦ", src: featureBg, objectPosition: "50% 50%" },
    { label: "Трасса", src: headerBg, objectPosition: "65% 50%" },
    { label: "Парк", src: accentBg, objectPosition: "50% 30%" },
  ];

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full px-4 pb-3 pt-4 sm:px-6" aria-label="Главный рекламный блок">
      <div className="mx-auto grid w-full max-w-[1200px] gap-3 lg:grid-cols-2 lg:items-stretch">
        <div className="grid gap-3">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            className="theme-surface relative overflow-hidden rounded-[25px] p-4 sm:p-8"
          >
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#26a50d]/20 blur-2xl" />
            <motion.h1
              variants={reduceMotion ? undefined : wordContainer}
              initial={reduceMotion ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="theme-text max-w-[20ch] font-['Montserrat_Alternates'] text-[18px] font-bold leading-normal sm:text-[28px] lg:text-[36px]"
            >
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={reduceMotion ? undefined : wordItem}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
            <p className="theme-subtext mt-3 max-w-[50ch] font-['Montserrat'] text-[11px] font-medium leading-[2] sm:mt-6 sm:text-[15px] lg:text-[16px]">
              {heroSubtitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-8">
              <Contact
                label="Заказать"
                width={{ min: "180px", preferred: "22vw", max: "235px" }}
                height={{ min: "38px", preferred: "4vw", max: "40px" }}
              />
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(true)}
                className="theme-control h-[40px] rounded-2xl border border-[#51d536]/50 px-5 font-['Montserrat_Alternates'] text-[13px] font-semibold text-[#8ef56f] transition hover:-translate-y-0.5 hover:border-[#8ef56f] hover:bg-[#51d536]/10 sm:text-[14px]"
              >
                Рассчитать стоимость
              </button>
            </div>
          </motion.article>

          <div className="grid gap-3 min-[380px]:grid-cols-2">
            <motion.article
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: 0.06 }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className="theme-surface rounded-[25px] p-4 sm:p-5"
            >
              <div className="flex items-center theme-text">
                <h2 className="mr-2 font-['Montserrat_Alternates'] text-[24px] font-bold sm:text-[38px]">5</h2>
                <p className="font-['Montserrat_Alternates'] text-[11px] font-bold leading-none sm:text-[18px]">
                  лучших
                  <br />
                  расположений
                </p>
              </div>

              <div className="mt-4 flex items-center">
                {locationItems.map((item, index) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={scrollToServices}
                    className={`-ml-2 relative grid h-8 w-8 overflow-hidden rounded-[10px] border border-white/20 transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51d536]/70 sm:h-12 sm:w-12 sm:rounded-[15px] ${index === 0 ? "ml-0" : ""}`}
                    aria-label={`Открыть услуги для локации ${item.label}`}
                  >
                    <img
                      src={item.src}
                      alt={item.label}
                      width={48}
                      height={48}
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{ objectPosition: item.objectPosition }}
                      loading="lazy"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/35 px-0.5 text-[7px] font-semibold text-white sm:text-[10px]">
                      {item.label}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={scrollToServices}
                  className="-ml-2 grid h-8 w-8 place-items-center rounded-[10px] theme-control border text-[7px] font-semibold transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51d536]/70 sm:h-12 sm:w-12 sm:rounded-[15px] sm:text-[10px]"
                >
                  +5
                </button>
              </div>
            </motion.article>

            <motion.article
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              className="theme-surface rounded-[25px] p-4 sm:p-5"
            >
              <div className="flex items-center theme-text">
                <h2 className="mr-2 font-['Montserrat_Alternates'] text-[24px] font-bold sm:text-[38px]">80%</h2>
                <p className="font-['Montserrat_Alternates'] text-[11px] font-bold leading-none sm:text-[18px]">
                  скорость
                  <br />
                  охвата
                </p>
              </div>

              <div className="mt-4 rounded-[12px] border border-white/10 bg-gradient-to-b from-white/10 to-transparent px-2 py-1.5 sm:px-2.5 sm:py-2">
                <div className="relative flex h-[46px] items-end gap-1.5 sm:h-[72px] sm:gap-2">
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:100%_25%]" />
                  {[42, 58, 66, 85, 100].map((height, i) => (
                    <span
                      key={i}
                      className="relative block flex-1 overflow-hidden rounded-t-[8px] bg-gradient-to-t from-[#1f8e0e] via-[#3ebf2a] to-[#8ef56f] shadow-[0_0_12px_rgba(81,213,54,0.35)]"
                      style={{
                        height: `${height}%`,
                        animation: reduceMotion ? undefined : "barGrow 0.65s cubic-bezier(0.2,0.8,0.2,1) both",
                        animationDelay: reduceMotion ? undefined : `${i * 0.09}s`,
                      }}
                    >
                      <span className="pointer-events-none absolute inset-x-0 top-0 h-[35%] bg-white/20" />
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </div>

        <motion.article
          style={{
            backgroundImage: `url(${headerBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
          className="theme-surface relative grid min-h-[280px] place-items-center overflow-hidden rounded-[25px] p-5 lg:min-h-full"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%)]" />
        </motion.article>
      </div>

      <style>{`@keyframes barGrow { from { transform: scaleY(.45); transform-origin: bottom; opacity: .6; } to { transform: scaleY(1); transform-origin: bottom; opacity: 1; } }`}</style>

      <AnimatePresence>
        {isCalculatorOpen && (
          <Suspense fallback={null}>
            <ServiceCalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MainPromo;
