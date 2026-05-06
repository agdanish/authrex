"""baseline v0.1.0 — schema-stamp, no-op upgrade

Revision ID: 0001_baseline_v010
Revises:
Create Date: 2026-05-03 17:30:00.000000

The schema in `db/schema.sql` was already applied by the Postgres container's
docker-entrypoint-initdb.d/ during `make dev.up`, and by the inline
`ensure_schema()` calls in `app/main.py` lifespan for any rounds-9 columns
added since.

This baseline stamps Alembic's `alembic_version` table at v0.1.0 so that
the next authored migration (e.g. `0002_add_cell_id_to_cases.py`) can
reference this revision as its `down_revision` and apply real diffs.
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa  # noqa: F401  (available for future migrations)


revision: str = "0001_baseline_v010"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """No-op. The schema is already on disk; this just stamps the version table."""
    # Belt-and-suspenders: confirm the canonical tables exist. If they don't,
    # the operator forgot to apply `db/schema.sql` and we want to fail loudly
    # before any future migration mutates them.
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cases') THEN
                RAISE EXCEPTION 'Authrex baseline: db/schema.sql has not been applied. '
                                'Apply it before running alembic upgrade head.';
            END IF;
        END$$;
        """
    )


def downgrade() -> None:
    """No-op — you cannot downgrade past the baseline."""
