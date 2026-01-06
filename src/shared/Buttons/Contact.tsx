import React from "react";


type ContactButtonProps = {
  onClick?: () => void;
  width?: { min: string; preferred: string; max: string };
  height?: { min: string; preferred: string; max: string };
  label: string
};


const Contact: React.FC<ContactButtonProps> = ({onClick, width, height, label}) => {

  const widthAdaptive = width
        ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
        : `194.4px`;

    const heightAdaptive = height
        ? `clamp(${height.min}, ${height.preferred}, ${height.max})`
        : '40px';


  return (
    <>
      <button
          onClick={onClick}
          style={{
            width: widthAdaptive,
            height: heightAdaptive,
          }}
          className="
            bg-[#218E0B]
            rounded-2xl
            text-white
            text-[clamp(14px,2vw,20px)]
            font-bold
            font-['Montserrat_Alternates']

            transition-transform
            duration-300
            ease-out

            hover:scale-[1.04]
            hover:shadow-[0_8px_24px_rgba(33,142,11,0.35)]

            active:scale-[0.97]
            active:shadow-[0_4px_12px_rgba(33,142,11,0.25)]
          "
        >
          {label}
      </button>
    </>
  )
}

export default Contact;