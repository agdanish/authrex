"""row-level security on multi-tenant tables

Revision ID: 0002_rls
Revises: 0001_baseline_v010
Create Date: 2026-05-03 18:30:00.000000

Defense in depth: today the application enforces tenant isolation by
filtering every query with `WHERE organization_id = $1`. That's correct
when the app is correct. It is **broken** when:

  • A SQL injection bypass slips past argument binding
  • A junior dev forgets the WHERE clause on a new query
  • An ad-hoc `psql` session by an SRE leaks across tenants

Postgres Row Level Security is the second wall: even an authenticated
DB user cannot SELECT a row that doesn't match their tenant. The app
sets `SET LOCAL authrex.organization_id = '<org>'` once per request;
RLS policies use this for ALL filtering.

Domain tables locked down here:
  cases · case_jobs · case_runs · agent_runs · decisions ·
  appeals · evidence_packs · llm_invocations · org_quotas ·
  reviewer_actions · event_outbox

Bypass:
  Only the `authrex_migrator` role bypasses RLS — used by Alembic +
  the janitor process (which sweeps stale heartbeats across all tenants).
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op


revision: str = "0002_rls"
down_revision: Union[str, None] = "0001_baseline_v010"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Tables with an `organization_id` column — get the standard tenant policy
_TENANT_TABLES = (
    "cases",
    "case_jobs",
    "case_runs",
    "agent_runs",
    "decisions",
    "appeals",
    "evidence_packs",
    "llm_invocations",
    "org_quotas",
    "reviewer_actions",
    "event_outbox",
)


def upgrade() -> None:
    # 1. Roles
    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authrex_app') THEN
                CREATE ROLE authrex_app NOLOGIN;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authrex_migrator') THEN
                CREATE ROLE authrex_migrator NOLOGIN BYPASSRLS;
            END IF;
        END$$;
    """)

    # 2. Per-table policies
    for table in _TENANT_TABLES:
        op.execute(f"ALTER TABLE IF EXISTS {table} ENABLE ROW LEVEL SECURITY;")
        op.execute(f"""
            DROP POLICY IF EXISTS authrex_tenant_isolation ON {table};
            CREATE POLICY authrex_tenant_isolation ON {table}
                FOR ALL TO authrex_app
                USING (organization_id = current_setting('authrex.organization_id', TRUE))
                WITH CHECK (organization_id = current_setting('authrex.organization_id', TRUE));
        """)

    # 3. Sanity
    op.execute("""
        DO $$
        DECLARE
            policy_count INTEGER;
        BEGIN
            SELECT COUNT(*) INTO policy_count
              FROM pg_policies
             WHERE policyname = 'authrex_tenant_isolation';
            IF policy_count < 1 THEN
                RAISE EXCEPTION 'RLS migration: no authrex_tenant_isolation policies created.';
            END IF;
        END$$;
    """)


def downgrade() -> None:
    for table in _TENANT_TABLES:
        op.execute(f"DROP POLICY IF EXISTS authrex_tenant_isolation ON {table};")
        op.execute(f"ALTER TABLE IF EXISTS {table} DISABLE ROW LEVEL SECURITY;")
    op.execute("DROP ROLE IF EXISTS authrex_app;")
    op.execute("DROP ROLE IF EXISTS authrex_migrator;")
