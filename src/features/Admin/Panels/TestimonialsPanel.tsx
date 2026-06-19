import { useEffect, useState } from "react";
import { fetchTestimonials, createTestimonial, deleteTestimonial } from "../../services";
import type { Testimonial } from "../../../entities/Testimonial/testimonial";
import { useAdminTheme } from "../AdminThemeContext";

type Props = { token: string };

const empty = { author: "", role: "", text: "", rating: 5, displayOrder: 0 };

const TestimonialsPanel = ({ token }: Props) => {
  const t = useAdminTheme();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await fetchTestimonials()); } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const created = await createTestimonial(form, token);
      setItems((prev) => [...prev, created]);
      setForm(empty);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteTestimonial(id, token);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const labelCls = `block text-sm font-medium font-['Montserrat_Alternates'] mb-1 ${t.subtext}`;
  const inputCls = `w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${t.input}`;
  const sectionCls = `${t.surface} rounded-2xl p-6 space-y-4`;

  return (
    <section className="w-full h-full p-4 md:p-6 overflow-auto">
      <div className={`text-4xl font-bold mb-8 font-['Montserrat_Alternates'] ${t.text}`}>
        Отзывы
      </div>

      {/* Add form */}
      <div className={`${sectionCls} mb-8`}>
        <h2 className={`text-lg font-bold font-['Montserrat_Alternates'] border-b pb-3 ${t.text} ${t.divider}`}>
          Добавить отзыв
        </h2>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Имя клиента *</label>
              <input className={inputCls} value={form.author}
                onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                placeholder="Иван Иванов" />
            </div>
            <div>
              <label className={labelCls}>Должность / компания</label>
              <input className={inputCls} value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="ИП Иванов" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Текст отзыва *</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              placeholder="Отличная работа, рекомендую!" />
          </div>
          <div className="flex gap-4 items-end">
            <div>
              <label className={labelCls}>Оценка (1–5)</label>
              <select className={inputCls} value={form.rating}
                onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}>
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Порядок</label>
              <input className={inputCls} type="number" style={{ width: 80 }} value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))} />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#218E0B] hover:bg-[#31ea0c] text-white font-bold font-['Montserrat_Alternates'] transition-colors disabled:opacity-50"
            >
              {saving ? "Добавление..." : "+ Добавить"}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>

      {/* List */}
      <div className={sectionCls}>
        <h2 className={`text-lg font-bold font-['Montserrat_Alternates'] border-b pb-3 ${t.text} ${t.divider}`}>
          Список отзывов ({items.length})
        </h2>

        {loading && (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className={`h-20 ${t.surface} rounded-xl animate-pulse`} />)}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className={`text-sm ${t.subtext}`}>Отзывов пока нет</p>
        )}

        {!loading && items.map((item) => (
          <div key={item.id} className={`flex gap-4 items-start rounded-xl p-4 ${t.surface} border ${t.divider}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold text-sm font-['Montserrat_Alternates'] ${t.text}`}>{item.author}</span>
                {item.role && <span className={`text-xs ${t.subtext}`}>· {item.role}</span>}
                <span className="text-[#44be32] text-xs">{'★'.repeat(item.rating)}</span>
              </div>
              <p className={`text-sm leading-snug whitespace-pre-wrap ${t.subtext}`}>{item.text}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={deletingId === item.id}
              className="w-8 h-8 shrink-0 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-colors disabled:opacity-50"
              aria-label="Удалить"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsPanel;
