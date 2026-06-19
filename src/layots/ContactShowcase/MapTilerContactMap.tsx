import { useMemo } from "react";
import { useAppSelector } from "../../app/store/hooks";

const BBOX_PADDING = 0.015;

const MapTilerContactMap = () => {
  const isLightTheme = useAppSelector((state) => state.theme.mode === "light");
  const mapLat = useAppSelector((s) => s.siteConfig.config.mapLat);
  const mapLon = useAppSelector((s) => s.siteConfig.config.mapLon);

  const { embedSrc, openMapHref } = useMemo(() => {
    const left = mapLon - BBOX_PADDING;
    const right = mapLon + BBOX_PADDING;
    const top = mapLat + BBOX_PADDING;
    const bottom = mapLat - BBOX_PADDING;

    const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${mapLat}%2C${mapLon}`;
    const openMapHref = `https://www.openstreetmap.org/?mlat=${mapLat}&mlon=${mapLon}#map=16/${mapLat}/${mapLon}`;

    return { embedSrc, openMapHref };
  }, [mapLat, mapLon]);

  return (
    <div className="relative h-full min-h-[260px] overflow-hidden rounded-3xl border border-[var(--border-color)]">
      <iframe
        title="Карта офиса"
        src={embedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[260px] w-full border-0"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

      <div className="theme-control pointer-events-none absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
        Карта офиса
      </div>

      <a
        href={openMapHref}
        target="_blank"
        rel="noreferrer"
        className={`absolute bottom-4 right-4 rounded-full border px-3 py-1 text-xs font-semibold transition ${
          isLightTheme
            ? "bg-white/90 text-slate-900 hover:bg-white"
            : "bg-slate-900/85 text-slate-100 hover:bg-slate-900"
        }`}
      >
        Открыть карту
      </a>
    </div>
  );
};

export default MapTilerContactMap;