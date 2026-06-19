import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../../entities/SiteConfig/siteConfig";
import { fetchSiteConfig } from "../../features/services";

const CACHE_KEY = "kmt_site_config_v1";

function readCache(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SiteConfig;
  } catch {
    return null;
  }
}

function writeCache(config: SiteConfig) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(config));
  } catch {
    // private/full storage — ignore
  }
}

interface SiteConfigState {
  config: SiteConfig;
  loading: boolean;
  error: string | null;
}

const cachedConfig = readCache();

const initialState: SiteConfigState = {
  config: cachedConfig ?? DEFAULT_SITE_CONFIG,
  // loading = true only on first visit (no cache) — skeletons show until API responds
  loading: cachedConfig === null,
  error: null,
};

export const loadSiteConfig = createAsyncThunk("siteConfig/load", async () => {
  return fetchSiteConfig();
});

const siteConfigSlice = createSlice({
  name: "siteConfig",
  initialState,
  reducers: {
    setSiteConfig: (state, action: { payload: SiteConfig }) => {
      state.config = action.payload;
      writeCache(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSiteConfig.pending, (state) => {
        state.error = null;
      })
      .addCase(loadSiteConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.config = action.payload;
        writeCache(action.payload);
      })
      .addCase(loadSiteConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setSiteConfig } = siteConfigSlice.actions;
export default siteConfigSlice.reducer;
