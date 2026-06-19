import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../../app/store/hooks";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const isLight = useAppSelector((s) => s.theme.mode === "light");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Наверх"
          className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-sm transition-colors duration-200 ${
            isLight
              ? "border-slate-300/60 bg-white/80 text-slate-700 hover:bg-white shadow-black/10"
              : "border-white/20 bg-black/50 text-white hover:bg-black/70 shadow-black/40"
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 14V4M4 9L9 4L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
