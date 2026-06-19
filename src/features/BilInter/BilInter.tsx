import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { Bilbord } from "../../entities/Bilbord/bilbord";

type BilInterProps = {
  resource: Bilbord;
  onClick?: (service: Bilbord) => void;
};

const BilInter: React.FC<BilInterProps> = ({ resource, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      onClick={() => onClick?.(resource)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="rounded-2xl cursor-pointer overflow-hidden relative w-full"
      style={{ height: "clamp(320px, calc(70vw * 1.3), 480px)" }}
      initial={reduceMotion ? false : { scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {!loaded && <div className="skeleton-shimmer absolute inset-0" />}

      <img
        src={resource.imageUrl}
        alt={resource.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          opacity: loaded ? 1 : 0,
          transform: hovered && !reduceMotion ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
        }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />

      {/* Permanent gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-linear-to-t from-black/90 via-black/50 to-transparent" />

      {/* Top gradient for slight depth */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[30%] bg-linear-to-b from-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        {/* Hover reveal: price + CTA */}
        <motion.div
          animate={reduceMotion ? undefined : { opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          initial={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="mb-2 flex items-center justify-between"
        >
          <span className="font-semibold text-[#8ef56f] text-[clamp(11px,2vw,13px)]">
            от {resource.price.toLocaleString("ru-RU")} ₽/мес
          </span>
          <span className="text-white/65 text-xs font-medium tracking-wide">
            Подробнее →
          </span>
        </motion.div>

        <h3 className="font-['Montserrat_Alternates'] text-[clamp(16px,3.5vw,24px)] font-black leading-tight text-white">
          {resource.title}
        </h3>
        <p className="mt-0.5 text-[clamp(11px,2vw,13px)] text-white/50">{resource.size}</p>
      </div>

      {/* Subtle top-left label */}
      <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/55 backdrop-blur-sm">
        реклама
      </div>
    </motion.div>
  );
};

export default BilInter;
