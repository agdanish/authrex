# Authrex — Alembic schema migration framework

**Status: apply-ready.** Replaces the inline `ensure_schema()` calls in
`app/main.py` with a versioned, reviewable, blue-green-safe migration story.

## Why we needed this

Round-9 schema bootstrap pattern was: every module called its own
`async def ensure_schema()` from the FastAPI lifespan. Fast for hackathon,
broken for production:

- No rollback. If a column add corrupted the schema, no `alembic downgrade`.
- No reviewable diff. PRs touching schema shipped no `.sql` file in the diff.
- No blue-green. New pods would race-create columns mid-deploy.
- No DBA review path. DBAs at Tier-1 payers want to read the SQL before apply.

## How we wired it

The runtime `ensure_schema()` calls are still the **dev fallback** — they
make `make dev.up` work without a separate `alembic upgrade head` step.
But in production:

1. CI generates a fresh migration: `alembic revision -m "add cases.cell_id"`
2. Reviewer reads the generated SQL in the PR diff
3. CD runs a Kubernetes pre-deploy Job:
   ```yaml
   apiVersion: batch/v1
   kind: Job
   metadata: { name: authrex-migrate }
   spec:
     template:
       spec:
         containers:
         - name: alembic
           image: authrex-backend:{tag}
           command: ["alembic", "upgrade", "head"]
           env:
           - { name: DATABASE_URL, valueFrom: {secretKeyRef: ...} }
   ```
4. The pod rollout doesn't proceed until the Job exits 0.

## Layout

```
backend/
├── alembic.ini              # Configuration (script_location = alembic)
└── alembic/
    ├── env.py               # Reads DATABASE_URL, runs migrations
    ├── script.py.mako       # Migration template
    ├── README.md            # This file
    └── versions/
        └── 0001_baseline_v0_1_0.py   # Baseline marker
```

## Authoring a new migration

```bash
cd backend
DATABASE_URL=postgresql://authrex:authrex@localhost:5432/authrex \
  alembic revision -m "add cell_id to cases"
```

Edit the generated file in `alembic/versions/`:

```python
def upgrade() -> None:
    op.add_column("cases", sa.Column("cell_id", sa.Text(), nullable=True))
    op.create_index("idx_cases_cell_id", "cases", ["cell_id"])

def downgrade() -> None:
    op.drop_index("idx_cases_cell_id", "cases")
    op.drop_column("cases", "cell_id")
```

Then apply:

```bash
alembic upgrade head      # forward
alembic downgrade -1      # back one step
alembic history --verbose # see chain
```

## Baseline migration

`0001_baseline_v0_1_0.py` is a **no-op revision** that stamps the
`alembic_version` table — it does NOT recreate the existing schema.
The existing schema lives in `db/schema.sql` and is already applied by
the Postgres container's docker-entrypoint-initdb.d/.

This means: a fresh DB gets the schema from `schema.sql`, then
`alembic stamp head` marks it at the baseline; future migrations
go through Alembic.

## When the schema source-of-truth flips

Today: `db/schema.sql` is the source-of-truth. Alembic catches up.
Future (post-pilot): `app/db/models.py` becomes SQLAlchemy ORM models;
`alembic --autogenerate` generates migrations from model diffs;
`schema.sql` becomes a generated artifact (not hand-edited).

## Production deploy contract

`make migrate` ⇒ runs `alembic upgrade head` against `$DATABASE_URL`.
Exit code 0 ⇒ deploy may proceed. Non-zero ⇒ rollout aborted.

## Sources

- Alembic docs — https://alembic.sqlalchemy.org/
- Production migration patterns — https://www.aceon.dev/2024/03/14/database-migrations-in-the-real-world/
