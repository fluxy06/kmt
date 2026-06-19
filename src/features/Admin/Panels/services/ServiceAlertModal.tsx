type ServiceAlertModalProps = {
  title: string;
  description?: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  tone?: "success" | "warning" | "danger";
  disableActions?: boolean;
};

const toneStyles = {
  success: "border-[#44be32]/40 text-[#44be32]",
  warning: "border-amber-400/40 text-amber-300",
  danger: "border-red-500/40 text-red-400",
};

const toneButtonStyles = {
  success: "bg-[#218E0B] hover:bg-[#31ea0c]",
  warning: "bg-amber-500 hover:bg-amber-400",
  danger: "bg-red-600 hover:bg-red-500",
};

const ServiceAlertModal = ({
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  tone = "success",
  disableActions = false,
}: ServiceAlertModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <style>
        {`@keyframes alert-pop {0% {opacity: 0; transform: translateY(8px) scale(0.98);} 100% {opacity: 1; transform: translateY(0) scale(1);} }
          @keyframes alert-fade {0% {opacity: 0;} 100% {opacity: 1;} }
          .alert-pop { animation: alert-pop 220ms ease-out; }
          .alert-fade { animation: alert-fade 200ms ease-out; }`}
      </style>
      <div className="alert-fade absolute inset-0" aria-hidden="true" />
      <div className="alert-pop relative w-full max-w-lg rounded-2xl border bg-[#202020] p-6 shadow-2xl">
        <div className={`mb-4 flex items-center gap-3 border-b pb-3 text-xl font-bold font-[Montserrat_Alternates] ${toneStyles[tone]}`}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
          {title}
        </div>
        {description && <p className="text-gray-300 mb-6 text-sm leading-relaxed">{description}</p>}
        <div className="flex justify-end gap-3">
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              onClick={onSecondary}
              disabled={disableActions}
              className="rounded-lg bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
            >
              {secondaryLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onPrimary}
            disabled={disableActions}
            className={`rounded-lg px-4 py-2 font-bold text-white transition-colors disabled:opacity-50 ${toneButtonStyles[tone]}`}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAlertModal;