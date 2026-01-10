import React from "react";


type AnchorButtonProprs = {
    label: string;
    onClick?: () => void;
    width?: { min: string; preferred: string; max: string };
}


const AnchorButton: React.FC<AnchorButtonProprs> = ({ label, onClick, width }) => {
  const widthAdaptive = width
    ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
    : `160px`;

  return (
    <button
      onClick={onClick}
      style={{ width: widthAdaptive, height: '35px' }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        cursor-pointer
        bg-[#404040]
        shadow-[0_3px_15px_rgba(255,255,255,0.18)]
        font-[Montserrat_Alternates]
        text-[clamp(14px,2vw,24px)]
        text-white

        transition-all
        duration-300
        ease-out

        hover:-translate-y-[2px]
        hover:scale-[1.02]
        hover:bg-[#505050]
        hover:shadow-[0_12px_30px_rgba(255,255,255,0.18)]

        active:scale-[0.98]
        active:translate-y-[0px]
      "
    >
      {/* внешняя подсветка */}
      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-2xl
          opacity-0
          transition-opacity
          duration-300
          hover:opacity-100
        "
        style={{
          background:
            'radial-gradient(140% 140% at 50% -10%, rgba(255,255,255,0.45), transparent 55%)',
        }}
      />

      {/* внутренняя мягкая рамка */}
      <span
        className="
          pointer-events-none
          absolute
          inset-[1px]
          rounded-[15px]
          opacity-0
          transition-opacity
          duration-300
          hover:opacity-100
        "
        style={{
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
        }}
      />

      <span className="relative z-10">
        {label}
      </span>
    </button>
  );
};



export default AnchorButton;