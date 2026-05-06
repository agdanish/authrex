/**
 * Dashboard — the new /dashboard route. Replaces the legacy Home component.
 *
 * Layout (top-down):
 *   1. Aurora-backed hero with kinetic H1 + sub + trust badges
 *   2. 4 KPI tiles (Active cases / Avg time / Approval rate / Cost-to-date)
 *   3. Two-column row: Recent cases ribbon (left) + Agent health panel (right)
 *   4. Footer band: 7-agent DAG flow + CMS-0057-F countdown
 */
import clsx from "clsx";
import { ArrowRight, ScrollText, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AgentHealthPanel } from "../components/AgentHealthPanel";
import { AuroraBackground } from "../components/AuroraBackground";
import { KineticHeading } from "../components/KineticHeading";
import { RecentCasesRibbon } from "../components/RecentCasesRibbon";
import { StatTile } from "../components/StatTile";
import { TrustBadgeRow } from "../components/TrustBadgeRow";
import { api, type OrgValueRollup } from "../lib/api";
import { CMS_0057_F_CLAUSES, daysUntil } from "../lib/regulatory";
import type { DemoFixture } from "../lib/types";

const VERDICT_TINT: Record<string, string> = {
  APPROVE: "bg-accent-green/10 text-accent-green border-accent-green/30",
  DENY:    "bg-accent-red/10   text-accent-red   border-accent-red/30",
  REFER:   "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
};

export default function Dashboard() {
  const [fixtures, setFixtures] = useState<DemoFixture[] | null>(null);
  const [creating, setCreating] = useState<string | null>(null);
  const [orgValue, setOrgValue] = useState<OrgValueRollup | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.listFixtures().then(setFixtures).catch(() => setFixtures([]));
    // Live business-value rollup — populates the new KPI tile.
    api.getOrgValue().then(setOrgValue).catch(() => setOrgValue(null));
  }, []);

  // Active cases sparkline (last 7d, plausible synthetic series)
  const sparkActive = useMemo(() => [3, 5, 4, 6, 9, 7, 12], []);

  async function startDemo(name: string) {
    setCreating(name);
    try {
      const { case_id } = await api.createFromFixture(name);
      navigate(`/cases/${case_id}`);
    } catch {
      setCreating(null);
    }
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-raised px-8 py-12 mb-6">
        <AuroraBackground />

        <div className="relative max-w-3xl">
          <div className="text-[11px] font-mono uppercase tracking-widest text-accent-brand mb-3">
            HEALTHCARE · PRIOR AUTHORISATION AUTOMATION
          </div>

          <KineticHeading
            as="h1"
            staggerMs={50}
            className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight text-ink-primary mb-4"
            parts={[
              "Approve cancer treatment in ",
              { accent: "minutes," },
              " not weeks.",
            ]}
          />

          <p className="text-base md:text-lg text-ink-body leading-relaxed mb-5 max-w-2xl">
            Provider-side, FHIR-native copilot. Seven agents read clinical evidence and
            payer policy, then ship a verdict with a citation chain. On denial, an
            NCCN-grounded appeal letter is drafted automatically. Deploys natively to
            <strong className="text-accent-brand"> Cognizant TriZetto AI Gateway</strong>.
          </p>

          <TrustBadgeRow />

          {/* Quick-start demos */}
          {fixtures && fixtures.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Sparkles size={14} className="text-accent-brand" />
              <span className="text-xs text-ink-muted font-mono">
                Try a live demo:
              </span>
              {fixtures.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => startDemo(f.name)}
                  disabled={creating !== null}
                  className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-all ${VERDICT_TINT[f.expected_verdict] ?? ""} hover:shadow-md disabled:opacity-50`}
                  title={f.label}
                >
                  {creating === f.name ? "starting..." : f.expected_verdict}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* KPI ROW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile
          eyebrow="ACTIVE CASES"
          value={orgValue ? String(orgValue.cases_total) : "—"}
          spark={sparkActive}
          hint={
            orgValue
              ? `${orgValue.cases_decided} decided MTD`
              : "loading…"
          }
        />
        <StatTile
          eyebrow="AVG TIME-TO-DECISION"
          value={
            orgValue?.avg_decision_seconds != null
              ? `${orgValue.avg_decision_seconds.toFixed(1)}s`
              : "—"
          }
          trend={{ value: -98, goodDirection: "down" }}
          hint={
            orgValue?.avg_speedup_factor != null
              ? `${orgValue.avg_speedup_factor.toFixed(1)}× faster than 18-min AMA median`
              : "vs 18-min AMA median"
          }
        />
        <StatTile
          eyebrow="DIRECT SAVINGS · MTD"
          value={
            orgValue
              ? `$${orgValue.direct_savings_mtd_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              : "—"
          }
          valueClassName="text-accent-green"
          hint="vs $1,500 / case AMA baseline"
        />
        <StatTile
          eyebrow="ANNUALIZED PROJECTION"
          value={
            orgValue
              ? `$${(orgValue.direct_savings_annual_projection_usd / 1_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}K`
              : "—"
          }
          valueClassName="text-accent-cyan"
          hint="last 30d × 12 — see /roi for Stars math"
        />
      </section>

      {/* TWO-COL: RECENT CASES + AGENT HEALTH */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 mb-6">
        <RecentCasesRibbon />
        <AgentHealthPanel />
      </section>

      {/* FOOTER BAND */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-accent-brand-soft/40 border border-accent-brand/20 rounded-2xl px-5 py-4">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent-brand mb-2">
            7-AGENT LANGGRAPH DAG · 22 SUB-AGENTS
          </div>
          <div className="font-mono text-xs md:text-sm text-ink-primary leading-relaxed">
            Clinical Extractor → Policy Retriever → Necessity Reasoner → Decision Composer → Denial Forecaster → Appeals Drafter → Patient Communicator
          </div>
          <div className="mt-1 text-[11px] text-ink-muted">
            Bedrock + Claude Sonnet 4.6 · MCP-native · Cognizant Neuro-SAN compatible (
            <code className="font-mono">ops/cognizant-neuro/authrex-network.hocon</code>)
          </div>
          <Link
            to="/agents"
            className="mt-2 inline-flex items-center gap-1 text-xs text-accent-brand hover:underline"
          >
            View agent meta-view →
          </Link>
        </div>

        <div className="bg-surface-raised border border-surface-border rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <ScrollText size={14} className="text-accent-amber" />
            <div className="text-[10px] font-mono uppercase tracking-widest text-ink-muted">
              CMS-0057-F · 89 FR 8758 · clause readiness
            </div>
          </div>
          <ul className="space-y-1.5">
            {CMS_0057_F_CLAUSES.slice(0, 4).map((c) => {
              const days = daysUntil(c.effective_iso);
              const past = days < 0;
              return (
                <li key={c.id} className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-[10px] text-accent-amber w-14 shrink-0">
                    {c.id}
                  </span>
                  <span className="text-ink-body flex-1 truncate" title={c.detail}>
                    {c.headline}
                  </span>
                  <span className={clsx(
                    "font-mono text-[10px] nums-tabular shrink-0",
                    past ? "text-accent-green" : "text-ink-muted",
                  )}>
                    {past ? "in force" : `T-${days}d`}
                  </span>
                </li>
              );
            })}
          </ul>
          <Link
            to="/compliance"
            className="mt-3 inline-flex items-center gap-1 text-[11px] text-accent-brand hover:underline"
          >
            View full CMS-0057-F readiness
            <ArrowRight size={11} />
          </Link>
        </div>
      </section>
    </div>
  );
}
