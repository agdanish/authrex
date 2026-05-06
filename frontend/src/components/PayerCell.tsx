/**
 * Payer cell — square logo placeholder + payer ID. Each payer gets a tinted
 * background based on a deterministic hash of its ID.
 */
import clsx from "clsx";

const PAYER_TINT: Record<string, string> = {
  aetna:  "bg-rose-50    text-rose-700    dark:bg-rose-500/15    dark:text-rose-300",
  uhc:    "bg-blue-50    text-blue-700    dark:bg-blue-500/15    dark:text-blue-300",
  bcbs:   "bg-cyan-50    text-cyan-700    dark:bg-cyan-500/15    dark:text-cyan-300",
  anthem: "bg-indigo-50  text-indigo-700  dark:bg-indigo-500/15  dark:text-indigo-300",
};

const PAYER_LABEL: Record<string, string> = {
  aetna:  "AETNA",
  uhc:    "UHC",
  bcbs:   "BCBS",
  anthem: "ANTHEM",
};

interface Props {
  payer_id: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function PayerCell({ payer_id, showLabel = true, size = "sm" }: Props) {
  const tint = PAYER_TINT[payer_id] ?? "bg-surface-panel text-ink-muted";
  const label = PAYER_LABEL[payer_id] ?? payer_id.toUpperCase();
  const initial = label.slice(0, 1);
  const dim = size === "sm" ? "w-5 h-5 text-[10px]" : "w-7 h-7 text-xs";

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={clsx(
          "rounded font-bold font-mono flex items-center justify-center shrink-0",
          dim,
          tint,
        )}
      >
        {initial}
      </span>
      {showLabel && (
        <span className="text-[11px] font-mono text-ink-muted">{label}</span>
      )}
    </span>
  );
}
