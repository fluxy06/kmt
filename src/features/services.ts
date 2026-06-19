// shared/api/services.ts
import type { Bilbord } from "../entities/Bilbord/bilbord";
import type { PortfolioItem } from "../entities/Portfolio/portfolio";
import type { SiteConfig } from "../entities/SiteConfig/siteConfig";
import type { Testimonial } from "../entities/Testimonial/testimonial";
import { buildApiUrl } from "../shared/lib/api";
import { runtimeConfig } from "../shared/lib/runtimeConfig";

type CreateServicePayload = Omit<Bilbord, "id">;
type UpdateServicePayload = Omit<Bilbord, "id">;

export async function fetchActiveServices(cache: RequestCache = "no-store"): Promise<Bilbord[]> {
  const res = await fetch(buildApiUrl("/kmt/services"), {
    cache,
  });



  if (!res.ok) {
    throw new Error("Не удалось загрузить услуги");
  }

  return res.json();
}

export async function fetchServiceById(id: number): Promise<Bilbord> {
  const res = await fetch(buildApiUrl(`/kmt/services/${id}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить услугу");
  }

  return res.json();
}

export async function deleteService(id: number, token: string): Promise<void> {
  const response = await fetch(buildApiUrl(`/kmt/services/${id}`), {
    method: 'DELETE',
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json',
      'X-ADMIN-TOKEN': token,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Ошибка при удалении услуги (HTTP ${response.status})`);
  }
}


export async function createService(payload: CreateServicePayload, token: string): Promise<Bilbord> {
  const response = await fetch(buildApiUrl("/kmt/services"), {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN-TOKEN": token,
    },
    body: JSON.stringify(payload),
  });

 if (!response.ok) {
    throw new Error(`Ошибка при добавлении услуги (HTTP ${response.status})`);
  }


  return response.json();
}


export async function updateService(id: number, payload: UpdateServicePayload, token: string): Promise<Bilbord> {
  const response = await fetch(buildApiUrl(`/kmt/services/${id}`), {
    method: "PUT",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN-TOKEN": token,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Ошибка при обновлении услуги (HTTP ${response.status})`);
  }


  return response.json();
}



export async function uploadServiceImageToCloudinary(file: File): Promise<string> {
  const cloudName = runtimeConfig.cloudinaryCloudName;
  const uploadPreset = runtimeConfig.cloudinaryUploadPreset;
  const folder = runtimeConfig.cloudinaryFolder || "services";

  if (!cloudName || !uploadPreset) {
    throw new Error("Не настроена загрузка изображений в Cloudinary. Укажите CLOUDINARY_CLOUD_NAME/CLOUDINARY_UPLOAD_PRESET (или VITE_CLOUDINARY_* для локальной сборки)");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const cloudinaryMessage = data?.error?.message || response.headers.get("x-cld-error") || "Не удалось загрузить изображение в Cloudinary";

    if (response.status === 401 && cloudinaryMessage.toLowerCase().includes("unknown api key")) {
      throw new Error(
        "Cloudinary вернул 401 Unknown API key. Проверьте VITE_CLOUDINARY_CLOUD_NAME (должен совпадать с Dashboard -> Cloud name) и используйте unsigned upload preset.",
      );
    }

    throw new Error(cloudinaryMessage);
  }

  if (!data.secure_url) {
    throw new Error("Cloudinary не вернул ссылку на изображение");
  }

  return data.secure_url as string;
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const res = await fetch(buildApiUrl("/kmt/site-config"), { cache: "no-store" });
  if (!res.ok) throw new Error("Не удалось загрузить конфигурацию сайта");
  return res.json();
}

export async function updateSiteConfig(config: SiteConfig, token: string): Promise<SiteConfig> {
  const res = await fetch(buildApiUrl("/api/kmt/admin/site-config"), {
    method: "PUT",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-ADMIN-TOKEN": token },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`Ошибка сохранения конфигурации (HTTP ${res.status})`);
  return res.json();
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const res = await fetch(buildApiUrl("/kmt/portfolio"), { cache: "no-store" });
  if (!res.ok) throw new Error("Не удалось загрузить портфолио");
  return res.json();
}

export async function createPortfolioItem(
  payload: { title: string; imageUrl: string; displayOrder?: number },
  token: string,
): Promise<PortfolioItem> {
  const res = await fetch(buildApiUrl("/api/kmt/admin/portfolio"), {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-ADMIN-TOKEN": token },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Ошибка создания (HTTP ${res.status})`);
  return res.json();
}

export async function deletePortfolioItem(id: number, token: string): Promise<void> {
  const res = await fetch(buildApiUrl(`/api/kmt/admin/portfolio/${id}`), {
    method: "DELETE",
    cache: "no-store",
    headers: { "X-ADMIN-TOKEN": token },
  });
  if (!res.ok) throw new Error(`Ошибка удаления (HTTP ${res.status})`);
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(buildApiUrl("/kmt/testimonials"), { cache: "no-store" });
  if (!res.ok) throw new Error("Не удалось загрузить отзывы");
  return res.json();
}

export async function createTestimonial(
  payload: Omit<Testimonial, "id" | "createdAt">,
  token: string,
): Promise<Testimonial> {
  const res = await fetch(buildApiUrl("/api/kmt/admin/testimonials"), {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-ADMIN-TOKEN": token },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Ошибка создания отзыва (HTTP ${res.status})`);
  return res.json();
}

export async function deleteTestimonial(id: number, token: string): Promise<void> {
  const res = await fetch(buildApiUrl(`/api/kmt/admin/testimonials/${id}`), {
    method: "DELETE",
    cache: "no-store",
    headers: { "X-ADMIN-TOKEN": token },
  });
  if (!res.ok) throw new Error(`Ошибка удаления отзыва (HTTP ${res.status})`);
}

// Функция проверки токена администратора.
// Токен передаётся только в заголовке — не попадает в логи, историю и Referer.
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(buildApiUrl("/api/kmt/admin/verify"), {
      cache: "no-store",
      headers: { "X-ADMIN-TOKEN": token },
    });
    return response.ok;
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    return false;
  }
}