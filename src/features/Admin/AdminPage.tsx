import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { toggleTheme } from "../../app/store/themeSlice";
import Switch from "../../shared/Switch/Switch";
import AnalyticsPanel from "./Panels/AnalyticsPanel";
import ServicesPanel from "./Panels/ServicesPanel";
import PortfolioPanel from "./Panels/PortfolioPanel";
import SiteConfigPanel from "./Panels/SiteConfigPanel";
import LeadsPanel from "./Panels/LeadsPanel";
import TestimonialsPanel from "./Panels/TestimonialsPanel";
import AdminLogo from "../../assets/img/LogoAdmin.svg";
import { AdminThemeContext, ADMIN_DARK, ADMIN_LIGHT } from "./AdminThemeContext";
import { buildApiUrl } from "../../shared/lib/api";

export type AdminPanel = "analytics" | "services" | "portfolio" | "leads" | "testimonials" | "settings";

const AdminPage = () => {
  const { token: urlToken } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLight = useAppSelector((s) => s.theme.mode === "light");
  const adminTheme = isLight ? ADMIN_LIGHT : ADMIN_DARK;
  const [activePanel, setActivePanel] = useState<AdminPanel>("analytics");
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  // Токен из URL сохраняем в sessionStorage и сразу убираем из адресной строки,
  // чтобы он не оставался в истории браузера и заголовке Referer
  const [token] = useState<string | null>(() => {
    if (urlToken && urlToken.length >= 10) {
      sessionStorage.setItem("adminToken", urlToken);
      return urlToken;
    }
    return sessionStorage.getItem("adminToken");
  });

  const refreshLeadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(buildApiUrl("/api/kmt/admin/contacts/new-count"), {
        cache: "no-store",
        headers: { "X-ADMIN-TOKEN": token },
      });
      if (res.ok) {
        const data = await res.json() as { count: number };
        setNewLeadsCount(data.count);
      }
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => {
    document.body.classList.add("admin-page");
    return () => document.body.classList.remove("admin-page");
  }, []);

  useEffect(() => { refreshLeadCount(); }, [refreshLeadCount]);

  if (!token || token.length < 10) {
    return <Navigate to="/" replace />;
  }

  if (urlToken) {
    return <Navigate to="/kmt/admin" replace />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/", { replace: false });
  };

  return (
    <AdminThemeContext.Provider value={adminTheme}>
      <div className={`w-screen h-screen flex overflow-hidden ${adminTheme.pageBg} ${adminTheme.text}`}>

        {/* Sidebar */}
        <aside className={`flex flex-col items-center w-[100px] shrink-0 pt-5 gap-8 ${adminTheme.sidebar}`}>
          <img src={AdminLogo} alt="Admin Logo" className="mt-5" />
          <Switch active={activePanel} onChange={setActivePanel} newLeadsCount={newLeadsCount} />

          <div className="mt-auto pb-5 flex flex-col items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 focus:outline-none ${isLight ? "bg-gray-100 hover:bg-gray-200" : "bg-[#202020] hover:bg-[#404040]"}`}
              aria-label="Переключить тему"
              title={isLight ? "Тёмная тема" : "Светлая тема"}
            >
              {isLight ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`w-[76px] h-[76px] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500/10 active:scale-95 focus:outline-none ${isLight ? "bg-gray-100" : "bg-[#202020]"}`}
              aria-label="Выйти"
            >
              <svg className={`w-6 h-6 ${isLight ? "text-gray-700" : "text-white"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 h-full overflow-auto p-6">
          {activePanel === "analytics" && <AnalyticsPanel token={token} />}
          {activePanel === "services" && <ServicesPanel token={token} />}
          {activePanel === "portfolio" && <PortfolioPanel token={token} />}
          {activePanel === "leads" && <LeadsPanel token={token} onStatusChanged={refreshLeadCount} />}
          {activePanel === "testimonials" && <TestimonialsPanel token={token} />}
          {activePanel === "settings" && <SiteConfigPanel token={token} />}
        </main>
      </div>
    </AdminThemeContext.Provider>
  );
};

export default AdminPage;
