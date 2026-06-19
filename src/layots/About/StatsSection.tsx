import { motion } from "framer-motion";
import { useAppSelector } from "../../app/store/hooks";

const StatsSection = () => {
  const stats = useAppSelector((s) => s.siteConfig.config.stats);
  const loading = useAppSelector((s) => s.siteConfig.loading);

  return (
    <section className="mt-10">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45 }}
        className="font-['Montserrat_Alternates'] text-[clamp(34px,4.4vw,68px)] leading-[1.02] font-black theme-text"
      >
        Мы в цифрах
      </motion.h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading && Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="theme-surface flex min-h-[190px] flex-col items-center justify-center rounded-[28px] px-4 py-5 gap-3"
          >
            <div className="h-12 w-20 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-16 rounded skeleton-shimmer" />
          </div>
        ))}
        {!loading && stats.map((item, index) => (
          <motion.article
            key={item.value}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
            whileHover={{ y: -4, boxShadow: "0 14px 24px rgba(76,163,63,0.34)" }}
            className="theme-surface flex min-h-[190px] flex-col items-center justify-center rounded-[28px] px-4 py-5 text-center"
          >
            <span className="theme-text break-words font-['Montserrat_Alternates'] text-[clamp(38px,3.1vw,70px)] leading-none font-black">
              {item.value}
            </span>
            <span className="theme-subtext mt-3 whitespace-pre-line break-words font-['Montserrat_Alternates'] text-[clamp(16px,1.2vw,26px)] leading-[1.12] font-bold">
              {item.label}
            </span>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
