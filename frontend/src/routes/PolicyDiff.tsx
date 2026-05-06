/**
 * /policies/:policyId/diff — Policy Diff Viewer.
 *
 * When a payer publishes a new policy version, Authrex shows what criteria
 * changed and which in-flight cases are now affected. Operational moat —
 * no other PA tool does this.
 */
import clsx from "clsx";
import { AlertCircle, ArrowLeft, ArrowRight, GitCompare, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { POLICIES, POLICY_DIFFS } from "../lib/syntheticPolicies";

export default function PolicyDiff() {
  const { policyId } = useParams<{ policyId: string }>();
  const policy = useMemo(
    () => POLICIES.find((p) => p.policy_id === policyId),
    [policyId],
  );
  const diff = policyId ? POLICY_DIFFS[policyId] : undefined;

  if (!policy || !diff) {
    return (
      <div className="px-6 py-12 text-center text-ink-muted">
        <p className="text-sm">No diff available for policy <span className="font-mono">{policyId}</span>.</p>
        <Link to="/policies" className="text-accent-brand hover:underline text-sm mt-2 inline-block">
          ← Back to Policy Library
        </Link>
      </div>
    );
  }

  const verdictChanges = diff.affected_in_flight_cases.filter(
    (c) => c.old_verdict !== c.new_verdict,
  );

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <Link
          to="/policies"
          className="text-sm text-ink-muted hover:text-ink-primary flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} />
          Policy Library
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-accent-brand mb-2">
          <GitCompare size={12} />
          POLICY DIFF VIEWER
          <span className="text-ink-faint">·</span>
          <span className="text-ink-muted">novelty</span>
        </div>
        <h1 className="text-2xl font-semibold text-ink-primary leading-tight">
          {policy.title}
        </h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-ink-muted flex-wrap">
          <span className="font-mono">
            {policy.payer_id.toUpperCase()} · {policy.policy_id}
          </span>
          <span className="text-ink-faint">·</span>
          <span className="flex items-center gap-1.5">
            <span className="font-mono px-1.5 py-0.5 rounded bg-surface-panel text-ink-body">
              {diff.from_version}
            </span>
            <ArrowRight size={12} />
            <span className="font-mono px-1.5 py-0.5 rounded bg-accent-brand/15 text-accent-brand">
              {diff.to_version}
            </span>
          </span>
          <span className="text-ink-faint">·</span>
          <span>14 days ago</span>
        </div>
      </div>

      {/* Impact callout */}
      <div className="bg-accent-amber/5 border border-accent-amber/30 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
        <AlertCircle size={18} className="text-accent-amber shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-sm font-medium text-ink-primary">
            <span className="font-mono nums-tabular">{verdictChanges.length}</span> in-flight case{verdictChanges.length === 1 ? "" : "s"} affected by this change
          </div>
          <div className="text-xs text-ink-muted mt-0.5">
            Authrex auto-re-evaluates open cases when a payer publishes a new policy version.
            Resubmission may be required for cases now flagged REFER.
          </div>
        </div>
        <button
          type="button"
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-accent-amber text-ink-invert hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw size={11} />
          Re-evaluate all
        </button>
      </div>

      {/* Side-by-side diff */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DiffColumn
          version={diff.from_version}
          label="Previous"
          tone="muted"
          segments={diff.segments_v_old}
        />
        <DiffColumn
          version={diff.to_version}
          label="Current"
          tone="active"
          segments={diff.segments_v_new}
        />
      </section>

      {/* Summary changes */}
      <section className="bg-surface-raised border border-surface-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-ink-primary mb-3">Summary of changes</h3>
        <ul className="space-y-1.5">
          {diff.summary_changes.map((c, i) => (
            <li key={i} className="text-sm text-ink-body flex items-start gap-2">
              <span className="text-accent-brand shrink-0 mt-1">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Affected cases table */}
      <section className="bg-surface-raised border border-surface-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink-primary">
            In-flight cases re-evaluated under {diff.to_version}
          </h3>
          <span className="text-[11px] font-mono text-ink-muted">
            {diff.affected_in_flight_cases.length} cases
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-panel text-[10px] font-mono uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="text-left px-4 py-2.5">Case</th>
              <th className="text-left px-4 py-2.5">Patient</th>
              <th className="text-left px-4 py-2.5">Treatment</th>
              <th className="text-left px-4 py-2.5 w-32">Old verdict</th>
              <th className="text-left px-4 py-2.5 w-8"></th>
              <th className="text-left px-4 py-2.5 w-32">New verdict</th>
              <th className="text-left px-4 py-2.5">Reason</th>
              <th className="px-4 py-2.5 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {diff.affected_in_flight_cases.map((c) => {
              const changed = c.old_verdict !== c.new_verdict;
              return (
                <tr
                  key={c.case_id}
                  className={clsx("hover:bg-surface-raised-hi transition-colors", changed && "bg-accent-amber/[0.03]")}
                >
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                    {c.case_id}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-body">
                    {c.patient}
                  </td>
                  <td className="px-4 py-2.5 text-ink-primary">
                    {c.treatment}
                  </td>
                  <td className="px-4 py-2.5">
                    <VerdictText v={c.old_verdict} faded />
                  </td>
                  <td className="px-4 py-2.5 text-ink-faint">
                    <ArrowRight size={12} />
                  </td>
                  <td className="px-4 py-2.5">
                    <VerdictText v={c.new_verdict} faded={!changed} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-ink-muted">
                    {c.reason}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      to={`/cases/${c.case_id}`}
                      className="inline-flex text-ink-faint hover:text-accent-brand transition-colors"
                    >
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function DiffColumn({
  version,
  label,
  tone,
  segments,
}: {
  version: string;
  label: string;
  tone: "muted" | "active";
  segments: { type: "unchanged" | "removed" | "added"; text: string }[];
}) {
  return (
    <div className={clsx(
      "border rounded-2xl overflow-hidden",
      tone === "active" ? "border-accent-brand/30" : "border-surface-border",
    )}>
      <div
        className={clsx(
          "px-5 py-2.5 border-b text-xs font-medium flex items-center justify-between",
          tone === "active"
            ? "border-accent-brand/30 bg-accent-brand/5 text-accent-brand"
            : "border-surface-border bg-surface-panel text-ink-muted",
        )}
      >
        <span>{label}</span>
        <span className="font-mono">{version}</span>
      </div>
      <div className="p-5 text-sm leading-relaxed font-mono whitespace-pre-wrap">
        {segments.map((seg, i) => (
          <span
            key={i}
            className={clsx(
              seg.type === "removed" && "bg-accent-red/10 text-accent-red line-through px-0.5 rounded",
              seg.type === "added"   && "bg-accent-green/10 text-accent-green underline decoration-accent-green/40 px-0.5 rounded",
              seg.type === "unchanged" && "text-ink-body",
            )}
          >
            {seg.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function VerdictText({ v, faded }: { v: "APPROVE" | "DENY" | "REFER"; faded?: boolean }) {
  const tint =
    v === "APPROVE" ? "text-accent-green" :
    v === "DENY"    ? "text-accent-red"   :
                      "text-accent-amber";
  return (
    <span className={clsx("text-xs font-mono font-semibold", tint, faded && "opacity-60")}>
      {v}
    </span>
  );
}
