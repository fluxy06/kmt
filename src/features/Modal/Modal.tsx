import React from "react";
import { motion } from "framer-motion";
import Contact from "../../shared/Buttons/Contact";

const Modal: React.FC = () => {
  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="
          grid
          grid-rows-[auto_auto_1fr_auto]
          w-[clamp(288px,36.7vw,440px)]
          aspect-[440/540]
          bg-white/95
          rounded-2xl
          shadow-xl
          px-[clamp(16px,3vw,28px)]
          py-[clamp(14px,2.6vw,22px)]
        "
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="font-bold text-black font-[Montserrat_Alternates] text-[clamp(18px,2.4vw,28px)]">
            Связаться с нами
          </h2>
          <p className="mt-[clamp(4px,1vw,8px)] text-black/50 font-medium font-[Montserrat_Alternates] text-[clamp(12px,1.8vw,14px)]">
            Для связи с нами оставьте заявку
          </p>
        </div>

        {/* Form */}
        <div className="grid gap-[clamp(8px,1.4vw,12px)] content-start">
          {[
            { label: "Имя", type: "text" },
            { label: "Email", type: "email" },
            { label: "Номер телефона", type: "tel" },
          ].map(({ label, type }) => (
            <div key={label} className="flex flex-col items-start">
              <label className="mb-1 text-black text-[clamp(12px,1.6vw,14px)]">
                {label}
              </label>
              <input
                type={type}
                className="
                  w-full
                  rounded-lg
                  bg-gray-100
                  border
                  border-gray-300
                  px-[clamp(8px,1.2vw,12px)]
                  py-[clamp(6px,1vw,8px)]
                  text-black
                  text-[clamp(12px,1.6vw,14px)]
                  outline-none
                "
              />
            </div>
          ))}

          <div className="flex flex-col items-start">
            <label className="mb-1 text-black text-[clamp(12px,1.6vw,14px)]">
              Сообщение
            </label>
            <textarea
              rows={3}
              className="
                w-full
                resize-none
                rounded-lg
                bg-gray-100
                border
                border-gray-300
                px-[clamp(8px,1.2vw,12px)]
                py-[clamp(6px,1vw,8px)]
                text-black
                text-[clamp(12px,1.6vw,14px)]
                outline-none
              "
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center py-5">
          <Contact
            width={{ min: "150.33px", preferred: "16.2vw", max: "194.4px" }}
            height={{ min: "30.7px", preferred: "calc(16.2vw * 0.206)", max: "40px" }}
            label="Связаться"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
