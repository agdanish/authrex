"""patient_communicator — parent agent package."""
from app.agents.patient_communicator.orchestrator import (
    SUB_AGENTS,
    PatientCommunicatorAgent,
    patient_communicator,
)
from app.agents.patient_communicator.schemas import *  # noqa: F401,F403
from app.agents.patient_communicator.sub_agents import *  # noqa: F401,F403
# node.py is imported for its side effects + legacy shims
from app.agents.patient_communicator import node as _node
# Re-export the LangGraph node and key shims
from app.agents.patient_communicator.node import (
    patient_communicator_node,
    communicate_to_patient,
)
