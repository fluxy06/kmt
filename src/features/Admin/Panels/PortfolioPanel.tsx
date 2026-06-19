import { useEffect, useRef, useState } from "react";
import { useAdminTheme } from "../AdminThemeContext";
import {
  fetchPortfolio,
  createPortfolioItem,
  deletePortfolioItem,
  uploadServiceImageToCloudinary,
} from "../../services";
import type { PortfolioItem } from "../../../entities/Portfolio/portfolio";
import { optimizeCloudinaryUrl } from "../../../shared/lib/cloudinary";

type Props = { token: string };

const PortfolioPanel = ({ token }: Props) => {
  const t = useAdminTheme();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const surf = t.surface;
  const inputCls = `w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${t.input}`;

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchPortfolio());
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFileChange = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title.trim()) {
      setError("Заполните название и выберите фото");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const imageUrl = await uploadServiceImageToCloudinary(imageFile);
      const created = await createPortfolioItem({ title: title.trim(), imageUrl }, token);
      setItems((prev) => [...prev, created]);
      setTitle("");
      handleFileChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deletePortfolioItem(id, token);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Ошибка удаления");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="w-full h-full p-4 md:p-6 overflow-auto">
      <div className={`text-4xl font-bold mb-8 font-['Montserrat_Alternates'] ${t.text}`}>
        Наши работы
      </div>

      <div className="flex gap-6 items-start flex-wrap xl:flex-nowrap">
        {/* Add form */}
        <div className={`shrink-0 w-full xl:w-72 rounded-2xl p-5 space-y-4 ${surf}`}>
          <h2 className={`text-sm font-bold uppercase tracking-widest font-['Montserrat_Alternates'] ${t.subtext}`}>
            Добавить работу
          </h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${t.text}`}>Название</label>
              <input
                className={inputCls}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Билборд на ул. Ленина"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${t.text}`}>Фото</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={`w-full text-sm ${t.subtext}`}
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                required
              />
              {preview && (
                <img src={preview} alt="preview" className="mt-3 h-32 w-full object-cover rounded-xl" />
              )}
            </div>
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 rounded-xl bg-[#218E0B] hover:bg-[#31ea0c] text-white font-bold font-['Montserrat_Alternates'] transition-colors disabled:opacity-50"
            >
              {uploading ? "Загрузка..." : "Добавить"}
            </button>
          </form>
        </div>

        {/* Gallery grid */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`aspect-[4/3] rounded-2xl animate-pulse ${surf}`} />
              ))}
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className={`flex flex-col items-center justify-center py-24 ${t.subtext}`}>
              <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-['Montserrat_Alternates'] text-lg">Работ пока нет</p>
              <p className="text-sm mt-1 opacity-60">Добавьте первое фото слева</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className={`relative group rounded-2xl overflow-hidden aspect-[4/3] ${surf}`}>
                  <img
                    src={optimizeCloudinaryUrl(item.imageUrl, 600)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-bold font-['Montserrat_Alternates'] truncate">{item.title}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50"
                    aria-label="Удалить"
                  >
                    {deletingId === item.id ? (
                      <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioPanel;
