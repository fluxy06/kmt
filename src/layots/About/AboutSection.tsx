import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import Contact from "../../shared/Buttons/Contact";
import { useAppSelector } from "../../app/store/hooks";


 const MotionLink = motion(Link);

const AboutSection: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const aboutSectionText = useAppSelector((s) => s.siteConfig.config.aboutSectionText);

  return (
    <section id="about" className="w-full px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
        className="mx-auto grid w-full max-w-[1200px] gap-4 justify-between lg:grid-cols-2 lg:gap-6"
      >
        <motion.article
          whileHover={reduceMotion ? undefined : { y: -2 }}
          className="theme-surface grid min-w-0 min-h-[240px] rounded-2xl p-6 text-left transition-all duration-300 sm:min-h-[300px] sm:p-8"
        >
          <MotionLink
            to="/about"
            whileHover={reduceMotion ? undefined : { y: -1, scale: 1.03 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex h-[36px] max-w-[130px] items-center justify-center rounded-[25px] border border-[var(--border-color)] bg-white/60 px-5 font-['Montserrat_Alternates'] text-[14px] font-semibold theme-text shadow-[0_0_6px_rgba(148,163,184,0.3)] transition-colors  hover:bg-white/80 duration-500 sm:h-[44px] sm:text-[20px]"
          >
            о нас
          </MotionLink>


          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, x: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="theme-text mt-6 max-w-[15ch] text-left text-[clamp(20px,1.5vw,48px)] leading-[1.05] font-[Montserrat_Alternates] break-words"
          >
            Давайте знакомиться!
          </motion.h1>
        </motion.article>

        <motion.article
          whileHover={reduceMotion ? undefined : { y: -2 }}
          className="theme-surface grid min-w-0 min-h-[240px] rounded-2xl p-6 text-left transition-all duration-300 sm:min-h-[300px] sm:p-8"
        >
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="theme-subtext font-[Montserrat_Alternates] text-[clamp(14px,1.6vw,20px)] font-medium leading-relaxed break-words"
          >
            {aboutSectionText}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-5"
          >
            <Contact
              label="Заказать рекламу"
              width={{ min: "180px", preferred: "22vw", max: "235px" }}
              height={{ min: "38px", preferred: "4vw", max: "40px" }}
            />
          </motion.div>
        </motion.article>
      </motion.div>
    </section>
  );
};

export default AboutSection;
