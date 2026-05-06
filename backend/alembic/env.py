"""Authrex — Alembic environment.

Reads `DATABASE_URL` from the env (same source-of-truth as `app/config.py`)
and runs migrations in offline (SQL output) or online (DB-connected) modes.

Online mode is the production deploy story — the K8s pre-deploy Job runs:

    DATABASE_URL=postgresql://... alembic upgrade head

and the deploy only proceeds when this Job exits 0.
"""
from __future__ import annotations

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool

# Make the app importable so future migrations can use SQLAlchemy MetaData
# from app.db.models if we add ORM-defined models later.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


def _resolve_db_url() -> str:
    """Translate Authrex DATABASE_URL → SQLAlchemy DSN.

    Authrex runtime uses asyncpg (`postgresql+asyncpg://...` is also fine).
    Alembic env runs synchronously, so we strip the `+asyncpg` suffix if
    present and use psycopg2 / pg8000.
    """
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError(
            "DATABASE_URL must be set to run alembic. Example: "
            "postgresql://authrex:authrex@localhost:5432/authrex"
        )
    return url.replace("+asyncpg", "")


def run_migrations_offline() -> None:
    """Generate the SQL for a migration without connecting. Used to ship
    a SQL file for the DBA team to review before applying."""
    url = _resolve_db_url()
    context.configure(
        url=url,
        target_metadata=None,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Connect to the DB and apply migrations. Production path."""
    url = _resolve_db_url()
    cfg_section = config.get_section(config.config_ini_section, {}) or {}
    cfg_section["sqlalchemy.url"] = url

    connectable = engine_from_config(
        cfg_section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=None)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
