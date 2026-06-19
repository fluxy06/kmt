type AnchorButtonProprs = {
  label: string;
  onClick?: () => void;
  width?: { min: string; preferred: string; max: string };
};

const AnchorButton: React.FC<AnchorButtonProprs> = ({ label, onClick, width }) => {
  const widthAdaptive = width
    ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
    : `160px`;

  return (
    <button
      onClick={onClick}
      style={{ width: widthAdaptive, height: "35px" }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        cursor-pointer
        border border-[var(--border-color)]
        bg-[var(--surface)]
        shadow-[0_8px_20px_rgba(2,6,23,0.16)]
        font-[Montserrat_Alternates]
        text-[clamp(14px,2vw,24px)]
        theme-text

        transition-all
        duration-300
        ease-out

        hover:-translate-y-[2px]
        hover:scale-[1.02]
        hover:brightness-105
        hover:shadow-[0_12px_30px_rgba(2,6,23,0.2)]

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
            "radial-gradient(140% 140% at 50% -10%, rgba(255,255,255,0.4), transparent 55%)",
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
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)",
        }}
      />

      <span className="relative z-10">{label}</span>
    </button>
  );
};

export default AnchorButton;
