# Authrex — Project Conventions for Claude Code

## Read first
- `PROPOSAL.md` is the single source of truth for design. Do not contradict it.
- `aws_authrex_playbook.md` (in user memory) is the AWS reference for May 6 migration.
- This is a hackathon project but the code must look production-grade.
  Cognizant judges are enterprise architects.

## Coding conventions

### Python (backend)
- Python 3.11+, type hints everywhere, Pydantic v2 for every contract.
- `ruff` for formatting and linting; `mypy --strict` on `app/models/` and `app/graph/`.
- Async by default. Never block the event loop.
- No global state. Inject the DB pool and the LLM client.
- Prompts live in `backend/app/prompts/` as `.txt` files. Never inline a multi-line prompt in code.

### TypeScript (frontend)
- Strict mode. No `any`. Generated types from OpenAPI.
- Tailwind for styling. No inline styles.

## Agent conventions
- Every agent has: a Pydantic input model, a Pydantic output model, a system prompt file in `app/prompts/`, a `*_node` function for LangGraph, and a contract test.
- Every agent call is wrapped in `trace_agent(case_id, agent_name, input)`.
- Every agent emits SSE trace events via `streaming.publish`.
- Agents NEVER fabricate clinical facts. If the data isn't there, say so.

## Testing
- Run `make test` before any commit.
- New agents require a contract test on at least one fixture in `tests/fixtures/`.

## Things never to do
- Never hard-code secrets.
- Never call the LLM without `trace_agent`.
- Never return free-form prose from an agent — always structured JSON.
- Never log PHI even in synthetic mode (use patient initials only).
- Never delete from the `cases` table — use `status` instead.

## LLM provider abstraction
- All LLM calls go through `app/llm/client.py`'s `LLMClient` interface.
- Two implementations: `AnthropicClient` (current) and `BedrockClient` (May 6).
- Switch via env var `LLM_PROVIDER=anthropic|bedrock`.
- Never import `anthropic` or `boto3` from agent code; always import from `app.llm`.

## Demo discipline
- The demo cohort lives in `backend/app/synthea/seeds/`. Do not add new cases without updating PROPOSAL.md §21.
- The demo script in PROPOSAL.md §26 is the authoritative path.

## Before any commit
- `make test` passes
- `make lint` passes (ruff + mypy)
- No new `.env` file is staged
