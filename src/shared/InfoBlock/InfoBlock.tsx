type InfoBlockProps = {
  smile: string;
  title: string;
  description: string;
  width?: { min: string; preferred: string; max: string };
};

const InfoBlock: React.FC<InfoBlockProps> = ({ smile, title, description, width }) => {
  const widthAdaptive = width
    ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
    : `332.97px`;

  return (
    <div
      className="
        info-block
        grid
        theme-surface
        grid-rows-[1fr_1fr_1fr]
        rounded-2xl
        text-left
        p-5
      "
      style={{
        width: widthAdaptive,
        aspectRatio: "16/9",
      }}
    >
      <div className="text-[clamp(18px,4vw,48px)]">{smile}</div>
      <div className="theme-text text-[clamp(12px,3vw,26px)] font-medium font-[Montserrat_Alternates] break-words">
        {title}
      </div>
      <div className="theme-subtext text-balance font-extralight text-[clamp(8px,2vw,24px)] font-[Montserrat_Alternates] break-words overflow-hidden">
        {description}
      </div>
    </div>
  );
};

export default InfoBlock;
