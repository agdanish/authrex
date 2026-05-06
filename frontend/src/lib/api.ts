// Typed API client. Vite proxies /api to localhost:8000 in dev.
// Auto-attaches the JWT from localStorage; 401 → clear storage + redirect to /login.
import { authHeader, clearAuth } from "./auth";
import type {
  AgentRun,
  DemoFixture,
  RunResult,
} from "./types";

const BASE = "/api/v1";

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    clearAuth();
    if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
      window.location.href = "/login";
    }
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

function authedFetch(input: string, init?: RequestInit): Promise<Response> {
  const headers = {
    ...(init?.headers as Record<string, string> | undefined),
    ...authHeader(),
  };
  return fetch(input, { ...init, headers });
}

export interface CaseListItem {
  case_id: string;
  payer_id: string;
  patient_initials: string;
  status: string;
  treatment: string;
  j_code: string | null;
  verdict: "APPROVE" | "DENY" | "REFER" | null;
  confidence: number | null;
  created_at: string | null;
}

export const api = {
  async listFixtures(): Promise<DemoFixture[]> {
    const res = await fetch(`${BASE}/demo-fixtures`);
    const data = await jsonOrThrow<{ fixtures: DemoFixture[] }>(res);
    return data.fixtures;
  },

  async createFromFixture(name: string): Promise<{ case_id: string; fixture: DemoFixture }> {
    const res = await authedFetch(`${BASE}/demo-fixtures/${name}/create-case`, {
      method: "POST",
    });
    return jsonOrThrow(res);
  },

  async listCases(params: {
    limit?: number;
    status?: string;
    payer_id?: string;
    search?: string;
  } = {}): Promise<{ cases: CaseListItem[]; total: number }> {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    if (params.status) qs.set("status", params.status);
    if (params.payer_id) qs.set("payer_id", params.payer_id);
    if (params.search) qs.set("search", params.search);
    const url = qs.toString() ? `${BASE}/cases?${qs}` : `${BASE}/cases`;
    const res = await authedFetch(url);
    return jsonOrThrow(res);
  },

  async getCase(caseId: string): Promise<{
    case_id: string;
    payer_id: string;
    patient_initials: string;
    status: string;
    physician_note: string | null;
    requested_treatment: { name: string; j_code: string | null };
    created_at: string | null;
  }> {
    const res = await authedFetch(`${BASE}/cases/${caseId}`);
    return jsonOrThrow(res);
  },

  async runFull(caseId: string): Promise<RunResult> {
    const res = await authedFetch(`${BASE}/cases/${caseId}/run`, { method: "POST" });
    return jsonOrThrow(res);
  },

  async submitReview(
    caseId: string,
    body: {
      action: "approve" | "override_to_approve" | "override_to_deny" | "escalate" | "add_note";
      note?: string;
    },
  ): Promise<{
    case_id: string;
    action: string;
    old_status: string;
    new_status: string;
  }> {
    const res = await authedFetch(`${BASE}/cases/${caseId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return jsonOrThrow(res);
  },

  /**
   * Resume a HITL-paused case with a reviewer's verdict. Backed by the
   * LangGraph review_gate node which routes the DAG here when Necessity
   * Reasoner overall_confidence drops below HITL_CONFIDENCE_THRESHOLD.
   * Per CMS-0057-F § IV.C and CA SB 1120, adverse determinations require
   * human clinician sign-off — this is the endpoint they sign off on.
   */
  async resumeCase(
    caseId: string,
    body: { verdict: "APPROVE" | "DENY" | "REFER"; reviewer_note?: string },
  ): Promise<{
    case_id: string;
    verdict: string;
    status: string;
    reviewer_id: string;
  }> {
    const res = await authedFetch(`${BASE}/cases/${caseId}/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return jsonOrThrow(res);
  },

  async getAudit(caseId: string): Promise<{ case_id: string; agent_runs: AgentRun[] }> {
    const res = await authedFetch(`${BASE}/cases/${caseId}/audit`);
    return jsonOrThrow(res);
  },

  // ---- Admin: user management ----
  async listOrgUsers(): Promise<{
    users: {
      id: string; email: string; full_name: string | null; role: string;
      created_at: string | null; last_login_at: string | null;
    }[];
  }> {
    const res = await authedFetch(`${BASE}/auth/users`);
    return jsonOrThrow(res);
  },

  async createOrgUser(req: {
    email: string; password: string; full_name: string;
    role: "coordinator" | "reviewer" | "admin";
  }): Promise<{ id: string; email: string; full_name: string; role: string }> {
    const res = await authedFetch(`${BASE}/auth/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    return jsonOrThrow(res);
  },

  // ---- Eval harness: cohort accuracy vs. gold labels ----
  async getCohortEval(): Promise<EvalReport> {
    const res = await authedFetch(`${BASE}/eval/cohort`);
    return jsonOrThrow(res);
  },

  // ===========================================================================
  // Cognizant Impact Pack — backend in app/{compliance,business_value,integrations}
  // Each block fronts one /api/v1/<area>/* surface; the UI components below
  // call these to render live business-value evidence (no mocks).
  // ===========================================================================

  // ---- CMS-0057-F + state-AI-law live scorecard ----
  async getCaseCompliance(caseId: string): Promise<CaseComplianceScorecard> {
    const res = await authedFetch(`${BASE}/compliance/case/${caseId}`);
    return jsonOrThrow(res);
  },
  async getOrgCompliance(): Promise<OrgComplianceScorecard> {
    const res = await authedFetch(`${BASE}/compliance/org`);
    return jsonOrThrow(res);
  },

  // ---- Business value calculator ----
  async getCaseValue(caseId: string): Promise<CaseROI> {
    const res = await authedFetch(`${BASE}/business-value/case/${caseId}`);
    return jsonOrThrow(res);
  },
  async getOrgValue(): Promise<OrgValueRollup> {
    const res = await authedFetch(`${BASE}/business-value/org`);
    return jsonOrThrow(res);
  },
  async getStarImpact(params: {
    member_count?: number;
    current_star?: number;
  } = {}): Promise<StarImpactProjection> {
    const qs = new URLSearchParams();
    if (params.member_count !== undefined) qs.set("member_count", String(params.member_count));
    if (params.current_star !== undefined) qs.set("current_star", String(params.current_star));
    const url = qs.toString() ? `${BASE}/business-value/star-impact?${qs}` : `${BASE}/business-value/star-impact`;
    const res = await authedFetch(url);
    return jsonOrThrow(res);
  },
  async getProviderAbrasion(params: { days?: number; rendering_npi?: string } = {}): Promise<ProviderAbrasionScore> {
    const qs = new URLSearchParams();
    if (params.days !== undefined) qs.set("days", String(params.days));
    if (params.rendering_npi) qs.set("rendering_npi", params.rendering_npi);
    const url = qs.toString() ? `${BASE}/business-value/provider-abrasion?${qs}` : `${BASE}/business-value/provider-abrasion`;
    const res = await authedFetch(url);
    return jsonOrThrow(res);
  },

  // ---- Cognizant TriZetto AI Gateway adapter ----
  async submitToTrizetto(req: {
    case_id: string;
    target?: "facets" | "qnxt" | "both";
    rendering_npi?: string;
  }): Promise<TrizettoSubmitResponse> {
    const res = await authedFetch(`${BASE}/integrations/trizetto/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "both", ...req }),
    });
    return jsonOrThrow(res);
  },
  async getTrizettoMockInbox(): Promise<TrizettoMockInbox> {
    const res = await authedFetch(`${BASE}/integrations/trizetto/_mock/inbox`);
    return jsonOrThrow(res);
  },
  async clearTrizettoMockInbox(): Promise<{ status: string }> {
    const res = await authedFetch(`${BASE}/integrations/trizetto/_mock/inbox`, { method: "DELETE" });
    return jsonOrThrow(res);
  },
  async getTrizettoInfo(): Promise<TrizettoInfo> {
    const res = await authedFetch(`${BASE}/integrations/trizetto/info`);
    return jsonOrThrow(res);
  },

  // ---- Kiro IDE spec exporter ----
  async exportKiroSpecs(): Promise<{ ok: boolean; summary: KiroExportSummary; next_step: string }> {
    const res = await authedFetch(`${BASE}/integrations/kiro/export`, { method: "POST" });
    return jsonOrThrow(res);
  },
  async getKiroSpec(parent: string, sub?: string): Promise<{ agent: string; files: Record<string, string> }> {
    const path = sub ? `${parent}/${sub}` : parent;
    const res = await authedFetch(`${BASE}/integrations/kiro/spec/${path}`);
    return jsonOrThrow(res);
  },

  // ---- Auditor-grade evidence pack (single-bundle export per case) ----
  async getEvidencePack(caseId: string): Promise<EvidencePack> {
    const res = await authedFetch(`${BASE}/cases/${caseId}/evidence-pack`);
    return jsonOrThrow(res);
  },

  // ---- Cognizant Neuro / Agent Foundry compatibility ----
  async getFoundryManifest(): Promise<FoundryManifest> {
    const res = await authedFetch(`${BASE}/foundry/manifest`);
    return jsonOrThrow(res);
  },

  // ---- Responsible AI model card ----
  async getModelCard(): Promise<ResponsibleAIModelCard> {
    const res = await authedFetch(`${BASE}/responsible-ai/model-card`);
    return jsonOrThrow(res);
  },

  // ---- 5-layer enterprise architecture descriptor (live introspection) ----
  async getArchitectureLayers(): Promise<ArchitectureDescriptor> {
    const res = await authedFetch(`${BASE}/architecture/layers`);
    return jsonOrThrow(res);
  },
};

