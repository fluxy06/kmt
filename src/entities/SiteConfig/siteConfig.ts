export interface StatCard {
  value: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  companyName: string;
  city: string;
  address: string;
  phones: string[];
  emails: string[];
  workingHours: string;
  telegramHandle: string;
  vkGroupUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  aboutSectionText: string;
  mapLat: number;
  mapLon: number;
  stats: StatCard[];
  faqs: FaqItem[];
  metaTitle: string;
  metaDescription: string;
  updatedAt: string | null;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  companyName: "Камертон",
  city: "Богородск",
  address: "ул. Ленина, 180, г. Богородск, 607600",
  phones: ["8 (930) 803-33-10", "+7 (986) 750-62-00"],
  emails: ["info@kamerton.ru", "kamertonbg@gmail.com"],
  workingHours: "Пн-Пт: 10:00 - 20:00\nСб-Вс: 10:00 - 20:00",
  telegramHandle: "@f_r_i_s_t_1",
  vkGroupUrl: "",
  heroTitle: "Реклама, которая работает",
  heroSubtitle: "Наружная реклама в Богородске и Нижегородской области",
  aboutText: "Мы создаем рекламу, которая работает.",
  aboutSectionText: "Мы — команда профессионалов из Богородска, которая знает и любит своё дело. Наша цель — предлагать решения, которые действительно работают и приносят ощутимый результат нашим клиентам. Мы ценим ваше доверие и строим долгосрочные партнёрские отношения, основанные на качестве, ответственности и взаимном уважении.",
  mapLat: 56.102975,
  mapLon: 43.508239,
  stats: [
    { value: ">12", label: "лет в сфере" },
    { value: "90+", label: "Клиентов" },
    { value: "2000+", label: "Реализованных\nпроектов" },
    { value: "12", label: "Месяцев гарантия" },
    { value: "24/7", label: "Поддержка\nклиентов" },
  ],
  faqs: [],
  metaTitle: "Камертон — наружная реклама в Богородске",
  metaDescription: "Изготовление и монтаж наружной рекламы в Богородске и Нижегородской области. Вывески, баннеры, световые короба.",
  updatedAt: null,
};
