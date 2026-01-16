// features/contact-form/model/schema.ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Некорректный email"),
  phone: z
    .string()
    .min(10, "Минимум 10 цифр")
    .regex(/^\+?[0-9\s()-]+$/, "Некорректный номер"),
  message: z.string().min(5, "Сообщение слишком короткое"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
