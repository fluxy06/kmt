import React from "react";
import Icon from '../../shared/Icons/Icon';
import type { Bilbord } from "../../entities/Bilbord/bilbord";

type CardProps = {
  bilbord: Bilbord;
  width?: { min: string; preferred: string; max: string };
};

const Card: React.FC<CardProps> = ({ bilbord, width }) => {
    const widthAdaptive = width
        ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
        : `200px`;

  return (
    <div  className="
     bg-[#202020]
        rounded-2xl
        grid
        grid-rows-[9fr_0.2fr_1fr]
        text-white
        gap-3
        overflow-hidden"
    style={{
        width: widthAdaptive,
        aspectRatio: '3 / 4',
    }}
    > 
        <div className="flex items-center justify-center w-full h-full bg-[#404040] rounded-2xl">
        <Icon
          src={bilbord.imageUrl}
        />
      </div>

      <h2 
      style={{
    textShadow: '0 0 1px #fff, 0 0 1px #fff'
        }}
      className="flex items-center justify-center text-[clamp(24px,4vw,30px)] font-[900] font-[Montserrat_Alternates]">
        {bilbord.title}
      </h2>

      <p className="flex items-start justify-center text-[clamp(8px,2vw,14px)] text-gray-400">
        {bilbord.size}
      </p>
    </div>
  )
};

export default Card;