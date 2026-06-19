export type CookieOptions = {
  days?: number;
  path?: string;
  sameSite?: "Strict" | "Lax" | "None";
  secure?: boolean;
};

const isBrowser = typeof document !== "undefined";

export const getCookie = (name: string): string | null => {
  if (!isBrowser) {
    return null;
  }

  const escapedName = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  if (!isBrowser) {
    return;
  }

  const path = options.path ?? "/";
  const sameSite = options.sameSite ?? "Lax";
  const secure = options.secure ?? window.location.protocol === "https:";

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;

  if (typeof options.days === "number") {
    const expires = new Date();
    expires.setDate(expires.getDate() + options.days);
    cookie += `; expires=${expires.toUTCString()}`;
  }

  if (secure) {
    cookie += "; Secure";
  }

  document.cookie = cookie;
};

export const deleteCookie = (name: string, path = "/") => {
  setCookie(name, "", { days: -1, path });
};
