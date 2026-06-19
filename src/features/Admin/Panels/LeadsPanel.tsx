import { useEffect, useRef, useState } from "react";
import { buildApiUrl } from "../../../shared/lib/api";
import { useAdminTheme } from "../AdminThemeContext";

type LeadStatus = "NEW" | "IN_PROGRESS" | "CLOSED";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  notes: string | null;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string | null;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Новый",
  IN_PROGRESS: "В работе",
  CLOSED: "Закрыт",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-[#44be32]/20 text-[#44be32]",
  IN_PROGRESS: "bg-amber-400/20 text-amber-400",
  CLOSED: "bg-gray-400/20 text-gray-400",
};

type Props = { token: string; onStatusChanged?: () => void };

// --- CSV export helper ---
function exportToCsv(leads: Lead[]) {
  const headers = ["ID", "Имя", "Email", "Телефон", "Сообщение", "Заметки", "Статус", "Дата"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
  const rows = leads.map((l) => [
    l.id,
    l.name,
    l.email,
    l.phone,
    l.message,
    l.notes ?? "",
    STATUS_LABELS[l.status],
    new Date(l.createdAt).toLocaleString("ru-RU"),
  ].map(esc).join(","));
  const csv = "﻿" + [headers.map(esc).join(","), ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Main panel ---
const LeadsPanel = ({ token, onStatusChanged }: Props) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const t = useAdminTheme();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl("/api/kmt/admin/contacts"), {
        cache: "no-store",
        headers: { "X-ADMIN-TOKEN": token },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setLeads(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const updateStatus = async (id: number, status: LeadStatus) => {
    setUpdating(id);
    try {
      await fetch(buildApiUrl(`/api/kmt/admin/contacts/${id}/status`), {
        method: "PATCH",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "X-ADMIN-TOKEN": token },
        body: JSON.stringify({ status }),
      });
      setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
      onStatusChanged?.();
    } finally {
      setUpdating(null);
    }
  };

  const updateNotes = async (id: number, notes: string) => {
    await fetch(buildApiUrl(`/api/kmt/admin/contacts/${id}/notes`), {
      method: "PATCH",
      cache: "no-store",
      headers: { "Content-Type": "application/json", "X-ADMIN-TOKEN": token },
      body: JSON.stringify({ notes }),
    });
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, notes } : l));
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const newLeads = leads.filter((l) => l.status === "NEW");
  const inProgressLeads = leads.filter((l) => l.status === "IN_PROGRESS");
  const closedLeads = leads.filter((l) => l.status === "CLOSED");

  return (
    <section className="w-full h-full p-4 md:p-6 overflow-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className={`text-4xl font-bold font-['Montserrat_Alternates'] ${t.text}`}>Заявки</div>
        <div className="flex items-center gap-3">
          {newLeads.length > 0 && (
            <span className="px-3 py-1 rounded-full bg-[#44be32]/20 text-[#44be32] text-sm font-bold">
              {newLeads.length} новых
            </span>
          )}
          {leads.length > 0 && (
            <button
              onClick={() => exportToCsv(leads)}
              title="Скачать CSV"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm transition-colors ${t.surface} ${t.text}`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              CSV
            </button>
          )}
          <button onClick={load}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${t.surface} ${t.text}`}>
            Обновить
          </button>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-32 ${t.surface} rounded-2xl animate-pulse`} />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-red-400">{error}</div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-24 ${t.subtext}`}>
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="font-['Montserrat_Alternates'] text-lg">Заявок пока нет</p>
        </div>
      )}

      {!loading && !error && leads.length > 0 && (
        <div className="space-y-6">
          <LeadGroup title="Новые" leads={newLeads} updating={updating}
            onStatus={updateStatus} onNotes={updateNotes} formatDate={formatDate} />
          <LeadGroup title="В работе" leads={inProgressLeads} updating={updating}
            onStatus={updateStatus} onNotes={updateNotes} formatDate={formatDate} dim={false} />
          <LeadGroup title="Закрытые" leads={closedLeads} updating={updating}
            onStatus={updateStatus} onNotes={updateNotes} formatDate={formatDate} dim />
        </div>
      )}
    </section>
  );
};

interface GroupProps {
  title: string;
  leads: Lead[];
  updating: number | null;
  onStatus: (id: number, status: LeadStatus) => void;
  onNotes: (id: number, notes: string) => Promise<void>;
  formatDate: (s: string) => string;
  dim?: boolean;
}

const LeadGroup = ({ title, leads, updating, onStatus, onNotes, formatDate, dim }: GroupProps) => {
  const t = useAdminTheme();
  if (leads.length === 0) return null;
  return (
    <div className={dim ? "opacity-50" : undefined}>
      <h2 className={`text-xs font-semibold uppercase tracking-widest mb-3 font-['Montserrat_Alternates'] ${t.subtext}`}>
        {title} · {leads.length}
      </h2>
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onStatus={onStatus}
            onNotes={onNotes} updating={updating} formatDate={formatDate} />
        ))}
      </div>
    </div>
  );
};

