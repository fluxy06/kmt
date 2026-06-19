import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import siteConfigReducer from "./siteConfigSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    siteConfig: siteConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;