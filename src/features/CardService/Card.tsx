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
     relative
        rounded-2xl
        grid
        grid-rows-[9fr_0.2fr_1fr]
        text-white
        gap-0
        overflow-hidden"
    style={{
        width: widthAdaptive,
        aspectRatio: '3 / 4',
    }}
    > 
    <ArrowButton />
        <div className="flex items-center justify-center w-full h-full bg-[#404040] rounded-2xl">
        <Icon
          src={bilbord.imageUrl}
        />
      </div>

      <h2 
      style={{
    textShadow: '0 0 1px #fff, 0 0 1px #fff'
        }}
      className="flex items-center justify-center text-[clamp(24px,4vw,30px)] pt-3 font-[900] font-[Montserrat_Alternates]">
        {bilbord.title}
      </h2>

      <p className="flex items-start justify-center text-[clamp(8px,2vw,14px)] text-gray-400">
        {bilbord.size}
      </p>
    </div>
  )
};

export default Card;


const ArrowButton = () => (
  <button
    className="
      absolute
      top-3
      right-3
      z-10
      w-10
      h-10
      rounded-full
      bg-white
      flex
      items-center
      justify-center
      hover:scale-105
      transition-transform
      cursor-pointer
      duration-300
      delay-75
    "
    aria-label="open"
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: 'rotate(-45deg)' }}
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  </button>
);
