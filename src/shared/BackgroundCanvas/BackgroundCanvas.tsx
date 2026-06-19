import "./BackgroundCanvas.css";

/**
 * Static site background.
 *
 * Three soft radial-gradient blobs + a single glowing accent orb, positioned
 * once and never animated. Previously these ran infinite CSS keyframes, which
 * continuously invalidated every `backdrop-filter` surface above them (header,
 * cards, modals) and kept the GPU compositor busy even while idle — the main
 * source of jank and compositing artifacts on the live site.
 *
 * Keeping it static means zero per-frame compositor work at rest. Softness
 * comes from the radial-gradient falloff itself, not from CSS blur.
 * Theme colors come from CSS variables ([data-theme]), no store subscription.
 */
export default function BackgroundCanvas() {
  return (
    <div className="kmt-bg" aria-hidden="true">
      <div className="kmt-bg__blob kmt-bg__blob--a" />
      <div className="kmt-bg__blob kmt-bg__blob--b" />
      <div className="kmt-bg__blob kmt-bg__blob--c" />
      <div className="kmt-orb">
        <div className="kmt-orb__ring" />
      </div>
    </div>
  );
}
