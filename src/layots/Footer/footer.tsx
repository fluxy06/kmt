import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { HomeScrollTarget } from "../../shared/lib/navigation";
import { scrollElementToViewportCenter, scrollToTop } from "../../shared/lib/scroll";
import { useAppSelector } from "../../app/store/hooks";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const config = useAppSelector((s) => s.siteConfig.config);

  const navigateToSection = (sectionId: HomeScrollTarget) => {
    const requestId = `${Date.now()}-${sectionId}`;

    if (pathname !== "/") {
      navigate("/", { state: { scrollTarget: sectionId, requestId } });
      return;
    }

    const target = document.getElementById(sectionId);
    if (!target) {
      navigate("/", { state: { scrollTarget: sectionId, requestId } });
      return;
    }

    scrollElementToViewportCenter(target, "smooth");
  };

  const goToTop = () => {
    if (pathname !== "/") { navigate("/"); return; }
    scrollToTop("smooth");
  };

  const tgHandle = config.telegramHandle.replace("@", "");
  const tgUrl = `https://t.me/${tgHandle}`;

  return (
    <footer className="text-left theme-text">
      <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-10">

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-12">

          <div className="space-y-3">
            <div className="font-['Montserrat_Alternates'] text-[44px] font-black leading-none">
              {config.companyName}
            </div>

            <p className="text-sm theme-subtext leading-tight">{config.aboutText}</p>

            <p className="text-sm theme-subtext leading-tight">
              Ваш растущий успех — наша лучшая рекомендация.
            </p>

            <div className="flex gap-4 pt-2">
              <a href={tgUrl} target="_blank" rel="noreferrer"
                className="transition-all duration-300 hover:scale-110 hover:opacity-80"
                aria-label="Telegram">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.91l-2.968-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.535-.194 1.003.13.726.648z"/>
                </svg>
              </a>
              {config.vkGroupUrl && (
                <a href={config.vkGroupUrl} target="_blank" rel="noreferrer"
                  className="transition-all duration-300 hover:scale-110 hover:opacity-80"
                  aria-label="ВКонтакте">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.818.615.422 1.082.33 1.082.33l2.172-.03s1.136-.071.598-1.022c-.044-.077-.313-.659-1.61-1.861-1.359-1.259-1.176-1.056.46-3.234.999-1.332 1.398-2.146 1.272-2.494-.12-.332-.854-.244-.854-.244l-2.446.015s-.181-.025-.315.055c-.132.078-.217.261-.217.261s-.386 1.026-.901 1.899c-1.085 1.847-1.52 1.945-1.697 1.83-.412-.267-.309-1.075-.309-1.648 0-1.793.272-2.54-.529-2.733-.266-.065-.461-.107-1.141-.115-.872-.009-1.609.003-2.025.207-.278.135-.493.437-.362.454.162.021.528.099.722.363.25.341.241 1.107.241 1.107s.144 2.11-.336 2.372c-.329.18-.781-.187-1.75-1.865-.497-.859-.872-1.81-.872-1.81s-.072-.177-.202-.272c-.157-.115-.376-.151-.376-.151l-2.322.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.395c1.886 1.97 4.029 1.84 4.029 1.84h.972z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-['Montserrat_Alternates'] text-2xl font-semibold mb-4">
              Навигация по сайту
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-base">
              <button onClick={goToTop} className="text-left hover:underline">Главная</button>
              <button onClick={() => navigateToSection("services")} className="text-left hover:underline">Услуги</button>
              <button onClick={() => navigate("/about")} className="text-left hover:underline">О нас</button>
              <button onClick={() => navigateToSection("contacts")} className="text-left hover:underline">Контакты</button>
            </div>
          </div>

          <div>
            <h2 className="font-['Montserrat_Alternates'] text-xl font-semibold mb-3">
              Наши контакты
            </h2>
            {config.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`}
                className="block text-base transition-opacity hover:opacity-75">
                T: {p}
              </a>
            ))}
            <p className="text-base leading-tight mt-1">{config.address}</p>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden text-center space-y-8">

          <div>
            <h1 className="font-black text-4xl font-['Montserrat_Alternates']">
              {config.companyName}
            </h1>
            <p className="text-xs theme-subtext mt-2">{config.aboutText}</p>
          </div>

          <div className="flex justify-center gap-8">
            <a href={tgUrl} target="_blank" rel="noreferrer" className="hover:opacity-80 transition hover:scale-110" aria-label="Telegram">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.43 13.91l-2.968-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.535-.194 1.003.13.726.648z"/>
              </svg>
            </a>
            {config.vkGroupUrl && (
              <a href={config.vkGroupUrl} target="_blank" rel="noreferrer" className="hover:opacity-80 transition hover:scale-110" aria-label="ВКонтакте">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.19 1.365 1.26 2.179 1.818.615.422 1.082.33 1.082.33l2.172-.03s1.136-.071.598-1.022c-.044-.077-.313-.659-1.61-1.861-1.359-1.259-1.176-1.056.46-3.234.999-1.332 1.398-2.146 1.272-2.494-.12-.332-.854-.244-.854-.244l-2.446.015s-.181-.025-.315.055c-.132.078-.217.261-.217.261s-.386 1.026-.901 1.899c-1.085 1.847-1.52 1.945-1.697 1.83-.412-.267-.309-1.075-.309-1.648 0-1.793.272-2.54-.529-2.733-.266-.065-.461-.107-1.141-.115-.872-.009-1.609.003-2.025.207-.278.135-.493.437-.362.454.162.021.528.099.722.363.25.341.241 1.107.241 1.107s.144 2.11-.336 2.372c-.329.18-.781-.187-1.75-1.865-.497-.859-.872-1.81-.872-1.81s-.072-.177-.202-.272c-.157-.115-.376-.151-.376-.151l-2.322.015s-.348.01-.476.161c-.114.135-.009.414-.009.414s1.816 4.25 3.872 6.395c1.886 1.97 4.029 1.84 4.029 1.84h.972z"/>
                </svg>
              </a>
            )}
          </div>

          <div>
            <p className="font-bold text-lg font-['Montserrat_Alternates'] mb-2">Наши контакты</p>
            {config.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/[^\d+]/g, "")}`}
                className="block transition-opacity hover:opacity-75">
                {p}
              </a>
            ))}
          </div>

          <div>
            <p className="font-bold text-lg font-['Montserrat_Alternates'] mb-2">Навигация</p>
            <div className="flex flex-col gap-2 theme-subtext">
              <button onClick={goToTop} className="hover:text-white">Главная</button>
              <button onClick={() => navigateToSection("services")} className="hover:text-white">Услуги</button>
              <button onClick={() => navigate("/about")} className="hover:text-white">О нас</button>
              <button onClick={() => navigateToSection("contacts")} className="hover:text-white">Контакты</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <a href="/privacy-policy" className="hover:underline">Политика конфиденциальности</a>
          <a href="/offer-agreement" className="hover:underline">Договор оферты</a>
          <a href={tgUrl} target="_blank" rel="noreferrer" className="hover:underline theme-subtext">
            whysofly | tg: {config.telegramHandle}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
