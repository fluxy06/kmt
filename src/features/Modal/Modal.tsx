import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Contact from "../../shared/Buttons/Contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "../Modal/model/schema";
import type { ContactFormValues } from "../Modal/model/schema";
import { createPortal } from "react-dom";
import { buildApiUrl } from "../../shared/lib/api";

type ModalProps = {
  onClose?: () => void;
  defaultMessage?: string;
};

const Modal: React.FC<ModalProps> = ({ onClose, defaultMessage }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
    defaultValues: { message: defaultMessage ?? "" },
  });

  const formatRussianPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let normalized = digits;
    if (normalized.startsWith("8") || normalized.startsWith("7")) {
      normalized = normalized.slice(1);
    }
    normalized = normalized.slice(0, 10);
    if (!normalized) {
      return "";
    }

    let result = "+7";
    if (normalized.length <= 3) {
      return `${result} (${normalized}`;
    }

    result += ` (${normalized.slice(0, 3)})`;

    if (normalized.length <= 6) {
      return `${result} ${normalized.slice(3)}`;
    }

    result += ` ${normalized.slice(3, 6)}`;

    if (normalized.length <= 8) {
      return `${result}-${normalized.slice(6)}`;
    }

    return `${result}-${normalized.slice(6, 8)}-${normalized.slice(8, 10)}`;
  };

  const onSubmit = async (data: ContactFormValues) => {
    const { privacyConsent, ...payload } = data;

    if (!privacyConsent) {
      return;
    }

    try {
      const res = await fetch(buildApiUrl("/kmt/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Ошибка отправки");
      }

      setShowAlert(true);
      reset();
      setTimeout(() => setShowAlert(false), 3000);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-150 flex items-start sm:items-center justify-center overflow-y-auto px-4 py-4 sm:py-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="
          relative
          w-full
          max-w-[440px]
          max-h-[calc(100dvh-2rem)]
          sm:max-h-[min(90dvh,780px)]
          bg-white/95
          rounded-2xl
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          px-[clamp(16px,3vw,28px)]
          py-[clamp(16px,3vw,24px)]
          overflow-y-auto
          overscroll-contain
          [-webkit-overflow-scrolling:touch]
        "
      >
        <button
          type="button"
          aria-label="Закрыть"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#404040] hover:text-black transition hover:font-bold"
        >
          ✕
        </button>
        {/* Header */}
        <div className="text-center">
          <h2 className="font-bold text-black font-[Montserrat_Alternates] text-[clamp(18px,2.4vw,28px)]">
            Связаться с нами
          </h2>
          <p className="mt-2 text-black/50 font-medium font-[Montserrat_Alternates] text-[clamp(12px,1.8vw,14px)]">
            Для связи с нами оставьте заявку
          </p>
        </div>

        <motion.div
          layout
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="grid gap-[clamp(10px,1.5vw,16px)] mt-4"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-[clamp(10px,1.5vw,16px)]">
            {[
              { label: "Имя", type: "text", key: "name" },
              { label: "Email", type: "email", key: "email" },
              { label: "Номер телефона", type: "tel", key: "phone" },
            ].map(({ label, type, key }) => (
              <div key={key} className="flex flex-col">
                <label className="text-left text-black text-[clamp(12px,1.6vw,14px)] mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  inputMode={key === "phone" ? "tel" : undefined}
                  placeholder={key === "phone" ? "+7 (999) 999-99-99" : undefined}
                  {...register(key as keyof ContactFormValues, {
                    onChange:
                      key === "phone"
                        ? (event) => {
                            const formatted = formatRussianPhone(event.target.value);
                            event.target.value = formatted;
                            setValue("phone", formatted, { shouldValidate: true });
                          }
                        : undefined,
                  })}
                  className="
                    w-full
                    rounded-lg
                    bg-gray-200
                    border border-green-900/20
                    shadow-sm
                    px-3 py-2
                    text-black
                    outline-none
                    text-[clamp(12px,1.6vw,14px)]
                  "
                />
                {errors[key as keyof ContactFormValues] && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors[key as keyof ContactFormValues]?.message}
                  </span>
                )}
              </div>
            ))}

            <div className="flex flex-col">
              <label className="text-left text-black text-[clamp(12px,1.6vw,14px)] mb-1">
                Сообщение
              </label>
              <textarea
                rows={3}
                {...register("message")}
                className="
                  w-full
                  resize-none
                  rounded-lg
                  bg-gray-200
                  border border-green-900/20
                  shadow-sm
                  px-3 py-2
                  text-black
                  outline-none
                  text-[clamp(12px,1.6vw,14px)]
                "
              />
              {errors.message && (
                <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>
              )}
            </div>


            <div className="rounded-2xl border border-[#4A7666]/30 bg-gradient-to-br from-[#E9F2EC] to-[#DDEBDF] px-4 py-3 shadow-[0_10px_22px_rgba(74,118,102,0.15)]">
              <label className="group flex cursor-pointer items-start gap-3 text-[clamp(11px,1.5vw,13px)] leading-snug text-black/85">
                <input
                  type="checkbox"
                  {...register("privacyConsent")}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#4A7666]/60 bg-white transition-all duration-200 group-hover:border-[#4A7666] peer-checked:border-[#4A7666] peer-checked:bg-[#4A7666] [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 text-white transition-opacity duration-200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8.2L6.2 11.2L13 4.8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  Я даю согласие на обработку персональных данных и принимаю{' '}
                  <Link
                        to="/privacy-policy"
                        target="_blank"
                        className="font-semibold !text-black underline underline-offset-2 hover:no-underline !text-[13px]"
                      >
                        Политику конфиденциальности
                </Link>
                </span>
              </label>
              {errors.privacyConsent && (
                <span className="mt-2 block text-xs font-medium text-red-600">
                  {errors.privacyConsent.message}
                </span>
              )}
            </div>

            {/* Кнопка */}
            <div className="flex justify-center py-4">
              <Contact
                disabled={isSubmitting}
                width={{ min: "150.33px", preferred: "16.2vw", max: "194.4px" }}
                height={{ min: "30.7px", preferred: "calc(16.2vw * 0.206)", max: "40px" }}
                label="Связаться"
                type="submit"
                opensModal={false}
              />
            </div>
          </form>

          {/* Уведомления под формой */}
          <AnimatePresence>
            {showAlert && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-[#51d536] text-black px-6 py-4 rounded-xl shadow-lg font-semibold text-base text-center"
              >
                Заявка успешно отправлена!
              </motion.div>
            )}
            {showError && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg font-semibold text-base text-center"
              >
                Не удалось отправить заявку. Попробуйте позже.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body,
  );
};

export default Modal;