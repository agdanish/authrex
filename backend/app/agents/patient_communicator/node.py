"""LangGraph node + legacy compatibility shims for patient_communicator."""
from __future__ import annotations

from pathlib import Path
from typing import Any, Optional
from datetime import date

from app.graph.state import get_or_init_agent_context
from app.agents.patient_communicator.orchestrator import patient_communicator
from app.agents.patient_communicator.schemas import *  # noqa: F401,F403
from app.graph.state import AuthrexState
from app.models import (  # noqa: F401
    AppealDraft, ClinicalSnapshot, Decision, NecessityAssessment, PolicyExcerpt,
)

# ----------------------------------------------------------------------------
# LangGraph node wrapper + legacy shim
# ----------------------------------------------------------------------------


async def communicate_to_patient(state: AuthrexState) -> AuthrexState:
    from app.graph.state import get_or_init_agent_context

    if state.decision is None:
        raise ValueError("decision must be set before patient_communicator")
    if state.clinical_snapshot is None:
        raise ValueError("clinical_snapshot must be set before patient_communicator")

    ctx = get_or_init_agent_context(state)
    result = await patient_communicator.invoke(
        PatientCommunicatorInput(
            snapshot=state.clinical_snapshot,
            decision=state.decision,
            appeal=state.appeal_draft,
            payer_id=state.payer_id,
        ),
        ctx=ctx,
    )
    state.patient_communication = result.output.communication
    return state


async def patient_communicator_node(state: AuthrexState) -> dict[str, Any]:
    """LangGraph node."""
    out = await communicate_to_patient(state)
    return {"patient_communication": out.patient_communication}
