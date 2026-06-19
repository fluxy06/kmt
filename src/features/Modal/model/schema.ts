// features/contact-form/model/schema.ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Некорректный email"),
  phone: z
    .string()
    .regex(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/, "Введите номер РФ в формате +7 (999) 999-99-99"),
  message: z.string().min(5, "Сообщение слишком короткое"),
  privacyConsent: z
    .boolean()
    .refine((value) => value, "Необходимо согласие с политикой конфиденциальности"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;