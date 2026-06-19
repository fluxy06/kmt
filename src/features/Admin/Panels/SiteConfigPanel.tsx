import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { setSiteConfig } from "../../../app/store/siteConfigSlice";
import type { SiteConfig, FaqItem } from "../../../entities/SiteConfig/siteConfig";
import { updateSiteConfig } from "../../services";
import { useAdminTheme } from "../AdminThemeContext";

type Props = { token: string };

const SiteConfigPanel = ({ token }: Props) => {
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.siteConfig.config);
  const t = useAdminTheme();

  const [form, setForm] = useState<SiteConfig>(current);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setForm(current); }, [current]);

  const set = (key: keyof SiteConfig, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateSiteConfig(form, token);
      dispatch(setSiteConfig(updated));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const labelCls = `block text-sm font-medium font-['Montserrat_Alternates'] mb-1 ${t.subtext}`;
  const inputCls = `w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${t.input}`;
  const sectionCls = `${t.surface} rounded-2xl p-6 space-y-4`;
  const sectionTitle = `text-lg font-bold font-['Montserrat_Alternates'] border-b pb-3 ${t.text} ${t.divider}`;

  return (
    <section className="w-full h-full p-4 md:p-6 overflow-auto">
      <div className={`text-4xl font-bold mb-8 font-['Montserrat_Alternates'] ${t.text}`}>
        Настройки сайта
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">

        <div className={sectionCls}>
          <h2 className={sectionTitle}>Основное</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Название компании</label>
              <input className={inputCls} value={form.companyName}
                onChange={(e) => set("companyName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Город</label>
              <input className={inputCls} value={form.city}
                onChange={(e) => set("city", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Краткое описание (футер)</label>
            <input className={inputCls} value={form.aboutText}
              onChange={(e) => set("aboutText", e.target.value)} />
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className={sectionTitle}>Контакты</h2>
          <div>
            <label className={labelCls}>Адрес</label>
            <input className={inputCls} value={form.address}
              onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Телефоны (каждый с новой строки)</label>
            <textarea className={inputCls} rows={3}
              value={form.phones.join("\n")}
              onChange={(e) => set("phones", e.target.value.split("\n"))} />
          </div>
          <div>
            <label className={labelCls}>Email-адреса (каждый с новой строки)</label>
            <textarea className={inputCls} rows={2}
              value={form.emails.join("\n")}
              onChange={(e) => set("emails", e.target.value.split("\n"))} />
          </div>
          <div>
            <label className={labelCls}>Режим работы (каждый период с новой строки)</label>
            <textarea className={inputCls} rows={2}
              value={form.workingHours}
              onChange={(e) => set("workingHours", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Telegram (например @username)</label>
            <input className={inputCls} value={form.telegramHandle}
              onChange={(e) => set("telegramHandle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>ВКонтакте (ссылка на группу, необязательно)</label>
            <input className={inputCls} value={form.vkGroupUrl}
              placeholder="https://vk.com/yourgroup"
              onChange={(e) => set("vkGroupUrl", e.target.value)} />
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className={sectionTitle}>SEO / Мета-теги</h2>
          <div>
            <label className={labelCls}>Title страницы (вкладка браузера)</label>
            <input className={inputCls} value={form.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Description (поисковое описание)</label>
            <textarea className={inputCls} rows={2} value={form.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)} />
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className={sectionTitle}>Тексты главной страницы</h2>
          <div>
            <label className={labelCls}>Заголовок (hero)</label>
            <input className={inputCls} value={form.heroTitle}
              onChange={(e) => set("heroTitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Подзаголовок (hero)</label>
            <input className={inputCls} value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Текст блока «О нас» (главная страница)</label>
            <textarea className={inputCls} rows={4} value={form.aboutSectionText}
              onChange={(e) => set("aboutSectionText", e.target.value)} />
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className={sectionTitle}>Карта офиса</h2>
          <p className={`text-xs ${t.subtext} -mt-2`}>
            Найдите адрес на <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" className="underline">openstreetmap.org</a>, скопируйте координаты из URL (после #map=16/).
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Широта (latitude)</label>
              <input className={inputCls} type="number" step="any"
                value={form.mapLat}
                onChange={(e) => setForm((prev) => ({ ...prev, mapLat: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className={labelCls}>Долгота (longitude)</label>
              <input className={inputCls} type="number" step="any"
                value={form.mapLon}
                onChange={(e) => setForm((prev) => ({ ...prev, mapLon: parseFloat(e.target.value) || 0 }))} />
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <h2 className={sectionTitle}>Статистика (страница «О нас»)</h2>
          <div className="space-y-3">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex flex-col gap-1 w-28 shrink-0">
                  <label className={`text-xs ${t.subtext}`}>Значение</label>
                  <input
                    className={inputCls}
                    value={stat.value}
                    placeholder=">12"
                    onChange={(e) => {
                      const next = [...form.stats];
                      next[i] = { ...next[i], value: e.target.value };
                      setForm((prev) => ({ ...prev, stats: next }));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className={`text-xs ${t.subtext}`}>Подпись (↵ для переноса строки)</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={stat.label}
                    placeholder="лет в сфере"
                    onChange={(e) => {
                      const next = [...form.stats];
                      next[i] = { ...next[i], label: e.target.value };
                      setForm((prev) => ({ ...prev, stats: next }));
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, j) => j !== i) }))}
                  className="mt-5 w-8 h-8 shrink-0 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors"
                  aria-label="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {form.stats.length < 8 && (
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }))}
              className={`mt-2 text-sm font-semibold font-['Montserrat_Alternates'] text-[#44be32] hover:text-[#31ea0c] transition-colors`}
            >
              + Добавить карточку
            </button>
          )}
        </div>

        <div className={sectionCls}>
          <h2 className={sectionTitle}>FAQ (вопросы и ответы)</h2>
          <div className="space-y-3">
            {form.faqs.map((faq: FaqItem, i: number) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex flex-col gap-1 flex-1">
                  <input
                    className={inputCls}
                    value={faq.question}
                    placeholder="Вопрос"
                    onChange={(e) => {
                      const next = [...form.faqs];
                      next[i] = { ...next[i], question: e.target.value };
                      setForm((prev) => ({ ...prev, faqs: next }));
                    }}
                  />
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={faq.answer}
                    placeholder="Ответ"
                    onChange={(e) => {
                      const next = [...form.faqs];
                      next[i] = { ...next[i], answer: e.target.value };
                      setForm((prev) => ({ ...prev, faqs: next }));
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, j) => j !== i) }))}
                  className="mt-1 w-8 h-8 shrink-0 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors"
                  aria-label="Удалить"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {form.faqs.length < 20 && (
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }))}
              className="mt-2 text-sm font-semibold font-['Montserrat_Alternates'] text-[#44be32] hover:text-[#31ea0c] transition-colors"
            >
              + Добавить вопрос
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#218E0B] hover:bg-[#31ea0c] text-white font-bold font-['Montserrat_Alternates'] transition-colors disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>
          {success && <span className="text-[#44be32] font-semibold font-['Montserrat_Alternates']">✓ Сохранено</span>}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>

        {form.updatedAt && (
          <p className={`text-xs ${t.subtext}`}>
            Последнее обновление: {new Date(form.updatedAt).toLocaleString("ru-RU")}
          </p>
        )}
      </form>
    </section>
  );
};

export default SiteConfigPanel;
