import React from "react";

type IconProps = {
  active?: boolean;
  size?: number;
};

const AdminServicesIcon: React.FC<IconProps> = ({ active = false, size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "all 0.3s ease" }}
    >
      {/* Круги */}
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke={active ? "#fff" : "#999"}
        strokeWidth="2"
        style={{ transition: "stroke 0.3s ease" }}
      />
      <circle
        cx="28"
        cy="28"
        r="8"
        stroke={active ? "#fff" : "#999"}
        strokeWidth="2"
        style={{ transition: "stroke 0.3s ease" }}
      />

      {/* Плюс */}
      <line
        x1="28"
        y1="24"
        x2="28"
        y2="32"
        stroke={active ? "#fff" : "#999"}
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: "stroke 0.3s ease" }}
      />
      <line
        x1="24"
        y1="28"
        x2="32"
        y2="28"
        stroke={active ? "#fff" : "#999"}
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: "stroke 0.3s ease" }}
      />

      {/* Минус */}
      <line
        x1="8"
        y1="12"
        x2="16"
        y2="12"
        stroke={active ? "#fff" : "#999"}
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: "stroke 0.3s ease" }}
      />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="16"
        stroke={active ? "#fff" : "#999"}
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: "stroke 0.3s ease" }}
      />
    </svg>
  );
};

export default AdminServicesIcon;
