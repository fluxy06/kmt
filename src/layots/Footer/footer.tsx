import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className=" text-white text-left">
      {/* Верхняя часть */}
      <div className="max-w-[1200px] mx-auto px-6 pt-14 pb-10">

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-12">
          
          {/* Левая колонка */}
          <div className="space-y-3">
            <div className="font-['Montserrat_Alternates'] text-[44px] font-black leading-none">
              Камертон
            </div>
            <p className="text-sm text-white/70 leading-tight">
              Мы создаем рекламу, которая работает.
            </p>
            <p className="text-sm text-white/70 leading-tight">
              Ваш растущий успех — наша лучшая рекомендация.
            </p>

            {/* соцсети */}
            <div className="flex gap-4 pt-2">
              <a href="#" className="
                    transition-all duration-300 ease-out
                    hover:scale-110
                    hover:text-white
                    hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                        IG
                        </a>
              <a href="#" className="transition-all duration-300 ease-out
                            hover:scale-110
                            hover:text-white
                            hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
        TG
        </a>
              <a href="#" className="transition-all duration-300 ease-out
                            hover:scale-110
                            hover:text-white
                            hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
        VK
        </a>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h2 className="font-['Montserrat_Alternates'] text-2xl font-semibold mb-4">
              Навигация по сайту
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-base">
              <a href="#" className="hover:underline">Главная</a>
              <a href="#" className="hover:underline">Услуги</a>
              <a href="#" className="hover:underline">О нас</a>
              <a href="#" className="hover:underline">Контакты</a>
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h2 className="font-['Montserrat_Alternates'] text-xl font-semibold mb-3">
              Наши контакты
            </h2>
            <p className="text-base">T: 8 (930) 803-33-10</p>
            <p className="text-base">T: +7 (986) 750-62-00</p>
            <p className="text-base leading-tight mt-1">
              ул. Ленина, 180,<br />г. Богородск, 607600
            </p>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden text-center space-y-8">
          <div>
            <h1 className="font-black text-4xl font-['Montserrat_Alternates']">
              Камертон
            </h1>
            <p className="text-xs text-white/80 mt-2">
                Мы создаем рекламу, которая работает.
            </p>
          </div>

          <div className="flex justify-center gap-10">
            <a href="#" className="hover:opacity-80 transition">IG</a>
            <a href="#" className="hover:opacity-80 transition">TG</a>
            <a href="#" className="hover:opacity-80 transition">VK</a>
          </div>

          <div>
            <p className="font-bold text-lg font-['Montserrat_Alternates'] mb-2">
              Наши контакты
            </p>
            <p>8 (800) 201-80-52</p>
            <p>+7 (831) 436-48-48</p>
            <p>+7 (831) 436-48-48</p>
          </div>

          <div>
            <p className="font-bold text-lg font-['Montserrat_Alternates'] mb-2">
              Навигация
            </p>
            <div className="flex flex-col gap-2 text-white/80">
              <a href="#" className="hover:text-white">Продукция</a>
              <a href="#" className="hover:text-white">Контакты</a>
              <a href="#" className="hover:text-white">Доставка</a>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть */}
      <div className="border-t border-white/20">
        <div className="max-w-[1200px] mx-auto px-6 py-4
                        flex flex-col md:flex-row
                        justify-between items-center
                        gap-3 text-sm">
          <a href="#" className="hover:underline">
            Политика конфиденциональности
          </a>
          <a href="#" className="hover:underline">
            Договор оферты
          </a>
          <a href="#" className="hover:underline text-white/70">
            Разработка сайта — GoStack
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
