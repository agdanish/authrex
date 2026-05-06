"""Public agent manifest endpoint.

Surfaces the 7-agent / 21-sub-agent decomposition for the frontend Agents
page and any external MCP / TriZetto AI Gateway integration that wants to
introspect the system.
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.agents.manifest import AGENT_MANIFEST, flatten_sub_agents, total_sub_agents

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/manifest")
async def agents_manifest() -> dict[str, Any]:
    """Return the full 7-agent / 21-sub-agent manifest."""
    return {
        "n_agents": len(AGENT_MANIFEST),
        "n_sub_agents": total_sub_agents(),
        "agents": AGENT_MANIFEST,
    }


@router.get("/sub-agents")
async def sub_agents_flat() -> dict[str, Any]:
    """Flat list of every sub-agent across all parents — handy for /eval and /agents."""
    flat = flatten_sub_agents()
    return {"n": len(flat), "sub_agents": flat}
