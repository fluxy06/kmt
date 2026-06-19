import { motion } from "framer-motion";
import { useState } from "react";
import type { Bilbord } from "../../../entities/Bilbord/bilbord";
import { useAdminTheme } from "../../Admin/AdminThemeContext";

type BilInterAdminProps = {
  resource: Bilbord;
  isSelected?: boolean;
  onSelect?: (resource: Bilbord) => void;
  onEdit?: (resource: Bilbord) => void;
  onClick?: (resource: Bilbord) => void;
};

const BilInterAdmin: React.FC<BilInterAdminProps> = ({
  resource,
  isSelected = false,
  onSelect,
  onEdit,
  onClick
}) => {
  const t = useAdminTheme();
  const [loaded, setLoaded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.edit-icon')) {
      return;
    }
    
    if (onSelect) {
      onSelect(resource);
    } else if (onClick) {
      onClick(resource);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(resource);
    }
  };

  // Функция для отображения ID
  const displayId = () => {
    if (!resource.id) return "N/A";
    // Преобразуем в строку, если это число
    const idString = String(resource.id);
    // Берем первые 8 символов
    return idString.substring(0, 8);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`bg-transparent rounded-2xl border-[0.3px] border-[#404040] cursor-pointer overflow-hidden flex flex-col relative w-full transition-all duration-700 ease-out ${
        isSelected
          ? "ring-4 ring-emerald-400/90 shadow-[0_0_30px_rgba(16,185,129,0.45),0_12px_30px_rgba(0,0,0,0.45)]"
          : "ring-2 ring-emerald-900/70 hover:ring-emerald-400/70 hover:shadow-[0_0_18px_rgba(16,185,129,0.25),0_10px_24px_rgba(0,0,0,0.35)]"
      }`}
      style={{
        height: "clamp(320px, calc(70vw * 1.3), 480px)",
      }}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.015 : 1,
        opacity: 1,
        boxShadow: isSelected
          ? "0 0 30px rgba(16,185,129,0.35), 0 12px 30px rgba(0,0,0,0.45)"
          : "0 8px 20px rgba(0,0,0,0.3)",
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 90, damping: 14, mass: 0.8 }}
    >
      {/* Иконка редактирования */}
      <motion.div 
        className="edit-icon absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-black/90 transition-colors duration-300"
        onClick={handleEditClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-white"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
          />
        </svg>
      </motion.div>

      {/* Индикатор выделения */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-10 bg-[#000000] text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          Выбрано
        </div>
      )}

      {/* Картинка */}
      <div className="flex-1 relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
        <motion.img
          src={resource.imageUrl}
          alt={resource.title}
          className="absolute inset-0 h-full w-full object-cover object-center rounded-b-3xl border-0.1 border-b-transparent shadow-2xl"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: loaded ? (isSelected ? 0.92 : 1) : 0,
            scale: 1,
          }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          onLoad={() => setLoaded(true)}
        />
        
        {/* Затемнение при выделении */}
        {isSelected && (
          <div className="absolute inset-0 bg-emerald-400/10 mix-blend-overlay rounded-b-3xl" />
        )}
      </div>

      {/* Текстовая часть */}
      <div className={`h-30.75 flex flex-col font-[Montserrat_Alternates] justify-center items-center p-2 xs:p-3 sm:p-4 relative ${t.isLight ? `${t.surface} ${t.text}` : "bg-[#202020] text-white"}`}>
        <h3 className="text-[clamp(18px,4vw,28px)] font-black text-center">
          {resource.title}
        </h3>
        <p className={`text-[clamp(12px,3vw,16px)] text-center ${t.isLight ? t.subtext : "opacity-80"}`}>
          {resource.size}
        </p>
        <div className={`absolute bottom-2 right-2 text-xs opacity-70 ${t.subtext}`}>
          ID: {displayId()}
        </div>
      </div>
    </motion.div>
  );
};

export default BilInterAdmin;