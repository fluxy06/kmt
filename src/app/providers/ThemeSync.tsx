import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { THEME_STORAGE_KEY } from "../store/themeSlice";

const ThemeSync = () => {
  const mode = useAppSelector(state => state.theme.mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return null;
};

export default ThemeSync;