// =============================================================================
// Impact Pack — TypeScript shape mirrors of the backend dataclasses
// =============================================================================

export interface ClauseResult {
  clause_id: string;
  title: string;
  satisfied: boolean;
  severity: "info" | "warning" | "critical";
  evidence: string;
  in_force_today: boolean;
}

export interface CaseComplianceScorecard {
  case_id: string;
  organization_id: string;
  asof_iso: string;
  overall_satisfied: boolean;
  in_force_satisfied: boolean;
  n_clauses_total: number;
  n_clauses_in_force: number;
  n_satisfied: number;
  n_satisfied_in_force: number;
  clauses: ClauseResult[];
}

export interface OrgComplianceScorecard {
  organization_id: string;
  asof_iso: string;
  totals: {
    cases_total: number;
    cases_decided: number;
    denies: number;
    denies_with_review: number;
    audit_complete_cases: number;
  };
  headline_metrics: {
    tat_compliance_pct: number;
    sb1120_compliance_pct: number;
    audit_completeness_pct: number;
    mean_tat_seconds: number;
    max_tat_seconds: number;
  };
  clauses: {
    clause_id: string;
    title: string;
    summary: string;
    effective_date: string;
    in_force_today: boolean;
    days_until_effective: number;
  }[];
  deadlines: Record<string, { iso: string; days_until: number; passed?: boolean }>;
}

