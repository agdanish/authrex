/**
 * /cases — All Cases table. Filter pills + payer dropdown + search + table.
 *
 * Hybrid data source: live cases from GET /api/v1/cases (real backend) merged
 * with synthetic historical cases for breadth. Live cases marked with a green
 * "live" pill; synthetic with a faint "demo" pill.
 */
import clsx from "clsx";
import { ArrowRight, ChevronDown, Loader2, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { PayerCell } from "../components/PayerCell";
import { SLABadge } from "../components/SLABadge";
import { StatusPill } from "../components/StatusPill";
import { api, type CaseListItem } from "../lib/api";
import {
  PAYERS,
  STATUSES,
  SYNTHETIC_CASES,
  type CaseStatus,
  type SyntheticCase,
} from "../lib/syntheticCases";

type StatusFilter = "all" | CaseStatus;
type PayerFilter = "all" | "aetna" | "uhc" | "bcbs" | "anthem";

function liveToCase(item: CaseListItem): SyntheticCase {
  const ms = item.created_at ? Date.now() - new Date(item.created_at).getTime() : 0;
  const ago =
    ms < 60_000   ? "just now" :
    ms < 3_600_000 ? `${Math.round(ms / 60_000)}m ago` :
    ms < 86_400_000 ? `${Math.round(ms / 3_600_000)}h ago` :
    `${Math.round(ms / 86_400_000)}d ago`;
  return {
    case_id: item.case_id,
    status: item.status as CaseStatus,
    patient_initials: item.patient_initials,
    treatment: item.treatment,
    j_code: item.j_code ?? "—",
    payer_id: (item.payer_id as SyntheticCase["payer_id"]) ?? "aetna",
    verdict: item.verdict,
    confidence: item.confidence ?? null,
    submitted_at: item.created_at ?? new Date().toISOString(),
    ago,
    diagnosis: "—",  // not in list response
    stage: "—",
    is_synthetic: false,
  };
}

const STATUS_PILLS: { value: StatusFilter; label: string }[] = [
  { value: "all",        label: "All" },
  { value: "pending",    label: "Pending" },
  { value: "running",    label: "Running" },
  { value: "approved",   label: "Approved" },
  { value: "denied",     label: "Denied" },
  { value: "referred",   label: "Referred" },
  { value: "appealed",   label: "Appealed" },
  { value: "overturned", label: "Overturned" },
];

export default function Cases() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [payerFilter, setPayerFilter] = useState<PayerFilter>("all");
  const [search, setSearch] = useState("");
  const [liveCases, setLiveCases] = useState<SyntheticCase[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  // Fetch real backend cases on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await api.listCases({ limit: 50 });
        if (cancelled) return;
        const mapped = (d.cases || []).map(liveToCase);
        setLiveCases(mapped);
      } catch (e) {
        if (cancelled) return;
        console.warn("Cases: list endpoint failed", e);
      } finally {
        if (!cancelled) setLoadingLive(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Merge: live cases first (deduped against synthetic), synthetic for breadth
  const allCases: SyntheticCase[] = useMemo(() => {
    if (liveCases.length === 0) return SYNTHETIC_CASES;
    const liveIds = new Set(liveCases.map((c) => c.case_id));
    const synthFiltered = SYNTHETIC_CASES.filter((c) => !liveIds.has(c.case_id));
    return [...liveCases, ...synthFiltered];
  }, [liveCases]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allCases.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (payerFilter !== "all" && c.payer_id !== payerFilter) return false;
      if (q) {
        const blob =
          `${c.case_id} ${c.patient_initials} ${c.treatment} ${c.j_code} ${c.diagnosis}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [allCases, statusFilter, payerFilter, search]);

  const counts = useMemo(() => {
    const c: Partial<Record<StatusFilter, number>> = { all: allCases.length };
    for (const cs of STATUSES) {
      c[cs] = allCases.filter((x) => x.status === cs).length;
    }
    return c;
  }, [allCases]);

  const liveCount = liveCases.length;

  const activeCount = (counts.running ?? 0) + (counts.pending ?? 0);

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-5 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary leading-tight">
            All cases
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            <span className="font-mono nums-tabular text-ink-body">{allCases.length}</span> total
            <span className="mx-2 text-ink-faint">·</span>
            <span className="font-mono nums-tabular text-accent-green">{liveCount}</span> live
            {loadingLive && <Loader2 size={11} className="inline-block animate-spin ml-1 text-ink-faint" />}
            <span className="mx-2 text-ink-faint">·</span>
            <span className="font-mono nums-tabular text-ink-body">{activeCount}</span> active
            <span className="mx-2 text-ink-faint">·</span>
            <span className="font-mono nums-tabular text-ink-body">{counts.appealed ?? 0}</span> in appeal
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent-brand text-ink-invert text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} strokeWidth={2.5} />
          New case
        </button>
      </header>

      {/* Filter bar */}
      <div className="bg-surface-raised border border-surface-border rounded-2xl mb-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-surface-border">
          {STATUS_PILLS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setStatusFilter(p.value)}
              className={clsx(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5",
                statusFilter === p.value
                  ? "bg-accent-brand text-ink-invert"
                  : "bg-surface-panel text-ink-body hover:bg-surface-raised-hi",
              )}
            >
              {p.label}
              <span
                className={clsx(
                  "text-[10px] font-mono",
                  statusFilter === p.value ? "opacity-80" : "text-ink-faint",
                )}
              >
                {counts[p.value] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 p-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-bg">
            <Search size={14} className="text-ink-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatment, patient, case_id, diagnosis..."
              className="flex-1 bg-transparent outline-none text-sm text-ink-primary placeholder:text-ink-faint"
            />
          </div>

          <div className="relative">
            <select
              value={payerFilter}
              onChange={(e) => setPayerFilter(e.target.value as PayerFilter)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-surface-border bg-surface-bg text-sm text-ink-body cursor-pointer hover:bg-surface-raised-hi"
            >
              <option value="all">All payers</option>
              {PAYERS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-raised border border-surface-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-ink-muted text-sm">
            No cases match your filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-panel text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              <tr>
                <th className="text-left px-4 py-2.5 w-28">Status</th>
                <th className="text-left px-4 py-2.5 w-32">Case ID</th>
                <th className="text-left px-4 py-2.5 w-16">Patient</th>
                <th className="text-left px-4 py-2.5">Treatment</th>
                <th className="text-left px-4 py-2.5">Diagnosis</th>
                <th className="text-left px-4 py-2.5 w-20">Payer</th>
                <th className="text-left px-4 py-2.5 w-24">Verdict</th>
                <th className="text-left px-4 py-2.5 w-32">Confidence</th>
                <th className="text-right px-4 py-2.5 w-24">Submitted</th>
                <th
                  className="text-left px-3 py-2.5 w-24"
                  title="CMS-0057-F § IV.B — 7-day standard / 72-hour expedited turnaround"
                >
                  SLA
                </th>
                <th className="px-4 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((c) => (
                <tr
                  key={c.case_id}
                  className="hover:bg-surface-raised-hi transition-colors group"
                >
                  <td className="px-4 py-2.5">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                    {c.case_id}
                    {c.is_synthetic && (
                      <span className="ml-1.5 text-[9px] uppercase tracking-wider text-ink-faint">
                        demo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-body">
                    {c.patient_initials}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-ink-primary font-medium leading-tight">
                      {c.treatment}
                    </div>
                    <div className="text-[10px] font-mono text-ink-faint mt-0.5">
                      {c.j_code}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="text-xs text-ink-body">{c.diagnosis}</div>
                    <div className="text-[10px] font-mono text-ink-faint mt-0.5">
                      Stage {c.stage}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <PayerCell payer_id={c.payer_id} showLabel={false} />
                  </td>
                  <td className="px-4 py-2.5">
                    {c.verdict ? (
                      <VerdictText verdict={c.verdict} />
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {c.confidence !== null ? (
                      <ConfidenceBar value={c.confidence} verdict={c.verdict} />
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[11px] text-ink-muted">
                    {c.ago}
                  </td>
                  <td className="px-3 py-2.5">
                    <SLABadge
                      createdAt={c.submitted_at}
                      decidedAt={
                        c.status === "approved" ||
                        c.status === "denied" ||
                        c.status === "overturned"
                          ? c.submitted_at
                          : null
                      }
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    {c.is_synthetic ? (
                      <ArrowRight size={14} className="text-ink-faint opacity-30" />
                    ) : (
                      <Link
                        to={`/cases/${c.case_id}`}
                        className="inline-flex text-ink-faint hover:text-accent-brand transition-colors"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-surface-border text-[11px] text-ink-muted">
          <span>
            Showing <span className="font-mono text-ink-body">{filtered.length}</span> of{" "}
            <span className="font-mono text-ink-body">{SYNTHETIC_CASES.length}</span> cases
          </span>
          <span className="font-mono">page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}

function VerdictText({ verdict }: { verdict: "APPROVE" | "DENY" | "REFER" }) {
  const tint =
    verdict === "APPROVE" ? "text-accent-green" :
    verdict === "DENY"    ? "text-accent-red"   :
                            "text-accent-amber";
  return (
    <span className={clsx("text-[11px] font-mono font-semibold", tint)}>
      {verdict}
    </span>
  );
}

function ConfidenceBar({
  value,
  verdict,
}: {
  value: number;
  verdict: "APPROVE" | "DENY" | "REFER" | null;
}) {
  const pct = Math.round(value * 100);
  const fill =
    verdict === "APPROVE" ? "bg-accent-green" :
    verdict === "DENY"    ? "bg-accent-red"   :
    verdict === "REFER"   ? "bg-accent-amber" :
                            "bg-accent-brand";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-surface-border overflow-hidden">
        <div
          className={clsx("h-full rounded-full", fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-ink-muted w-7 text-right nums-tabular">
        {pct}%
      </span>
    </div>
  );
}
