import React, { type JSX } from "react";
import { useAdminTheme } from "../../features/Admin/AdminThemeContext";

export type AdminPanel = "analytics" | "services" | "portfolio" | "leads" | "testimonials" | "settings";

type SwitchProps = {
  active: AdminPanel;
  onChange: (panel: AdminPanel) => void;
  newLeadsCount?: number;
};

const ITEM_HEIGHT = 80;
const CIRCLE_SIZE = 68;
const PADDING = 6;

const Switch: React.FC<SwitchProps> = ({ active, onChange, newLeadsCount = 0 }) => {
  const adminTheme = useAdminTheme();

  const panels: { type: AdminPanel; icon: JSX.Element }[] = [
    {
      type: "analytics",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V9m4 8V5m4 12v-6" />
        </svg>
      ),
    },
    {
      type: "services",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      type: "portfolio",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: "leads",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      type: "testimonials",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      type: "settings",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const activeIndex = panels.findIndex((p) => p.type === active);
  const indicatorTop = PADDING + activeIndex * ITEM_HEIGHT + (ITEM_HEIGHT - CIRCLE_SIZE) / 2;
  const containerHeight = PADDING * 2 + panels.length * ITEM_HEIGHT;

  return (
    <div
      className={`relative rounded-3xl ${adminTheme.isLight ? "bg-gray-100" : "bg-[#202020]"}`}
      style={{ width: 76, height: containerHeight }}
    >
      {/* Sliding indicator */}
      <div
        className="absolute rounded-full shadow-lg"
        style={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          top: indicatorTop,
          left: (76 - CIRCLE_SIZE) / 2,
          backgroundColor: adminTheme.indicatorBg,
          transition: "top 420ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Icon buttons */}
      {panels.map((panel) => {
        const isActive = active === panel.type;
        return (
          <button
            key={panel.type}
            type="button"
            className="absolute flex items-center justify-center focus:outline-none"
            style={{
              width: 76,
              height: ITEM_HEIGHT,
              top: PADDING + panels.indexOf(panel) * ITEM_HEIGHT,
              left: 0,
            }}
            onClick={() => onChange(panel.type)}
          >
            <div className={`relative z-10 transition-colors duration-300 ${isActive ? adminTheme.iconActive : adminTheme.iconInactive}`}>
              {panel.icon}
              {panel.type === "leads" && newLeadsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-4 text-center">
                  {newLeadsCount > 99 ? "99+" : newLeadsCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Switch;
