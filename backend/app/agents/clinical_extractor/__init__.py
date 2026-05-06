"""clinical_extractor — parent agent package."""
from app.agents.clinical_extractor.orchestrator import (
    SUB_AGENTS,
    ClinicalExtractorAgent,
    clinical_extractor,
)
from app.agents.clinical_extractor.schemas import *  # noqa: F401,F403
from app.agents.clinical_extractor.sub_agents import *  # noqa: F401,F403
# node.py is imported for its side effects + legacy shims
from app.agents.clinical_extractor import node as _node
# Re-export the LangGraph node and key shims
from app.agents.clinical_extractor.node import (
    clinical_extractor_node,
    extract_clinical_snapshot,
    SYSTEM_PROMPT,
    _build_user_message,
    _strip_code_fence,
)
