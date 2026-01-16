import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Contact from "../../shared/Buttons/Contact";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "../Modal/model/schema";
import type { ContactFormValues } from "../Modal/model/schema";

const Modal: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    setShowAlert(true);
    reset();
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="
          w-[clamp(288px,36.7vw,440px)]
          bg-white/95
          rounded-2xl
          shadow-xl
          px-[clamp(16px,3vw,28px)]
          py-[clamp(16px,3vw,24px)]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="font-bold text-black font-[Montserrat_Alternates] text-[clamp(18px,2.4vw,28px)]">
            Связаться с нами
          </h2>
          <p className="mt-2 text-black/50 font-medium font-[Montserrat_Alternates] text-[clamp(12px,1.8vw,14px)]">
            Для связи с нами оставьте заявку
          </p>
        </div>

        {/* Форма + alert */}
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
                  {...register(key as keyof ContactFormValues)}
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

            {/* Кнопка */}
            <div className="flex justify-center py-4">
              <Contact
                disabled={isSubmitting}
                width={{ min: "150.33px", preferred: "16.2vw", max: "194.4px" }}
                height={{ min: "30.7px", preferred: "calc(16.2vw * 0.206)", max: "40px" }}
                label="Связаться"
              />
            </div>
          </form>

          {/* Alert под формой */}
          <AnimatePresence>
            {showAlert && (
              <motion.div
                layout
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="
                  mt-4
                  bg-green-500 text-white
                  px-6 py-4
                  rounded-xl
                  shadow-lg
                  font-medium text-base text-center
                "
              >
                Заявка успешно отправлена!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Modal;
