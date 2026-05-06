/**
 * /cases/bulk-import — Bulk FHIR Import.
 *
 * Drag-drop a FHIR Bulk Data export (.ndjson / .zip / Bundle JSON) → fan out
 * N parallel graph runs → live throughput. Built for CMS-0057-F Prior
 * Authorization API mandate (effective Jan 1, 2027).
 *
 * Currently uses simulated progress (not real backend processing) to keep
 * the demo fast and credit-cheap. Production swaps to a backend job queue.
 */
import clsx from "clsx";
import {
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  Download,
  FileText,
  Loader2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { StatusPill } from "../components/StatusPill";
import type { CaseStatus } from "../lib/syntheticCases";

type CaseQueueRow = {
  case_id: string;
  patient: string;
  diagnosis: string;
  treatment: string;
  status: "queued" | "in_flight" | "approved" | "denied" | "referred" | "appealed";
  cost_usd: number;
  finished_at_ms?: number;
};

const SYNTHETIC_BATCH: Omit<CaseQueueRow, "status" | "cost_usd">[] = [
  { case_id: "bulk_001", patient: "S.D.", diagnosis: "C50.911 Stage IIIA breast",   treatment: "trastuzumab" },
  { case_id: "bulk_002", patient: "M.D.", diagnosis: "C50.912 Stage IIIB breast",   treatment: "trastuzumab" },
  { case_id: "bulk_003", patient: "R.K.", diagnosis: "C34.91 NSCLC IIIB",           treatment: "osimertinib" },
  { case_id: "bulk_004", patient: "P.N.", diagnosis: "C18.9 colon stage II",        treatment: "pembrolizumab" },
  { case_id: "bulk_005", patient: "T.O.", diagnosis: "C56.9 ovarian stage III",     treatment: "olaparib" },
  { case_id: "bulk_006", patient: "L.W.", diagnosis: "C50.911 Stage IIIA breast",   treatment: "trastuzumab" },
  { case_id: "bulk_007", patient: "K.M.", diagnosis: "C43.9 melanoma IV",           treatment: "dabrafenib + trametinib" },
  { case_id: "bulk_008", patient: "A.B.", diagnosis: "C43.5 melanoma IV",           treatment: "pembrolizumab" },
  { case_id: "bulk_009", patient: "F.E.", diagnosis: "C50.911 breast IV",           treatment: "T-DXd" },
  { case_id: "bulk_010", patient: "H.S.", diagnosis: "C56.9 ovarian II",            treatment: "olaparib" },
  { case_id: "bulk_011", patient: "C.R.", diagnosis: "C34.10 NSCLC IV",             treatment: "osimertinib" },
  { case_id: "bulk_012", patient: "B.T.", diagnosis: "C50.912 breast IIIB",         treatment: "trastuzumab" },
  { case_id: "bulk_013", patient: "Y.J.", diagnosis: "C18.0 cecum II",              treatment: "pembrolizumab" },
  { case_id: "bulk_014", patient: "N.G.", diagnosis: "C50.911 breast IIIA",         treatment: "trastuzumab" },
  { case_id: "bulk_015", patient: "V.D.", diagnosis: "C61 prostate IV",             treatment: "abiraterone" },
  { case_id: "bulk_016", patient: "Z.O.", diagnosis: "C71.9 glioblastoma IV",       treatment: "bevacizumab" },
  { case_id: "bulk_017", patient: "Q.L.", diagnosis: "C56.9 ovarian II",            treatment: "olaparib" },
  { case_id: "bulk_018", patient: "X.M.", diagnosis: "C50.911 breast IIIA",         treatment: "trastuzumab" },
  { case_id: "bulk_019", patient: "G.P.", diagnosis: "C34.91 NSCLC IIIB",           treatment: "osimertinib" },
  { case_id: "bulk_020", patient: "I.A.", diagnosis: "C43.9 melanoma IV",           treatment: "pembrolizumab" },
  { case_id: "bulk_021", patient: "O.K.", diagnosis: "C50.912 breast IIIB",         treatment: "T-DXd" },
  { case_id: "bulk_022", patient: "U.R.", diagnosis: "C18.9 colon II",              treatment: "pembrolizumab" },
  { case_id: "bulk_023", patient: "E.S.", diagnosis: "C50.911 breast IIIA",         treatment: "trastuzumab" },
  { case_id: "bulk_024", patient: "W.J.", diagnosis: "C56.9 ovarian III",           treatment: "olaparib" },
];

// Deterministic verdict assignment for variety
function verdictForRow(idx: number): CaseQueueRow["status"] {
  const pattern: CaseQueueRow["status"][] = [
    "approved", "approved", "approved", "referred",
    "approved", "denied",   "approved", "approved",
    "appealed", "approved", "referred", "approved",
    "approved", "approved", "approved", "referred",
    "approved", "approved", "denied",   "approved",
    "approved", "appealed", "referred", "approved",
  ];
  return pattern[idx] ?? "approved";
}

const STATUS_TO_PILL: Record<CaseQueueRow["status"], CaseStatus> = {
  queued:    "pending",
  in_flight: "running",
  approved:  "approved",
  denied:    "denied",
  referred:  "referred",
  appealed:  "appealed",
};

export default function BulkImport() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [rows, setRows] = useState<CaseQueueRow[]>([]);
  const [tickMs, setTickMs] = useState(0);

  const total = SYNTHETIC_BATCH.length;
  const completed = rows.filter((r) =>
    ["approved", "denied", "referred", "appealed"].includes(r.status),
  ).length;
  const inFlight = rows.filter((r) => r.status === "in_flight").length;
  const queued = rows.filter((r) => r.status === "queued").length;
  const totalCost = rows.reduce((s, r) => s + r.cost_usd, 0);
  const throughput = phase === "running" && tickMs > 0
    ? (completed / (tickMs / 1000)).toFixed(1)
    : "0.0";

  // Simulate "drop" → start queue
  const startQueue = () => {
    if (phase !== "idle") return;
    const initialRows: CaseQueueRow[] = SYNTHETIC_BATCH.map((r) => ({
      ...r,
      status: "queued",
      cost_usd: 0,
    }));
    setRows(initialRows);
    setPhase("running");
  };

  useEffect(() => {
    if (phase !== "running") return;
    const start = Date.now();
    const interval = setInterval(() => {
      setTickMs(Date.now() - start);
      setRows((prev) => {
        const next = [...prev];
        // Promote 1-2 queued → in_flight (cap concurrency at 2)
        const inFlightNow = next.filter((r) => r.status === "in_flight").length;
        const slots = Math.max(0, 2 - inFlightNow);
        for (let i = 0; i < next.length && slots > 0; i++) {
          if (next[i].status === "queued") {
            next[i] = { ...next[i], status: "in_flight" };
            break;
          }
        }
        // 60% chance per tick to complete one in_flight
        if (Math.random() < 0.6) {
          const idx = next.findIndex((r) => r.status === "in_flight");
          if (idx >= 0) {
            const verdict = verdictForRow(idx);
            next[idx] = {
              ...next[idx],
              status: verdict,
              cost_usd: 0.0889 + Math.random() * 0.02,
              finished_at_ms: Date.now() - start,
            };
          }
        }
        return next;
      });
    }, 240);

    return () => clearInterval(interval);
  }, [phase]);

  // Detect completion
  useEffect(() => {
    if (phase === "running" && rows.length > 0 && completed === total) {
      setPhase("done");
    }
  }, [phase, rows, completed, total]);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-brand mb-2">
          <CloudUpload size={12} />
          BULK IMPORT
          <span className="text-ink-faint">·</span>
          <span className="text-accent-cyan" title="CMS-0057-F § IV.A — Prior Authorization API operational by Jan 1 2027 (Da Vinci PAS IG reference)">
            CMS-0057-F § IV.A · PA API mandate · Jan 1 2027
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-ink-primary leading-tight">
          Drop a FHIR Bulk Data export. Process the queue in parallel.
        </h1>
        <p className="text-sm text-ink-muted mt-2 max-w-2xl">
          Built against the Da Vinci PAS Implementation Guide referenced in CMS-0057-F
          § IV.A (89 FR 8758). Drag-drop a{" "}
          <code className="text-xs font-mono px-1 py-0.5 rounded bg-surface-panel">.ndjson</code>,{" "}
          <code className="text-xs font-mono px-1 py-0.5 rounded bg-surface-panel">.zip</code>,
          or FHIR Bundle export — Authrex fans out the 7-agent graph in parallel and
          returns a Da Vinci PAS-compatible <code className="text-xs font-mono px-1 py-0.5 rounded bg-surface-panel">ClaimResponse</code>{" "}
          per case.
        </p>
      </header>

      {/* Drop zone */}
      {phase === "idle" && (
        <button
          type="button"
          onClick={startQueue}
          className="w-full bg-surface-raised border-2 border-dashed border-accent-brand/40 hover:border-accent-brand hover:bg-accent-brand/5 rounded-2xl p-12 transition-all flex flex-col items-center gap-3 group"
        >
          <CloudUpload size={48} className="text-accent-brand/60 group-hover:text-accent-brand group-hover:scale-105 transition-all" />
          <div className="text-center">
            <div className="font-semibold text-ink-primary mb-1">
              Drop a FHIR Bulk Data export
            </div>
            <div className="text-sm text-ink-muted">
              or <span className="text-accent-brand underline">click to browse</span>
            </div>
            <div className="text-[11px] font-mono text-ink-faint mt-3">
              Supports .ndjson · .zip · application/fhir+json
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent-brand bg-accent-brand-soft/50 px-3 py-1.5 rounded-full">
            <Zap size={12} />
            Click to simulate a 24-case batch
          </div>
        </button>
      )}

      {/* Progress header (running) */}
      {phase !== "idle" && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <div className="flex items-center gap-3">
              {phase === "running" ? (
                <Loader2 size={18} className="text-accent-brand animate-spin" />
              ) : (
                <CheckCircle2 size={18} className="text-accent-green" />
              )}
              <div>
                <div className="text-sm font-medium text-ink-primary">
                  {phase === "running"
                    ? `Processing ${total} cases…`
                    : `Batch complete · ${total} cases`}
                </div>
                <div className="text-[11px] font-mono text-ink-muted">
                  <span className="text-accent-green">{completed}</span> complete
                  <span className="mx-1.5 text-ink-faint">·</span>
                  <span className="text-accent-brand">{inFlight}</span> in flight
                  <span className="mx-1.5 text-ink-faint">·</span>
                  <span>{queued}</span> queued
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-ink-muted">
              <span>throughput: <span className="text-accent-cyan font-semibold">{throughput} cases/sec</span></span>
              <span>est. cost: <span className="text-accent-cyan font-semibold">${totalCost.toFixed(2)}</span></span>
              {phase === "done" && (
                <button
                  type="button"
                  className="text-xs font-medium px-3 py-1.5 rounded-md border border-surface-border text-ink-body hover:bg-surface-raised-hi transition-colors flex items-center gap-1.5"
                >
                  <Download size={11} />
                  Download CSV
                </button>
              )}
            </div>
          </div>

          {/* Segmented progress bar */}
          <div className="flex gap-0.5">
            {rows.map((r, i) => (
              <div
                key={r.case_id}
                className={clsx(
                  "h-2 flex-1 rounded-sm transition-colors",
                  r.status === "queued"   && "bg-surface-border",
                  r.status === "in_flight" && "bg-accent-brand animate-pulse-soft",
                  r.status === "approved" && "bg-accent-green",
                  r.status === "denied"   && "bg-accent-red",
                  r.status === "referred" && "bg-accent-amber",
                  r.status === "appealed" && "bg-accent-violet",
                )}
                title={`#${i + 1} · ${r.status}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Result table */}
      {rows.length > 0 && (
        <div className="bg-surface-raised border border-surface-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink-primary">Queue results</h3>
            <span className="text-[11px] font-mono text-ink-muted">
              {completed} of {total} complete
            </span>
          </div>
          <div className="max-h-[480px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-panel text-[10px] font-mono uppercase tracking-wider text-ink-muted sticky top-0">
                <tr>
                  <th className="text-left px-4 py-2.5 w-8">#</th>
                  <th className="text-left px-4 py-2.5">Case</th>
                  <th className="text-left px-4 py-2.5">Patient</th>
                  <th className="text-left px-4 py-2.5">Diagnosis</th>
                  <th className="text-left px-4 py-2.5">Treatment</th>
                  <th className="text-left px-4 py-2.5">Verdict</th>
                  <th className="text-right px-4 py-2.5">Cost</th>
                  <th className="text-right px-4 py-2.5 w-20">Finished</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {rows.map((r, i) => (
                  <tr
                    key={r.case_id}
                    className={clsx(
                      "transition-colors",
                      r.status === "in_flight" && "bg-accent-brand/[0.04]",
                    )}
                  >
                    <td className="px-4 py-2 text-[10px] font-mono text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-ink-muted">{r.case_id}</td>
                    <td className="px-4 py-2 font-mono text-xs text-ink-body">{r.patient}</td>
                    <td className="px-4 py-2 text-xs text-ink-body">{r.diagnosis}</td>
                    <td className="px-4 py-2 text-xs text-ink-primary">{r.treatment}</td>
                    <td className="px-4 py-2">
                      {r.status === "queued" ? (
                        <span className="text-[10px] font-mono uppercase text-ink-faint">queued</span>
                      ) : r.status === "in_flight" ? (
                        <span className="text-[10px] font-mono uppercase text-accent-brand flex items-center gap-1">
                          <Loader2 size={10} className="animate-spin" />
                          in flight
                        </span>
                      ) : (
                        <StatusPill status={STATUS_TO_PILL[r.status]} />
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-xs text-ink-muted nums-tabular">
                      {r.cost_usd > 0 ? `$${r.cost_usd.toFixed(4)}` : "—"}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-[10px] text-ink-muted">
                      {r.finished_at_ms ? `${(r.finished_at_ms / 1000).toFixed(1)}s` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {phase === "done" && (
            <div className="px-5 py-4 border-t border-surface-border bg-accent-green/5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={16} className="text-accent-green" />
                <span className="text-sm font-medium text-ink-primary">
                  Batch complete
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <BatchSummary label="Approved"   value={rows.filter((r) => r.status === "approved").length} accent="green" />
                <BatchSummary label="Denied"     value={rows.filter((r) => r.status === "denied").length}   accent="red" />
                <BatchSummary label="Referred"   value={rows.filter((r) => r.status === "referred").length} accent="amber" />
                <BatchSummary label="Appealed"   value={rows.filter((r) => r.status === "appealed").length} accent="violet" />
                <BatchSummary label="Total cost" value={`$${totalCost.toFixed(2)}`} accent="cyan" mono />
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-muted font-mono">
                <AlertCircle size={11} />
                <span>3 appealed cases auto-drafted by Appeals Drafter agent · 0 errors</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-accent-brand text-ink-invert hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Download size={11} />
                  Download results CSV
                </button>
                <button
                  type="button"
                  className="text-xs font-medium px-3 py-1.5 rounded-md border border-surface-border text-ink-body hover:bg-surface-raised-hi transition-colors flex items-center gap-1.5"
                >
                  <FileText size={11} />
                  Generate compliance report
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BatchSummary({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: number | string;
  accent: "green" | "red" | "amber" | "violet" | "cyan";
  mono?: boolean;
}) {
  const tint =
    accent === "green"  ? "text-accent-green" :
    accent === "red"    ? "text-accent-red"   :
    accent === "amber"  ? "text-accent-amber" :
    accent === "violet" ? "text-accent-violet":
                          "text-accent-cyan";
  return (
    <div className="bg-surface-raised border border-surface-border rounded-md p-2.5">
      <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">{label}</div>
      <div className={clsx("text-lg font-semibold mt-0.5 nums-tabular", tint, mono && "text-base font-mono")}>
        {value}
      </div>
    </div>
  );
}
