import { motion, AnimatePresence } from "framer-motion";
import type { Bilbord } from "../../entities/Bilbord/bilbord";
import Contact from "../../shared/Buttons/Contact";
import { useAppSelector } from "../../app/store/hooks";

type Props = {
  service: Bilbord;
  onClose: () => void;
};

const ServiceModal: React.FC<Props> = ({ service, onClose }) => {
  const isLightTheme = useAppSelector((state) => state.theme.mode === "light");

  const orderMessage = `Хочу заказать: ${service.title}\nРазмер: ${service.size}\nЦена: от ${service.price.toLocaleString("ru-RU")} ₽/мес`;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-hidden ${
          isLightTheme ? "bg-black/30" : "bg-black/70"
        }`}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={`theme-surface relative flex w-full flex-col overflow-hidden rounded-t-3xl shadow-2xl sm:rounded-2xl md:flex-row ${
            isLightTheme ? "bg-white" : ""
          }`}
          style={{
            maxWidth: "min(1170px, 100vw)",
            maxHeight: "90vh",
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            aria-label="Закрыть"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border text-base transition-colors ${
              isLightTheme
                ? "border-slate-200 bg-white/95 text-slate-600 hover:bg-slate-50 shadow-sm"
                : "border-white/20 bg-black/50 text-white hover:bg-black/70"
            }`}
          >
            ✕
          </motion.button>

          {/* Mobile: image header with gradient title overlay */}
          <div className="relative h-52 shrink-0 md:hidden">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/20" />
            <div className="absolute bottom-4 left-4 right-12">
              <h2 className="font-['Montserrat_Alternates'] text-xl font-black leading-tight text-white drop-shadow-lg">
                {service.title}
              </h2>
            </div>
          </div>

          {/* Content column */}
          <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8">
            {/* Title — desktop only (mobile shows it in image overlay) */}
            <h2 className="theme-text hidden pt-8 font-['Montserrat_Alternates'] text-[clamp(22px,3.2vw,40px)] font-black leading-tight md:block">
              {service.title}
            </h2>

            <p className="theme-subtext mt-4 flex-1 font-['Montserrat_Alternates'] text-[clamp(13px,1.5vw,16px)] leading-relaxed md:mt-4">
              {service.description}
            </p>

            <p className="theme-subtext mt-4 text-[13px]">
              Размеры: {service.size}
            </p>

            {/* Price + Order CTA */}
            <div className="mt-5 border-t border-(--border-color) pt-4">
              <div className="mb-4 flex items-baseline gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-4 py-1.5 font-['Montserrat_Alternates'] text-[clamp(20px,2.8vw,28px)] font-black ${
                    isLightTheme
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-[#51d536]/10 text-[#51d536]"
                  }`}
                >
                  от {service.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="theme-subtext text-sm">/мес</span>
              </div>

              <Contact
                width={{ min: "100%", preferred: "100%", max: "100%" }}
                height={{ min: "44px", preferred: "44px", max: "44px" }}
                label="Заказать"
                defaultMessage={orderMessage}
              />
            </div>
          </div>

          {/* Desktop: image column */}
          <div className="hidden md:flex md:flex-1 min-w-0 items-center justify-center overflow-hidden p-4">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="rounded-xl object-cover w-full"
              style={{ aspectRatio: "10 / 12", maxHeight: "78vh" }}
              loading="lazy"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;
