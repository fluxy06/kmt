import { createContext, useContext } from "react";

export interface AdminThemeColors {
  isLight: boolean;
  pageBg: string;
  sidebar: string;
  surface: string;
  border: string;
  text: string;
  subtext: string;
  input: string;
  divider: string;
  indicatorBg: string;
  iconActive: string;
  iconInactive: string;
}

export const ADMIN_DARK: AdminThemeColors = {
  isLight: false,
  pageBg: "bg-[#151515]",
  sidebar: "border-r border-[#2a2a2a] bg-[#1a1a1a]",
  surface: "bg-[#202020]",
  border: "border-[#333]",
  text: "text-white",
  subtext: "text-gray-400",
  input: "bg-[#2a2a2a] text-white border-[#404040] focus:border-[#44be32]",
  divider: "border-[#333]",
  indicatorBg: "#ffffff",
  iconActive: "text-black",
  iconInactive: "text-white/70",
};

export const ADMIN_LIGHT: AdminThemeColors = {
  isLight: true,
  pageBg: "bg-gradient-to-br from-emerald-50 via-slate-50 to-indigo-50",
  sidebar: "border-r border-white/50 bg-white/55 backdrop-blur-xl",
  surface: "backdrop-blur-xl bg-white/60 border border-white/80 shadow-sm",
  border: "border-white/80",
  text: "text-gray-900",
  subtext: "text-gray-500",
  input: "bg-white/70 text-gray-900 border-gray-200 focus:border-[#218E0B]",
  divider: "border-gray-200",
  indicatorBg: "#1a1a1a",
  iconActive: "text-white",
  iconInactive: "text-gray-400",
};

export const AdminThemeContext = createContext<AdminThemeColors>(ADMIN_DARK);
export const useAdminTheme = () => useContext(AdminThemeContext);
