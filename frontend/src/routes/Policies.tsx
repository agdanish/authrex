/**
 * /policies — Policy Library card grid.
 *
 * 5 real payer policies from backend/app/data/policies.json (mirrored in
 * lib/syntheticPolicies.ts for synchronous client render). Each card shows
 * payer + policy ID + title + version + last-updated time + section count.
 *
 * Click a card → /policies/:policy_id/diff (Phase 6 second route).
 */
import clsx from "clsx";
import { ArrowRight, BookOpen, ChevronDown, FileText, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { POLICIES } from "../lib/syntheticPolicies";

const PAYER_TINT: Record<string, string> = {
  aetna:  "bg-rose-500/15    text-rose-700    dark:text-rose-300",
  uhc:    "bg-blue-500/15    text-blue-700    dark:text-blue-300",
  bcbs:   "bg-cyan-500/15    text-cyan-700    dark:text-cyan-300",
  anthem: "bg-indigo-500/15  text-indigo-700  dark:text-indigo-300",
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (d < 1) return "today";
  if (d < 30) return `${d} days ago`;
  if (d < 365) return `${Math.floor(d / 30)} months ago`;
  return `${Math.floor(d / 365)} years ago`;
}

export default function Policies() {
  const [search, setSearch] = useState("");
  const [payerFilter, setPayerFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return POLICIES.filter((p) => {
      if (payerFilter !== "all" && p.payer_id !== payerFilter) return false;
      if (q) {
        const blob = `${p.policy_id} ${p.title} ${p.treatment_keywords.join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [search, payerFilter]);

  const recentlyUpdated = POLICIES.filter((p) => p.status === "updated_recently");

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <header className="mb-5 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-ink-primary leading-tight flex items-center gap-2">
            <BookOpen size={22} className="text-accent-brand" />
            Policy Library
          </h1>
          <p className="text-sm text-ink-muted mt-1">
            <span className="font-mono text-ink-body">{POLICIES.length}</span> policies indexed
            <span className="mx-2 text-ink-faint">·</span>
            <span className="font-mono text-ink-body">4</span> payers
            <span className="mx-2 text-ink-faint">·</span>
            <span className="text-accent-cyan font-medium">RAG-ready</span>
          </p>
        </div>
        <div className="text-[10px] font-mono text-ink-muted">
          BACKED BY · pgvector + Bedrock KB-ready
        </div>
      </header>

      {/* Recently updated callout */}
      {recentlyUpdated.length > 0 && (
        <div className="bg-accent-amber/5 border border-accent-amber/30 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
          <Sparkles size={16} className="text-accent-amber shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm font-medium text-ink-primary">
              {recentlyUpdated.length} polic{recentlyUpdated.length === 1 ? "y" : "ies"} updated recently
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              Authrex automatically re-evaluates in-flight cases against new policy versions. View the diff to see what criteria changed.
            </div>
          </div>
          {recentlyUpdated[0] && (
            <Link
              to={`/policies/${recentlyUpdated[0].policy_id}/diff`}
              className="text-xs font-medium text-accent-amber hover:underline shrink-0"
            >
              View diff →
            </Link>
          )}
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-surface-raised border border-surface-border rounded-2xl p-3 mb-4 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-bg">
          <Search size={14} className="text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by treatment, policy ID, or title..."
            className="flex-1 bg-transparent outline-none text-sm text-ink-primary placeholder:text-ink-faint"
          />
        </div>
        <div className="relative">
          <select
            value={payerFilter}
            onChange={(e) => setPayerFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-surface-border bg-surface-bg text-sm text-ink-body cursor-pointer hover:bg-surface-raised-hi"
          >
            <option value="all">All payers</option>
            <option value="aetna">Aetna</option>
            <option value="uhc">UnitedHealthcare</option>
            <option value="bcbs">BlueCross BlueShield</option>
            <option value="anthem">Anthem</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
          />
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isUpdated = p.status === "updated_recently";
          return (
            <Link
              key={`${p.payer_id}-${p.policy_id}`}
              to={`/policies/${p.policy_id}/diff`}
              className="group bg-surface-raised border border-surface-border rounded-2xl p-5 hover:border-accent-brand/50 hover:shadow-md transition-all flex flex-col gap-3 relative"
            >
              {isUpdated && (
                <span className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-accent-amber/15 text-accent-amber animate-pulse-soft">
                  updated
                </span>
              )}

              <div className="flex items-start gap-3">
                <span
                  className={clsx(
                    "w-10 h-10 rounded-lg font-bold font-mono text-base flex items-center justify-center shrink-0",
                    PAYER_TINT[p.payer_id],
                  )}
                >
                  {p.initial}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
                    {p.payer_id.toUpperCase()} · POLICY {p.policy_id}
                  </div>
                  <h3 className="text-sm font-semibold text-ink-primary mt-0.5 line-clamp-2 leading-tight">
                    {p.title}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {p.treatment_keywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-panel text-ink-body"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted font-mono mt-auto pt-2 border-t border-surface-border">
                <span className="flex items-center gap-1">
                  <FileText size={11} />
                  {p.section_count} {p.section_count === 1 ? "section" : "sections"} · {p.word_count.toLocaleString()} words
                </span>
                <span>{p.version}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>updated {timeAgo(p.last_updated_iso)}</span>
                <span className="flex items-center gap-1 text-accent-brand opacity-0 group-hover:opacity-100 transition-opacity">
                  View policy <ArrowRight size={11} />
                </span>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full p-10 text-center text-ink-muted text-sm">
            No policies match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
