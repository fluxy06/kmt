declare global {
  interface Window {
    __KMT_RUNTIME_CONFIG__?: {
      API_BASE_URL?: string;
      CLOUDINARY_CLOUD_NAME?: string;
      CLOUDINARY_UPLOAD_PRESET?: string;
      CLOUDINARY_FOLDER?: string;
    };
  }
}

const readRuntimeValue = (key: keyof NonNullable<Window["__KMT_RUNTIME_CONFIG__"]>): string => {
  if (typeof window === "undefined") {
    return "";
  }

  return window.__KMT_RUNTIME_CONFIG__?.[key]?.trim() ?? "";
};

const stripPrefixedAssignment = (value: string, expectedKey: string): string => {
  const normalized = value.trim().replace(/^['"]|['"]$/g, "");
  const prefix = `${expectedKey}=`;

  if (normalized.startsWith(prefix)) {
    return normalized.slice(prefix.length).trim();
  }

  return normalized;
};

const normalizeCloudinaryCloudName = (rawValue: string): string => {
  const value = stripPrefixedAssignment(rawValue, "CLOUDINARY_CLOUD_NAME");

  if (!value) {
    return "";
  }

  if (value.startsWith("cloudinary://")) {
    const withoutProtocol = value.slice("cloudinary://".length);
    const atIndex = withoutProtocol.lastIndexOf("@");
    const cloudName = atIndex >= 0 ? withoutProtocol.slice(atIndex + 1) : withoutProtocol;
    return cloudName.trim();
  }

  return value;
};

const normalizeEnvValue = (rawValue: string, expectedKey: string): string => {
  const value = stripPrefixedAssignment(rawValue, expectedKey);
  return value;
};

const cloudinaryCloudName = normalizeCloudinaryCloudName(
  readRuntimeValue("CLOUDINARY_CLOUD_NAME") || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() || "",
);

const cloudinaryUploadPreset = normalizeEnvValue(
  readRuntimeValue("CLOUDINARY_UPLOAD_PRESET") || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() || "",
  "CLOUDINARY_UPLOAD_PRESET",
);

const cloudinaryFolder = normalizeEnvValue(
  readRuntimeValue("CLOUDINARY_FOLDER") || import.meta.env.VITE_CLOUDINARY_FOLDER?.trim() || "",
  "CLOUDINARY_FOLDER",
);

export const runtimeConfig = {
  apiBaseUrl: readRuntimeValue("API_BASE_URL") || import.meta.env.VITE_API_BASE_URL?.trim() || "",
  cloudinaryCloudName,
  cloudinaryUploadPreset,
  cloudinaryFolder,
};

export {};
