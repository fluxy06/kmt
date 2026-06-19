import React from "react";

type State = { hasError: boolean };

class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ background: "#0a0a0a" }}
          className="flex min-h-screen flex-col items-center justify-center p-8 text-center"
        >
          <p className="text-7xl font-black text-white/10 font-['Montserrat_Alternates'] select-none">!</p>
          <h1 className="mt-4 font-['Montserrat_Alternates'] text-3xl font-black text-white">
            Что-то пошло не так
          </h1>
          <p className="mt-3 max-w-xs text-sm text-white/50">
            Произошла непредвиденная ошибка. Попробуйте обновить страницу.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-full bg-[#51d536] px-8 py-3 font-bold text-black transition hover:bg-[#45c42d] active:scale-95"
          >
            Обновить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
