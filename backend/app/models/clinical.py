"""Clinical snapshot - structured output of the Clinical Extractor agent.

Source of truth: PROPOSAL.md §9.1.
"""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class Diagnosis(BaseModel):
    icd10_code: str
    description: str
    stage: Optional[str] = None  # AJCC notation, e.g. "IIIA", "IV"
    onset_date: Optional[str] = None
    source_resource_id: str  # FHIR Condition.id


class PriorTherapy(BaseModel):
    therapy_name: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    response: Optional[str] = None  # complete | partial | progression | intolerance
    source_resource_id: Optional[str] = None


class Biomarker(BaseModel):
    name: str  # e.g. "HER2", "ER", "PR", "PD-L1", "BRAF V600E"
    value: str  # e.g. "positive", "negative", "3+", "high"
    test_date: Optional[str] = None
    source_resource_id: Optional[str] = None


class Comorbidity(BaseModel):
    icd10_code: str
    description: str


class RequestedTreatment(BaseModel):
    name: str
    hcpcs_code: Optional[str] = None
    j_code: Optional[str] = None
    dose: Optional[str] = None
    frequency: Optional[str] = None
    intent: Optional[str] = None  # curative | palliative | adjuvant | neoadjuvant


class ClinicalSnapshot(BaseModel):
    """The structured clinical record consumed by every downstream agent."""

    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    primary_diagnosis: Diagnosis
    additional_diagnoses: list[Diagnosis] = Field(default_factory=list)
    prior_therapies: list[PriorTherapy] = Field(default_factory=list)
    biomarkers: list[Biomarker] = Field(default_factory=list)
    comorbidities: list[Comorbidity] = Field(default_factory=list)
    performance_status: Optional[str] = None  # ECOG 0-4 as string, e.g. "1"
    requested_treatment: RequestedTreatment
    free_text_summary: str  # 3-5 sentence narrative for the trace UI