export interface CaseROI {
  case_id: string;
  organization_id: string;
  verdict: string | null;
  manual_cost_usd: number;
  authrex_cost_usd: number;
  savings_usd: number;
  minutes_saved: number;
  decision_seconds: number | null;
  speedup_factor: number | null;
  annual_extrapolation_usd: number | null;
  citations: string[];
}

export interface OrgValueRollup {
  organization_id: string;
  asof_iso: string;
  cases_total: number;
  cases_decided: number;
  verdict_breakdown: Record<string, number>;
  direct_savings_mtd_usd: number;
  direct_savings_annual_projection_usd: number;
  avg_decision_seconds: number | null;
  avg_speedup_factor: number | null;
  citations: string[];
}

export interface StarImpactProjection {
  organization_id: string;
  member_count_assumed: number;
  current_star_assumption: number;
  projected_lift_low: number;
  projected_lift_high: number;
  revenue_lift_low_usd: number;
  revenue_lift_high_usd: number;
  notes: string[];
  citations: string[];
}

export interface ProviderAbrasionScore {
  rendering_npi: string | null;
  n_cases: number;
  n_denied: number;
  n_with_appeal: number;
  authrex_score: number;
  manual_baseline_score: number;
  abrasion_reduction_pct: number;
  minutes_returned_to_practice: number;
  estimated_turnover_risk_basis_points_reduction: number;
  citations: string[];
}

export interface TrizettoSubmitResponse {
  accepted: boolean;
  gateway_id: string | null;
  fanout_targets: string[];
  received_at: string;
  is_mock: boolean;
  facets_event: Record<string, unknown> | null;
  qnxt_event: Record<string, unknown> | null;
  case_id: string;
}

export interface TrizettoMockInboxItem {
  gateway_id: string;
  received_at: string;
  envelope: Record<string, unknown>;
  fanout_targets: string[];
}

export interface TrizettoMockInbox {
  is_mock: boolean;
  count: number;
  items: TrizettoMockInboxItem[];
  note: string;
}

export interface TrizettoInfo {
  platform: string;
  launched: string;
  stack: Record<string, string>;
  fanout_targets_supported: string[];
  configured_url: string | null;
  running_in: "mock" | "real";
  why_this_exists: string;
  mock_inbox_size: number;
  issuer: string;
  asof_utc: string;
}

export interface KiroExportSummary {
  n_parents: number;
  n_sub_agents: number;
  files_written: number;
  kiro_root: string;
}

export interface EvidencePack {
  case_id: string;
  generated_at_iso: string;
  bundle_sha256: string;
  case: Record<string, unknown>;
  decision: Record<string, unknown> | null;
  appeal: Record<string, unknown> | null;
  agent_runs: AgentRun[];
  reviewer_actions: Record<string, unknown>[];
  compliance: CaseComplianceScorecard;
  business_value: CaseROI;
  trizetto_envelope: Record<string, unknown> | null;
  model_card_ref: string;
  foundry_manifest_ref: string;
  authrex_version: string;
}

