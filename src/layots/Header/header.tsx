import React from "react";
import Contact from "../../shared/Buttons/Contact";

const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-transparent/60 border-b border-white/10">
            <div className="max-w-[1200px] mx-auto flex items-center px-6 py-4">
                
                {/* Логотип */}
                <div className="font-bold text-[clamp(24px,2vw,36px)] font-[Montserrat_Alternates] max-[700px]:hidden text-white">
                    КАМЕРТОН
                </div>

                {/* Навигация */}
                <div className="
                    flex items-center gap-6 ml-auto
                    max-[700px]:ml-0
                    max-[700px]:w-full
                    max-[700px]:justify-center
                ">
                    <a
                        href="#"
                        className="relative transition-all duration-300 hover:opacity-80
                                   after:absolute after:left-0 after:-bottom-1 after:h-[1px]
                                   after:w-0 after:bg-current after:transition-all after:duration-300
                                   hover:after:w-full"
                    >
                        о нас
                    </a>

                    <a
                        href="#"
                        className="relative transition-all duration-300 hover:opacity-80
                                   after:absolute after:left-0 after:-bottom-1 after:h-[1px]
                                   after:w-0 after:bg-current after:transition-all after:duration-300
                                   hover:after:w-full"
                    >
                        услуги
                    </a>

                    <a
                        href="#"
                        className="relative transition-all duration-300 hover:opacity-80
                                   after:absolute after:left-0 after:-bottom-1 after:h-[1px]
                                   after:w-0 after:bg-current after:transition-all after:duration-300
                                   hover:after:w-full"
                    >
                        контакты
                    </a>

                    <Contact
                        width={{ min: "110.33px", preferred: "16.2vw", max: "194.4px" }}
                        height={{ min: "22.7px", preferred: "calc(16.2vw * 0.206)", max: "40px" }}
                        label="Связаться"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
