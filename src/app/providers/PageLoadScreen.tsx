import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "../store/themeSlice";

const LETTERS = ["К", "А", "М", "Е", "Р", "Т", "О", "Н"];

const getStoredTheme = (): "light" | "dark" => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return "light";
};

const PageLoadScreen = () => {
  const [visible, setVisible] = useState(true);
  const [isLight] = useState(() => getStoredTheme() === "light");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const delay = reduceMotion ? 400 : 2000;
    const timer = setTimeout(() => setVisible(false), delay);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  const bg = isLight
    ? "radial-gradient(circle at 15% 12%, rgba(37,99,235,0.1) 0%, transparent 42%), " +
      "radial-gradient(circle at 88% 18%, rgba(34,197,94,0.1) 0%, transparent 46%), " +
      "#f8fafc"
    : "radial-gradient(circle at 15% 12%, rgba(37,99,235,0.22) 0%, transparent 42%), " +
      "radial-gradient(circle at 88% 18%, rgba(34,197,94,0.16) 0%, transparent 46%), " +
      "#050505";

  const textColor = isLight ? "#0f172a" : "#ffffff";
  const subtextColor = isLight ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.45)";
  const glowColor = isLight ? "rgba(38,165,13,0.12)" : "rgba(38,165,13,0.18)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: bg }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* ambient glow */}
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: "clamp(260px, 45vw, 560px)",
              height: "clamp(100px, 16vw, 200px)",
              background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 70%)`,
              filter: "blur(32px)",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          />

          {/* wordmark */}
          <div className="relative flex items-baseline select-none">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.52,
                  delay: i * 0.078,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-['Montserrat_Alternates'] font-black leading-none"
                style={{
                  fontSize: "clamp(38px, 9.5vw, 96px)",
                  color: textColor,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* subtitle */}
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, letterSpacing: "0.08em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
            className="mt-3 font-['Montserrat_Alternates'] uppercase"
            style={{
              fontSize: "clamp(8px, 1.6vw, 13px)",
              color: subtextColor,
            }}
          >
            Рекламное агентство
          </motion.p>

          {/* dots */}
          <motion.div
            className="mt-10 flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-1.5 w-1.5 rounded-full bg-[#51d536]"
                animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ boxShadow: "0 0 6px rgba(81,213,54,0.6)" }}
              />
            ))}
          </motion.div>

          {/* progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[3px]"
            style={{
              background: "linear-gradient(90deg, #1a7408 0%, #51d536 55%, #8ef56f 100%)",
              boxShadow: "0 0 20px rgba(81,213,54,0.8)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: reduceMotion ? 0.1 : 1.75, ease: [0.18, 0.84, 0.38, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoadScreen;
