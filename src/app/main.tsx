import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { MotionConfig } from "framer-motion";
import RootRouter from "./router/rootRouter";
import { store } from "./store/store";
import ThemeSync from "./providers/ThemeSync";
import ErrorBoundary from "./providers/ErrorBoundary";
import "./App.css";
import "./index.css";
import ScrollManager from "./providers/ScrollManager";
import AnalyticsTracker from "./providers/AnalyticsTracker";
import PageLoadScreen from "./providers/PageLoadScreen";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeSync />
        <BrowserRouter>
          <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: "easeOut" }}>
            <PageLoadScreen />
            <ScrollManager />
            <AnalyticsTracker />
            <RootRouter />
          </MotionConfig>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
