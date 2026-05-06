# Changelog

All notable changes to Authrex are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-05-03 (Technoverse 2026 Finals build)

### Round 8 — demo-readiness & rubric coverage

#### Added
- `ops/demo/AUTHREX_MVP_DECK.pptx` — 13-slide MVP deck built from official Cognizant template
- `ops/demo/PITCH_SCRIPT.md` — verbatim 5-minute pitch script with word counts
- `ops/demo/SPEAKER_NOTES.md` — per-slide speaker notes
- `ops/demo/ANTICIPATED_QUESTIONS.md` — 20 Q&A beyond the existing QA_DRILL
- `ops/demo/LEAVE_BEHIND.md` — 1-page printable handout for judges
- `ops/demo/COGNIZANT_NEWS_TALKING_POINTS.md` — 3 stage-ready opening lines
- `ops/demo/PITCH_ONE_LINER.md` — 10-second elevator pitch card
- `ops/adr/0001-0008` — 8 canonical Architecture Decision Records (Nygard format)
- `ops/sre/LOAD_TEST_RESULTS.md` — 5-tier scalability evidence (Tier 1 measured, Tiers 2-5 procedure-defined)
- `ops/demo/EDGE_CASES.md` — 28 named edge cases across 6 categories
- `ops/demo/DEMO_DAY_CHECKLIST.md` — T-24h preflight + T-0 minute-by-minute + Q&A + fallbacks
- `ops/demo/MVP_COMPLETENESS.md` — every rubric phrase mapped to specific app evidence
- `ops/demo/SMOKE_TEST_RESULTS.md` — last live smoke test result
- `backend/scripts/smoke_test.py` — 5-layer self-check
- `backend/scripts/build_deck.py` — programmatic deck builder
- Backend `/api/v1/version` — git SHA + uptime + build metadata
- Backend `/api/v1/capabilities` — feature-flag snapshot for judges
- Backend `/api/v1/healthz/deep` — per-layer self-check (5 layers + integrations)
- Request-ID middleware — propagates `X-Request-Id` through every request + structlog context
- Top-level `README.md` rewritten as judge-first-impression
- `LICENSE` (MIT)
- `CONTRIBUTING.md`
- `SECURITY.md` + `frontend/public/.well-known/security.txt`
- `ROADMAP.md`
- `ARCHITECTURE.md` (top-level pointer)
- `docs/INDEX.md` (every doc with one-line purpose)
- `docs/ARCHITECTURE_DIAGRAM.md` (ASCII + Mermaid diagrams)
- `.editorconfig`
- Makefile targets: `smoke`, `deck`, `preflight`, `frontend.typecheck`, `kiro.export`, `tf.fmt`, `tf.validate`

### Round 7 — rubric coverage
- Smoke test PASSED across all 5 layers (56 routes, 7 parents, 22 sub-agents)

### Round 6 — 2026-trend alignment
- `ops/architecture/AI_ADAPTATION_GAP.md` — conceptual peer of velocity gap
- `ops/architecture/AGENTIC_ACTIONS.md` — user goal → 7-agent network → 5 typed actions → outcome
- `ops/terraform/s3-vectors/` — 6-file Terraform module for S3 Vectors substrate
- `ops/demo/CASE_STUDY_VIGNETTE.md` — Maria Chen 2026-format Cognizant case study
- Updated `/architecture/layers` with adaptation gap + Flowsource shape + agentic capital framing
- Cognizant Flowsource alignment block in `ops/kiro/HOOKS.md`

### Round 5 — governed GenAI Gateway
- `app/llm/gateway.py` — literal in-process GenAI Gateway (per-tenant model allowlist, 24h quota, content-safety, audit)
- `app/api/llm_gateway.py` — `/llm-gateway/usage` + `/policy` endpoints
- `app/llm/factory.py` — wraps underlying LLMClient with Gateway
- `ops/terraform/bedrock-vpc-endpoint/` — 7-file PrivateLink + IAM with per-model-id condition
- `ops/architecture/Q_vs_BEDROCK.md` — division-of-roles doc with decision matrix
- `ops/kiro/HOOKS.md` + `.kiro/hooks/` — 3 working hook scripts for SDLC discipline

### Round 4 — 5-layer formal architecture
- `ops/architecture/TARGET_ARCHITECTURE.md` — 5-named-layer canonical doc
- `ops/architecture/BUSINESS_USE_CASE.md` — 4 KPIs with target ranges + per-component impact map
- `app/api/architecture.py` + `frontend/src/routes/Architecture.tsx` — live introspectable

### Round 3 — AI velocity gap industrialization
- `ops/industrialization/AI_VELOCITY_GAP_BUSINESS_CASE.md`
- `ops/industrialization/CHECKLIST.md` — Discover · Design · Build · Scale gates
- `.github/workflows/ci.yml` + `deploy-prod.yml`
- `ops/sre/SLO.yaml` (7 SLOs) + `ops/sre/RUNBOOK.md` (7 named incidents)
- `ops/multi-tenant/ONBOARDING.md`

### Round 2 — Industrialize Pack
- Live frontend wiring of all Impact Pack endpoints
- `app/api/evidence_pack.py` — auditor-grade SHA-256 bundle
- `ops/cognizant-neuro/authrex-network.hocon` — AAOSA agent network
- `ops/agent-foundry/agent-foundry-manifest.yaml` — Cognizant Agent Foundry bundle descriptor
- `ops/aws/agentcore/deployment.yaml` — Bedrock AgentCore deployment manifest
- `app/api/responsible_ai.py` — model card with NIST AI RMF + ISO 42001 + EU AI Act
- `frontend/src/routes/{ROI,Industrialize}.tsx` — interactive pages

### Round 1 — Cognizant Impact Pack
- `app/integrations/trizetto/` — Facets v3 + QNXT v2 adapters with SHA-256 tamper hash
- `app/compliance/cms_0057f.py` — live compliance scorecard
- `app/business_value/` — per-case ROI · org rollup · Star projection · provider abrasion
- `app/integrations/kiro/exporter.py` — auto-generates `.kiro/specs/` (85 files)
- `app/integrations/amazon_q/client.py` — Q Business retrieval client
- `ops/demo/COGNIZANT_GO_TO_MARKET.md` — Day 0 → Day 90 commercialization plan

### Foundation (rounds 0 / pre-hackathon)
- 7-agent LangGraph DAG with conditional edges (HITL gate, DENY-path)
- 22 sub-agents auto-discovered via `pkgutil`
- `Agent[I, O]` framework with full production lifecycle
- `BudgetTracker` reservation pattern
- 4 Guardrails (Schema, PHI, Citation, Token-budget)
- `ModelRouter` (Haiku → Sonnet escalation)
- `TraceSink` ABC (Postgres + InMemory)
- `case_jobs` queue (Postgres SKIP LOCKED)
- Per-org quotas, deterministic response cache
- React 18 + TypeScript strict frontend with 17 routes
- MCP server with 5 tools
- Da Vinci PAS endpoint
- Multi-region + provisioned-throughput Terraform stubs

---

## [Unreleased] — post-pilot roadmap

See [`ROADMAP.md`](ROADMAP.md) for what comes next.