interface CardProps {
  lead: Lead;
  onStatus: (id: number, status: LeadStatus) => void;
  onNotes: (id: number, notes: string) => Promise<void>;
  updating: number | null;
  formatDate: (s: string) => string;
}

const LeadCard = ({ lead, onStatus, onNotes, updating, formatDate }: CardProps) => {
  const t = useAdminTheme();
  const isUpdating = updating === lead.id;
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesValue, setNotesValue] = useState(lead.notes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const notesRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextStatuses: LeadStatus[] = (["NEW", "IN_PROGRESS", "CLOSED"] as LeadStatus[])
    .filter((s) => s !== lead.status);

  const handleNotesChange = (val: string) => {
    setNotesValue(val);
    if (notesRef.current) clearTimeout(notesRef.current);
    notesRef.current = setTimeout(async () => {
      setNotesSaving(true);
      try { await onNotes(lead.id, val); } finally { setNotesSaving(false); }
    }, 800);
  };

  const mailtoHref = lead.email
    ? `mailto:${lead.email}?subject=${encodeURIComponent(`Re: Заявка от ${lead.name}`)}&body=${encodeURIComponent(`Здравствуйте, ${lead.name}!\n\n`)}`
    : undefined;

  return (
    <div className={`rounded-2xl p-5 border transition-colors ${t.surface} ${
      lead.status === "NEW" ? "border-[#44be32]/25"
      : lead.status === "IN_PROGRESS" ? "border-amber-400/25"
      : ""
    }`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className={`font-bold font-['Montserrat_Alternates'] text-lg ${t.text}`}>{lead.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[lead.status]}`}>
              {STATUS_LABELS[lead.status]}
            </span>
          </div>
          <div className={`flex flex-wrap gap-3 text-sm mt-1 ${t.subtext}`}>
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="hover:underline">✉ {lead.email}</a>
            )}
            {lead.phone && (
              <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="hover:underline">📞 {lead.phone}</a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex flex-col items-end text-xs ${t.subtext}`}>
            <span>{formatDate(lead.createdAt)}</span>
            {lead.updatedAt && (
              <span className="opacity-60">обновлено {formatDate(lead.updatedAt)}</span>
            )}
          </div>

          {/* mailto button */}
          {mailtoHref && (
            <a
              href={mailtoHref}
              title="Написать письмо"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Montserrat_Alternates'] transition-colors ${t.surface} border ${t.divider} ${t.text} hover:border-[#44be32]/50`}
            >
              ✉ Написать
            </a>
          )}

          {/* notes toggle */}
          <button
            onClick={() => setNotesOpen((v) => !v)}
            title="Заметки менеджера"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Montserrat_Alternates'] transition-colors ${
              notesOpen || lead.notes
                ? "bg-amber-400/15 text-amber-400"
                : `${t.surface} border ${t.divider} ${t.subtext}`
            }`}
          >
            {lead.notes && !notesOpen ? "📝 Есть заметка" : "📝 Заметки"}
          </button>

          {/* status buttons */}
          {nextStatuses.map((s) => (
            <button
              key={s}
              onClick={() => onStatus(lead.id, s)}
              disabled={isUpdating}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Montserrat_Alternates'] transition-colors disabled:opacity-50 ${
                s === "NEW" ? "bg-[#44be32]/15 hover:bg-[#44be32]/30 text-[#44be32]"
                : s === "IN_PROGRESS" ? "bg-amber-400/15 hover:bg-amber-400/30 text-amber-400"
                : "bg-gray-400/15 hover:bg-gray-400/30 text-gray-400"
              }`}
            >
              {isUpdating ? "..." : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <p className={`mt-3 text-sm leading-relaxed whitespace-pre-wrap border-t pt-3 ${t.subtext} ${t.divider}`}>
        {lead.message}
      </p>

      {notesOpen && (
        <div className={`mt-3 border-t pt-3 ${t.divider}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-semibold ${t.subtext}`}>Заметки менеджера</span>
            {notesSaving && <span className="text-xs text-amber-400">Сохранение...</span>}
            {!notesSaving && notesValue && <span className="text-xs text-[#44be32]">✓ Сохранено</span>}
          </div>
          <textarea
            className={`w-full px-3 py-2 text-sm rounded-xl border focus:outline-none resize-none transition-colors ${t.input}`}
            rows={3}
            value={notesValue}
            placeholder="Внутренние заметки по заявке (не видны клиенту)..."
            onChange={(e) => handleNotesChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default LeadsPanel;
