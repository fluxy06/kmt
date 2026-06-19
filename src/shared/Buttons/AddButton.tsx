import React from "react";

interface AddButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative w-16 h-16 rounded-2xl flex items-center justify-center
                 transition-all duration-300 ease-out
                 hover:scale-105 active:scale-95 focus:outline-none
                 border border-white/20
                 shadow-lg hover:shadow-xl
                 overflow-hidden
                 focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        background: 'green',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25), 0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
      aria-label="Добавить карточку"
    >
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
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          }}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
    </button>
  );
};

export default AddButton;