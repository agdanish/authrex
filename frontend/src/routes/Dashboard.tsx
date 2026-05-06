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
import { KineticHeading } from "../components/KineticHeading";
import { RecentCasesRibbon } from "../components/RecentCasesRibbon";
import { StatTile } from "../components/StatTile";
import { api, type OrgValueRollup } from "../lib/api";
import { CMS_0057_F_CLAUSES, daysUntil } from "../lib/regulatory";
import type { DemoFixture } from "../lib/types";

const VERDICT_TINT: Record<string, string> = {
  APPROVE: "bg-accent-green/10 text-accent-green border-accent-green/30",
  DENY:    "bg-accent-red/10   text-accent-red   border-accent-red/30",
  REFER:   "bg-accent-amber/10 text-accent-amber border-accent-amber/30",
};

/**
 * TrustChip — small inline pill with a coloured status dot. Ported from
 * Claude Design's standalone dashboard so the hero pills match the
 * showcase: HIPAA · PHI redaction / FHIR R4 · USCDI v3 / Bedrock-ready / CMS-0057-F.
 */
function TrustChip({
  dot,
  children,
}: {
  dot: "cyan" | "brand" | "green";
  children: React.ReactNode;
}) {
  const dotColor =
    dot === "cyan" ? "bg-accent-cyan"
    : dot === "brand" ? "bg-accent-brand-glow"
    : "bg-accent-green";
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-ink-body bg-surface-bg border border-surface-border rounded-md">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {children}
    </span>
  );
}

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
    <div className="px-6 py-6">
      {/* HERO band — 2-col grid (text + shield). Background washes fill the
          card edge-to-edge so light mode doesn't show a white void in the
          middle. Shield is now a real grid column, not absolute, so there's
          no orphan space between the text and the silhouette. */}
      <section className="relative card-premium bg-surface-raised border border-surface-border rounded-2xl p-7 sm:p-9 mb-6 overflow-hidden">
        {/* Layered depth: dual radial wash + grid pattern + soft top spotlight */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 460px at 88% -10%, rgba(0,163,224,0.18), transparent 65%), radial-gradient(700px 380px at -10% 110%, rgba(0,51,161,0.20), transparent 60%), radial-gradient(600px 360px at 50% 50%, rgba(37,99,217,0.06), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 grid-bg opacity-60" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-12 items-center">
          {/* Text column */}
          <div>
            {/* Status pill — eyebrow with live cyan dot */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-accent-brand/25 bg-accent-brand/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent-brand-glow">
                Healthcare · Prior Authorisation Automation
              </span>
            </div>

            <KineticHeading
              as="h1"
              staggerMs={60}
              className="display-tight text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.04] text-ink-primary mt-4"
              parts={[
                "Approve Cancer Treatment in ",
                { accent: "Minutes," },
                " Not Weeks.",
              ]}
            />

            <p className="text-ink-body leading-relaxed mt-4 max-w-[58ch] text-[14.5px]">
              Provider-side, FHIR-native copilot. Seven agents read clinical evidence and
              payer policy, then ship a verdict with a citation chain. On denial, an
              NCCN-grounded appeal letter is drafted automatically. Deploys natively to
              <strong className="text-accent-brand"> Cognizant TriZetto AI Gateway</strong>.
            </p>

            <div className="mt-6 flex items-center gap-2 flex-wrap">
              <TrustChip dot="cyan">HIPAA · PHI redaction</TrustChip>
              <TrustChip dot="brand">FHIR R4 · USCDI v3</TrustChip>
              <TrustChip dot="green">Bedrock-ready</TrustChip>
              <TrustChip dot="cyan">CMS-0057-F · 2026 / 2027</TrustChip>
            </div>

            {/* Quick-start demos */}
            {fixtures && fixtures.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Sparkles size={14} className="text-accent-brand-glow" />
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

          {/* Shield column — hidden on small, fills its own grid track */}
          <div
            className="hidden lg:flex items-center justify-center motion-safe:animate-float-soft shrink-0"
            style={{ filter: "drop-shadow(0 18px 40px rgba(0,51,161,0.30))" }}
            aria-hidden="true"
          >
            <svg width="200" height="240" viewBox="0 0 180 220" className="opacity-95">
              <defs>
                <linearGradient id="hSh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563d9" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#0033a1" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0a1f44" />
                </linearGradient>
                <linearGradient id="hShG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="hT" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00b5b8" />
                  <stop offset="100%" stopColor="#00a3e0" />
                </linearGradient>
              </defs>
              <path d="M90 8 L168 30 V102 C168 156 138 196 90 214 C42 196 12 156 12 102 V30 Z" fill="url(#hSh)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              <path d="M90 8 L168 30 V102 C168 156 138 196 90 214 C42 196 12 156 12 102 V30 Z" fill="url(#hShG)" />
              <rect x="82" y="50" width="16" height="100" rx="3" fill="#ffffff" opacity="0.92" />
              <rect x="50" y="86" width="80" height="16" rx="3" fill="#ffffff" opacity="0.92" />
              <path d="M30 130 L46 130 L52 116 L62 144 L72 124 L82 140 L92 124 L102 140 L112 116 L122 144 L130 130 L150 130" fill="none" stroke="url(#hT)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="150" cy="130" r="3" fill="#00b5b8" />
            </svg>
          </div>
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
