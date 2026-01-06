import React from "react";

type IconProps = {
    src: string;
    width?: { min: string; preferred: string; max: string };
    height?: { min: string; preferred: string; max: string };
};


const Icon: React.FC<IconProps> = ({ src, width, height}) => {
    const widthAdaptive = width
        ? `clamp(${width.min}, ${width.preferred}, ${width.max})`
        : `194.4px`;

    const heightAdaptive = height
        ? `clamp(${height.min}, ${height.preferred}, ${height.max})`
        : '40px';

    if (!src) return null;
    
    return <img src={src} alt="icon" className="w-full h-full object-contain"  style={{width: widthAdaptive, height: heightAdaptive}}/>;
}

export default Icon;