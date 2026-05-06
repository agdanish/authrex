/**
 * Aurora background — three blurred gradient blobs that drift slowly.
 * Used behind the Dashboard hero. Tasteful: ~12% opacity in light mode,
 * larger blur, slow alternate animation. Honors prefers-reduced-motion via
 * the global CSS guard.
 */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
    >
      <div
        className="aurora-blob bg-accent-brand animate-aurora-drift"
        style={{
          width: 620,
          height: 620,
          top: -180,
          left: -120,
          opacity: 0.16,
          animationDelay: "0s",
        }}
      />
      <div
        className="aurora-blob bg-accent-cyan animate-aurora-drift"
        style={{
          width: 520,
          height: 520,
          top: -80,
          right: -160,
          opacity: 0.12,
          animationDelay: "-12s",
        }}
      />
      <div
        className="aurora-blob bg-accent-violet animate-aurora-drift"
        style={{
          width: 460,
          height: 460,
          top: 220,
          left: "30%",
          opacity: 0.1,
          animationDelay: "-22s",
        }}
      />
    </div>
  );
}
