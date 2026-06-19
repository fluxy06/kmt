export const HOME_SCROLL_TARGETS = ["services", "contacts"] as const;

export type HomeScrollTarget = (typeof HOME_SCROLL_TARGETS)[number];

export type HomeNavigationState = {
  scrollTarget?: HomeScrollTarget;
  requestId?: string;
};

export const isHomeNavigationState = (value: unknown): value is HomeNavigationState => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Record<string, unknown>;
  if (state.scrollTarget === undefined) {
    return true;
  }

  return HOME_SCROLL_TARGETS.includes(state.scrollTarget as HomeScrollTarget);
};
