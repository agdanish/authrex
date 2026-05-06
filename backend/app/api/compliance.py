"""Live compliance scorecard endpoints (IMPACT-2).

  GET /api/v1/compliance/case/{case_id}      — per-case clause-by-clause scorecard
  GET /api/v1/compliance/org                  — org-level rollup with deadlines
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.compliance.cms_0057f import case_scorecard, org_scorecard

router = APIRouter(prefix="/compliance", tags=["compliance"])


@router.get("/case/{case_id}")
async def get_case_scorecard(
    case_id: str,
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    """Return the per-case CMS-0057-F + state-law scorecard.

    Org-scoped: case must belong to the caller's organization."""
    try:
        sc = await case_scorecard(case_id, organization_id=user["organization_id"])
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    except PermissionError:
        # Don't leak existence cross-org
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return sc.to_dict()


@router.get("/org")
async def get_org_scorecard(
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    """Return the org-level compliance rollup."""
    return await org_scorecard(user["organization_id"])
