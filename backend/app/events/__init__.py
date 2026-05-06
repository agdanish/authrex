"""Domain events + Outbox pattern.

Industry-grade event-driven layer that turns Authrex from a request/response
service into a system that downstream consumers (analytics, audit lake, claims
engines, BI tools, customer's MDM) can subscribe to without coupling.

Why this matters:
  • Today: a Decision row writes to Postgres. Downstream consumers can't see it
    unless they CDC/poll the table or we hand-craft webhooks.
  • Industry-grade: a `CaseDecided` event is emitted to an outbox table inside
    the SAME transaction as the Decision row write. A separate publisher worker
    drains the outbox to AWS EventBridge / Kafka / Kinesis. Consumers subscribe.

Properties:
  • Transactional outbox — event publish is atomic with the domain write
  • Exactly-once semantics — outbox row + idempotent consumer
  • Schema-versioned — every event has `event_version`
  • Replay-friendly — outbox is append-only; replay-from-offset supported
  • Vendor-neutral publisher — drop-in EventBridge / Kafka / Kinesis target

Event types (all CloudEvents 1.0 spec compliant):
  authrex.case.decided.v1
  authrex.case.denied.v1
  authrex.appeal.drafted.v1
  authrex.reviewer.signed_off.v1
  authrex.trizetto.envelope_dispatched.v1
"""
from app.events.outbox import (
    DomainEvent,
    emit_event,
    ensure_schema,
    pending_events,
    mark_published,
)

__all__ = [
    "DomainEvent",
    "emit_event",
    "ensure_schema",
    "pending_events",
    "mark_published",
]