export interface FoundryManifest {
  artifact_kind: string;
  schema_version: string;
  authrex_version: string;
  cognizant_neuro_compatibility: {
    multi_agent_orchestration: boolean;
    agent_sdk: string;
    mcp_server_endpoint: string;
    mcp_protocol_version: string;
    claude_models_used?: string[];
    compatible_neuro_components?: string[];
  };
  agent_foundry_compatibility: {
    agents_total: number;
    sub_agents_total: number;
    agent_contract: string;
    deployment_targets: string[];
  };
  bedrock: {
    region: string;
    primary_model: string;
    fallback_model: string;
    provisioned_throughput_terraform: string;
    guardrails_id: string | null;
  };
  trizetto_integration: {
    facets_event_schema: string;
    qnxt_event_schema: string;
    gateway_url_env_var: string;
    submit_endpoint?: string;
    mock_inbox_endpoint?: string;
    tamper_evident_hash?: string;
  };
  observability: {
    metrics_endpoint: string;
    sse_endpoint: string;
    audit_endpoint: string;
  };
  governance: {
    cms_0057f_clauses_tracked: number;
    state_ai_laws_tracked: string[];
    model_card_endpoint: string;
    evidence_pack_endpoint: string;
  };
}

export interface ArchitectureLayerComponent {
  name: string;
  path: string;
}

export interface ArchitectureLayer {
  id: string;
  name: string;
  purpose: string;
  components: ArchitectureLayerComponent[];
  endpoints?: string[];
  business_outcome: string;
  agents?: {
    parents: number;
    sub_agents: number;
    llm_backed_sub_agents: number;
    deterministic_sub_agents: number;
    reflection_enabled_sub_agents: number;
  };
  active_backend?: string;
  configured_backends?: Record<string, unknown>;
  active_provider?: string;
  models?: { primary: string; fallback: string; region: string };
  guardrail?: { guardrail_id: string | null; version: string };
  compliance?: {
    cms_0057f_clauses_tracked: number;
    state_ai_laws_tracked: string[];
    in_force_today: number;
  };
}

export interface ArchitecturePrimaryKPI {
  id: string;
  name: string;
  baseline: string;
  target_range: string;
  measurement_endpoint: string;
}

export interface ArchitectureDescriptor {
  asof_iso: string;
  authrex_version: string;
  doc_path: string;
  business_use_case_doc: string;
  primary_kpis: ArchitecturePrimaryKPI[];
  layers: ArchitectureLayer[];
  aws_foundation: {
    id: string;
    name: string;
    purpose: string;
    services: string[];
    region_primary: string;
    terraform_modules: string[];
  };
  cognizant_alignment: {
    ai_velocity_gap_addressed: boolean;
    vector_strategy_classification: string[];
    agent_foundry_stage: string;
    neuro_san_compatible: boolean;
    trizetto_ai_gateway_native: boolean;
    anthropic_partnership_alignment: string;
  };
}

export interface ResponsibleAIModelCard {
  artifact: string;
  schema: string;
  authrex_version: string;
  intended_use: {
    primary: string;
    out_of_scope: string[];
  };
  models: {
    name: string;
    role: string;
    bedrock_model_id: string;
    provider: string;
    last_validated_iso: string;
  }[];
  data: {
    training_data: string;
    inference_data: string;
    phi_handling: string;
    retention_days: number;
  };
  performance: {
    f1_macro: number | null;
    accuracy_pct: number | null;
    last_eval_iso: string | null;
  };
  fairness: {
    monitored_dimensions: string[];
    bias_evaluation_method: string;
    last_bias_audit_iso: string | null;
  };
  human_oversight: {
    hitl_policy: string;
    sb1120_compliance: boolean;
    review_gate_threshold: number;
  };
  risk_register: {
    id: string;
    risk: string;
    mitigation: string;
  }[];
  standards: {
    nist_ai_rmf: string;
    iso_42001: string;
    eu_ai_act: string;
    cms_0057f: string;
  };
  contacts: {
    accountable_owner: string;
    safety_contact: string;
  };
}

export interface EvalReport {
  method: string;
  labeled_at: string | null;
  n_cohort_total: number;
  n_evaluated: number;
  overall_accuracy_pct: number;
  macro_f1: number;
  weighted_f1: number;
  per_class: Record<
    "APPROVE" | "DENY" | "REFER",
    { precision: number; recall: number; f1: number; tp: number; fp: number; fn: number }
  >;
  confusion_matrix: Record<"APPROVE" | "DENY" | "REFER", Record<"APPROVE" | "DENY" | "REFER", number>>;
  disagreement_taxonomy: {
    conservative_authrex_more_decisive: number;
    conservative_authrex_more_cautious: number;
    aggressive_opposite_verdict: number;
    other: number;
  };
  per_payer: Record<string, { n: number; agree: number; accuracy_pct: number }>;
  per_treatment_top5: Record<string, { n: number; agree: number; accuracy_pct: number }>;
}
