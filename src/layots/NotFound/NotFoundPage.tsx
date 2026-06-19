import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "../Header/header";
import Footer from "../Footer/footer";
import BackgroundCanvas from "../../shared/BackgroundCanvas/BackgroundCanvas";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="theme-page min-h-screen theme-text">
      <BackgroundCanvas />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-['Montserrat_Alternates'] font-black leading-none theme-text"
              style={{ fontSize: "clamp(96px, 20vw, 180px)", opacity: 0.08 }}
            >
              404
            </p>
            <h1
              className="font-['Montserrat_Alternates'] font-black theme-text"
              style={{ fontSize: "clamp(26px, 3.5vw, 48px)", marginTop: "-1rem" }}
            >
              Страница не найдена
            </h1>
            <p
              className="mt-3 font-['Montserrat_Alternates'] theme-subtext"
              style={{ fontSize: "clamp(14px, 1.4vw, 18px)" }}
            >
              Возможно, адрес изменился или страница была удалена
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 rounded-2xl px-8 py-3 font-['Montserrat_Alternates'] font-semibold transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #1a7408 0%, #51d536 100%)",
                color: "#fff",
                fontSize: "clamp(14px, 1.2vw, 16px)",
                boxShadow: "0 0 24px rgba(81,213,54,0.3)",
              }}
            >
              На главную
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default NotFoundPage;
