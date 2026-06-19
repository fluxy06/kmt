import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppDispatch } from "../../app/store/hooks";
import { loadSiteConfig } from "../../app/store/siteConfigSlice";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import StatsSection from "./StatsSection";
import AboutContentSection from "./AboutContentSection";
import FirstImage from "../../assets/img/imgs.svg"
import KmtImage from "../../assets/img/kmt.svg"
import BackgroundCanvas from "../../shared/BackgroundCanvas/BackgroundCanvas";
import ScrollToTopButton from "../../shared/ScrollToTopButton/ScrollToTopButton";

const imagePlaceholders = [FirstImage, KmtImage];

const AboutPage = () => {
  const dispatch = useAppDispatch();
  const reduceMotion = useReducedMotion();

  useEffect(() => { dispatch(loadSiteConfig()); }, [dispatch]);

  return (
    <div className="theme-page min-h-screen theme-text">
      <BackgroundCanvas />
      <div className="relative z-10">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] min-w-[320px] px-4 pb-16 pt-[100px] sm:px-6 lg:px-8">
        <h1 className="font-['Montserrat_Alternates'] text-[clamp(40px,4.2vw,64px)] leading-[1.02] font-black theme-text">
          О нашей компании
        </h1>

        <section className="mt-8 grid gap-4 md:grid-cols-[1.45fr_0.8fr_0.8fr]">
          <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            className="theme-surface rounded-[30px] p-6 sm:p-8 md:min-h-[378px]"
          >
            <h2 className="max-w-[14ch] break-words font-['Montserrat_Alternates'] text-[clamp(30px,3.2vw,56px)] leading-[1.08] font-black theme-text">
              Мы превращаем улицы в вашу главную витрину
            </h2>

            <p className="mt-6 max-w-[46ch] break-words font-['Montserrat'] text-[clamp(16px,1.2vw,24px)] leading-[1.35] theme-subtext">
              Наше агентство — это фабрика идей и мощный производственный цех в одном лице. Мы не просто
              печатаем баннеры — мы создаем инструменты, которые заставляют ваш бренд говорить с городом
              на одном языке. От яркого билборда до лаконичного сити-формата — мы знаем, как привлечь
              внимание там, где решают ваши клиенты.
            </p>
          </motion.article>

          {imagePlaceholders.map((image, index) => (
            <motion.div
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.35, delay: 0.06 * (index + 1) }}
              whileHover={reduceMotion ? undefined : { y: -2, scale: 1.005 }}
              style={{
                  backgroundImage: `url(${image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
             className="relative min-h-[300px] overflow-hidden rounded-[30px] border-[0.3px] border-[#404040] shadow-2xl"
>
  <div className="pointer-events-none absolute inset-0 z-10 " />
</motion.div>
          ))}
        </section>

        <StatsSection />
        <AboutContentSection />
      </main>

      <Footer />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default AboutPage;
