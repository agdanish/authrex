# Authrex

> **Provider-side oncology prior-authorization copilot — TriZetto AI Gateway-native specialty agent bundle on AWS Bedrock + Claude Sonnet 4.6 + MCP.**
>
> *Cognizant Technoverse Hackathon 2026 — Team AeroFyta — Healthcare / Prior Authorization Automation theme.*

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](.github/workflows/ci.yml) [![Architecture](https://img.shields.io/badge/architecture-5%20layers-blue)](ops/architecture/TARGET_ARCHITECTURE.md) [![ADRs](https://img.shields.io/badge/ADRs-8-purple)](ops/adr/) [![Compliance](https://img.shields.io/badge/CMS--0057--F-live%20scorecard-orange)](ops/architecture/AI_ADAPTATION_GAP.md) [![GenAI Gateway](https://img.shields.io/badge/GenAI%20Gateway-enforced-red)](ops/adr/0005-genai-gateway-as-in-process-wrapper.md)

---

## What this is, in one paragraph

Authrex closes Cognizant's **AI velocity gap** for one of the most expensive operational workflows in US healthcare: oncology prior authorization. A coordinator submits a FHIR R4 bundle; **90 seconds later** a decision (APPROVE / DENY / REFER) is rendered by a 7-agent LangGraph DAG on Bedrock + Claude Sonnet 4.6, dispatched as a tamper-evident envelope to the Cognizant TriZetto AI Gateway (Aug 6, 2025 launch), and packaged into an auditor-grade Evidence Pack with a SHA-256 hash. **$1,499.55 displaced per case. $1.26B per half-star at Humana scale.** Drop into TriZetto Monday. Audit-grade by Day 21. Star lift by Day 90.

---

## For Cognizant judges — start here

| What you want to verify | Where to look |
|---|---|
| Does the demo actually work end-to-end? | [`ops/demo/SMOKE_TEST_RESULTS.md`](ops/demo/SMOKE_TEST_RESULTS.md) — last live smoke test result |
| What's the architecture? | [`ops/architecture/TARGET_ARCHITECTURE.md`](ops/architecture/TARGET_ARCHITECTURE.md) · live at `GET /api/v1/architecture/layers` |
| What design choices were made and why? | [`ops/adr/`](ops/adr/) — 8 canonical Architecture Decision Records (Nygard format) |
| What edge cases are handled? | [`ops/demo/EDGE_CASES.md`](ops/demo/EDGE_CASES.md) — 28 named edge cases with file pointers |
| How does it scale? | [`ops/SCALING.md`](ops/SCALING.md) + [`ops/sre/LOAD_TEST_RESULTS.md`](ops/sre/LOAD_TEST_RESULTS.md) |
| What's the business value? | [`ops/architecture/BUSINESS_USE_CASE.md`](ops/architecture/BUSINESS_USE_CASE.md) — 4 KPIs with realistic ranges |
| Why Cognizant should care | [`ops/industrialization/AI_VELOCITY_GAP_BUSINESS_CASE.md`](ops/industrialization/AI_VELOCITY_GAP_BUSINESS_CASE.md) |
| How does this hit the rubric? | [`ops/demo/MVP_COMPLETENESS.md`](ops/demo/MVP_COMPLETENESS.md) — every rubric phrase → evidence |
| What's the demo path? | [`ops/demo/DEMO_DAY_CHECKLIST.md`](ops/demo/DEMO_DAY_CHECKLIST.md) + [`ops/demo/PITCH_SCRIPT.md`](ops/demo/PITCH_SCRIPT.md) |
| Index of every doc in this repo | [`docs/INDEX.md`](docs/INDEX.md) |

---

## 30-second tour

```bash
# 1. Boot the stack
docker compose up -d postgres redis              # postgres + redis (SSE pub/sub)
make backend.install
make db.init
make backend.dev                                 # uvicorn :8000

# In another terminal
make frontend.install
make frontend.dev                                # vite :5173

# 2. Smoke-test every layer
make smoke                                       # 5-layer self-check

# 3. Hit the live introspection endpoints
curl localhost:8000/api/v1/architecture/layers   # 5-layer descriptor
curl localhost:8000/api/v1/foundry/manifest      # Cognizant Neuro/Foundry compatibility
curl localhost:8000/api/v1/responsible-ai/model-card  # NIST + ISO 42001 + EU AI Act
curl localhost:8000/api/v1/healthz/deep          # per-layer health
curl localhost:8000/api/v1/version               # build SHA + uptime
curl localhost:8000/api/v1/capabilities          # feature flags

# 4. Browse the live demo
open http://localhost:5173/dashboard
open http://localhost:5173/architecture          # live 5-layer panel
open http://localhost:5173/roi                   # interactive Star Ratings calculator
open http://localhost:5173/compliance            # live CMS-0057-F scorecard
open http://localhost:5173/industrialize         # Cognizant Foundry compatibility
```

---

## The 5-layer architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│  1.  EXPERIENCE LAYER       — React 18 SPA · 17 routes · SSE trace       │
├──────────────────────────────────────────────────────────────────────────┤
│  2.  ORCHESTRATION & POLICY ENGINE                                       │
│      FastAPI · LangGraph 7-agent DAG · BudgetTracker · review_gate HITL  │
├──────────────────────────────────────────────────────────────────────────┤
│  3.  CONTEXT RETRIEVAL SERVICE  ("agentic capital")                      │
│      Bedrock KB / Amazon Q Business / S3 Vectors  (one Pydantic schema)  │
├──────────────────────────────────────────────────────────────────────────┤
│  4.  GENAI GATEWAY                                                       │
│      Per-tenant model allowlist · 24h quota · audit log · Bedrock VPCe   │
├──────────────────────────────────────────────────────────────────────────┤
│  5.  TELEMETRY & GOVERNANCE                                              │
│      Prometheus /metrics · 7 SLOs · Evidence Pack SHA-256 · Model Card   │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
                       AWS Foundation
                       (Bedrock + Claude Sonnet 4.6 + Haiku 4.5 +
                        AgentCore Runtime + Aurora Global + KMS multi-region)
```

Live at `GET /api/v1/architecture/layers`. Full doc: [`ops/architecture/TARGET_ARCHITECTURE.md`](ops/architecture/TARGET_ARCHITECTURE.md).

---

## Key numbers

| KPI | Authrex | Industry baseline | Source |
|---|--:|--:|---|
| Cycle-time per case | **52 s p50 / 90 s p95** | 18 min (manual) / 7 days (CMS SLA) | AMA 2025 / CMS-0057-F § IV.B.1 |
| Cost per case | **$0.25–$0.45** | $1,500 (loaded) | AMA Council on Medical Service 2024 |
| Productivity uplift on the workflow | **95–98%** | 20–40% (industry copilot benchmark) | 2026 enterprise GenAI benchmarks |
| Star Ratings revenue lift @ Humana scale | **$1.26B / half-star** | ($2.1M / 10K members / 0.5 stars) | Lilac Software 2025 |
| Customer onboarding | **7–15 business days** | 60–90 days (typical agent integration) | [`ops/multi-tenant/ONBOARDING.md`](ops/multi-tenant/ONBOARDING.md) |

---

## Stack

- **Backend:** Python 3.11 · FastAPI · Pydantic v2 · asyncpg · LangGraph 0.2 · structlog
- **LLM:** AWS Bedrock — Claude Sonnet 4.6 (primary) + Claude Haiku 4.5 (fallback / graders), per-tenant Bedrock Guardrails
- **Retrieval:** Bedrock Knowledge Base ↔ Amazon Q Business ↔ S3 Vectors (pluggable behind one schema)
- **Agent runtime:** Anthropic Agent SDK semantics; **AWS Bedrock AgentCore Runtime** (apply-ready in `ops/aws/agentcore/`)
- **DB:** PostgreSQL 16 + pgvector (RDS Aurora Global in production)
- **Frontend:** React 18 + Vite + TypeScript strict + Tailwind
- **Container:** Docker Compose (local), EKS + ECR (production)
- **Streaming:** SSE for live agent traces — Redis pub/sub backend for multi-replica fan-out
- **MCP:** JSON-RPC 2.0 server at `/mcp` (5 tools)
- **CI/CD:** GitHub Actions — lint · pytest · tsc · pip-audit · bandit · Semgrep · CycloneDX SBOM · multi-arch ECR push · Terraform plan · canary deploy

---

## Cognizant alignment

Authrex is engineered against Cognizant's published 2026 AI strategy:

- **AI Velocity Gap** (Ravi Kumar, Dec 2025) — closed by deploying agents on the same Bedrock + Claude + MCP stack Cognizant standardized on (Anthropic partnership Nov 4, 2025; 350K Cognizant employees on Claude).
- **AI Adaptation Gap** — closed by embedding into the existing TriZetto Facets / QNXT workflow rather than launching a parallel platform.
- **Cognizant Agent Foundry** (Jul 10, 2025) — Authrex maps 1:1 to Discover → Design → Build → Scale stages. See [`ops/industrialization/CHECKLIST.md`](ops/industrialization/CHECKLIST.md).
- **Cognizant Neuro AI** — neuro-san compatible AAOSA agent network in [`ops/cognizant-neuro/authrex-network.hocon`](ops/cognizant-neuro/authrex-network.hocon).
- **TriZetto AI Gateway** (Aug 6, 2025) — adapter shipped at `app/integrations/trizetto/`. Facets `prior_auth_event v3` + QNXT `case_event v2`. SHA-256 tamper-evident decision hash.

---

## Repo layout

```
Authrex/
├── README.md                  ← you are here
├── PROPOSAL.md                ← original strategy + 23-day plan (locked, do not edit)
├── ARCHITECTURE.md            ← top-level architecture pointer
├── CHANGELOG.md               ← what shipped, when
├── CONTRIBUTING.md            ← how to extend Authrex
├── SECURITY.md                ← responsible-disclosure surface
├── ROADMAP.md                 ← post-pilot direction
├── LICENSE                    ← MIT
├── Makefile                   ← all dev tasks: `make help`
├── docker-compose.yml         ← postgres + redis + backend
│
├── backend/                   ← FastAPI app + LangGraph agents + scripts
│   ├── app/                   ← see app/agents/manifest.py for the auto-discovered agent inventory
│   ├── db/schema.sql          ← PostgreSQL schema
│   └── scripts/               ← smoke_test.py · build_deck.py
│
├── frontend/                  ← React 18 + Vite + TypeScript
│   └── src/                   ← 17 routes
│
├── docs/                      ← INDEX.md (every doc with one-line purpose) + diagrams
│
├── ops/                       ← everything operational
│   ├── adr/                   ← 8 Architecture Decision Records
│   ├── architecture/          ← target architecture + business case docs
│   ├── industrialization/     ← Cognizant Foundry alignment + AI velocity gap
│   ├── multi-tenant/          ← per-tenant onboarding playbook
│   ├── sre/                   ← SLOs · runbook · load test results
│   ├── demo/                  ← deck · pitch script · checklist · vignette
│   ├── k8s/                   ← production manifests
│   ├── terraform/             ← 4 apply-ready modules
│   ├── cognizant-neuro/       ← AAOSA agent network HOCON
│   ├── agent-foundry/         ← Foundry manifest YAML
│   ├── aws/agentcore/         ← AgentCore deployment YAML
│   └── kiro/                  ← Kiro IDE Hooks documentation
│
├── .kiro/                     ← Kiro IDE specs (auto-generated; 85 files)
│
└── .github/workflows/         ← CI + production deploy pipelines
```

---

## Demo path (5-minute pitch)

Read [`ops/demo/PITCH_SCRIPT.md`](ops/demo/PITCH_SCRIPT.md) verbatim. Walked through in [`ops/demo/DEMO_DAY_CHECKLIST.md`](ops/demo/DEMO_DAY_CHECKLIST.md). Visual deck: [`ops/demo/AUTHREX_MVP_DECK.pptx`](ops/demo/AUTHREX_MVP_DECK.pptx).

---

## Status

| | |
|---|---|
| Hackathon stage | **Technoverse 2026 finals — May 7, 2026, Pune** |
| Last live smoke test | See [`ops/demo/SMOKE_TEST_RESULTS.md`](ops/demo/SMOKE_TEST_RESULTS.md) |
| Backend routes | **59** unique paths |
| Agents | **7 parents + 22 sub-agents** auto-discovered from `app/agents/*` |
| Architecture docs | **18** (target architecture, ADRs, business case, gap docs, AWS pattern docs) |
| Terraform modules | **4** apply-ready (multi-region · provisioned-throughput · bedrock-vpc-endpoint · s3-vectors) |
| SLOs | **7** with PagerDuty burn-rate alerts |
| Edge cases formally cataloged | **28** |
| Test coverage | Smoke test passes across all 5 layers |

---

## License

MIT — see [LICENSE](LICENSE).

---

*Built by Team AeroFyta — Cognizant Technoverse Hackathon 2026 finalists.*
