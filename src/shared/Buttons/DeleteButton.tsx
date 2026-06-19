import React, { useState, useRef } from "react";

interface DeleteButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClick && !disabled) onClick();
  };

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      className="relative w-16 h-16 rounded-2xl flex items-center justify-center
                 transition-all duration-300 ease-out
                 hover:scale-105 active:scale-95 focus:outline-none
                 border border-white/20
                 shadow-lg hover:shadow-xl
                 overflow-hidden
                 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        background: disabled 
          ? 'linear-gradient(135deg, #71717A 0%, #52525B 50%, #3F3F46 100%)'
          : 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
        boxShadow: disabled 
          ? '0 4px 15px rgba(113, 113, 122, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)'
          : '0 4px 15px rgba(239, 68, 68, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      aria-label="Удалить выбранные карточки"
    >
      {!disabled && (
        <div 
          className={`absolute inset-0 rounded-2xl transition-opacity duration-300
                     ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'radial-gradient(circle at center, rgba(248, 113, 113, 0.4) 0%, transparent 70%)',
          }}
        />
      )}
      
      <div className="relative z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ease-out ${
            isHovered && !disabled ? 'scale-110' : 'scale-100'
          }`}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
        >
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
        </svg>
      </div>
    </button>
  );
};

export default DeleteButton;