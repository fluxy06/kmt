import React, { useState } from "react";
import Modal from "../../features/Modal/Modal";
import { useAppSelector } from "../../app/store/hooks";

type SizeClamp = {
  min: string;
  preferred: string;
  max: string;
};

type ContactButtonProps =
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
    width?: SizeClamp;
    height?: SizeClamp;
    label: string;
    opensModal?: boolean;
    defaultMessage?: string;
  };


const Contact: React.FC<ContactButtonProps> = ({
  width,
  height,
  label,
  opensModal = true,
  defaultMessage,
  type = "button",
  className,
  ...buttonProps
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLightTheme = useAppSelector((state) => state.theme.mode === "light");
  const widthAdaptive = width
    ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
    : "194.4px";

  const heightAdaptive = height
    ? `clamp(${height.min}, ${height.preferred}, ${height.max})`
    : "40px";

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    buttonProps.onClick?.(event);
    if (!opensModal || buttonProps.disabled || event.defaultPrevented) {
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        {...buttonProps}
        type={type}
        onClick={handleClick}
        style={{
          width: widthAdaptive,
          height: heightAdaptive,
        }}
        className={[
          "group relative shrink-0 overflow-hidden rounded-2xl border font-bold font-[Montserrat_Alternates]",
          "flex items-center justify-center whitespace-nowrap px-4 text-[clamp(13px,1.2vw,18px)]",
          "transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-px",
          "active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          isLightTheme ? "border-emerald-800/60 shadow-[0_8px_20px_rgba(22,109,8,0.25)] focus-visible:ring-emerald-700" : "border-emerald-500/40 shadow-[0_8px_22px_rgba(33,142,11,0.25)] focus-visible:ring-emerald-400",
          className,
        ].filter(Boolean).join(" ")}
        data-theme={isLightTheme ? "light" : "dark"}
      >
        <span
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            isLightTheme
              ? "bg-[linear-gradient(135deg,#25a30b_0%,#1f8f0a_45%,#166d08_100%)] opacity-95"
              : "bg-[linear-gradient(135deg,#2db50f_0%,#218e0b_55%,#1a7408_100%)] opacity-100"
          }`}
        />
        <span
          className="pointer-events-none absolute -inset-y-8 -left-12 w-10 rotate-12 bg-white/30 blur-sm transition-transform duration-500 group-hover:translate-x-52"
          aria-hidden="true"
        />
        <span className="relative z-10 text-white">
          {label}
        </span>
      </button>
      {opensModal && isModalOpen && (
        <Modal defaultMessage={defaultMessage} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};


export default Contact;