import { Activity, Dna, FileText, User } from "lucide-react";

import type { ClinicalSnapshot } from "../lib/types";

interface Props {
  snapshot: ClinicalSnapshot;
}

export function ClinicalSummaryCard({ snapshot }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-brand-600" />
        <h3 className="font-semibold text-slate-900">Clinical Snapshot</h3>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        {snapshot.free_text_summary}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <User size={11} />
            Patient
          </div>
          <div className="text-slate-900">
            {snapshot.patient_age ? `${snapshot.patient_age}y` : "—"}{" "}
            {snapshot.patient_sex ?? ""}{" "}
            {snapshot.performance_status && (
              <span className="text-xs text-slate-500">
                · ECOG {snapshot.performance_status}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Activity size={11} />
            Diagnosis
          </div>
          <div className="text-slate-900">
            <span className="font-mono text-xs">
              {snapshot.primary_diagnosis.icd10_code}
            </span>{" "}
            {snapshot.primary_diagnosis.stage && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 ml-1">
                Stage {snapshot.primary_diagnosis.stage}
              </span>
            )}
            <div className="text-xs text-slate-500 truncate">
              {snapshot.primary_diagnosis.description}
            </div>
          </div>
        </div>
      </div>

      {snapshot.biomarkers.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-2">
            <Dna size={11} />
            Biomarkers
          </div>
          <div className="flex flex-wrap gap-2">
            {snapshot.biomarkers.map((b, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200"
              >
                <span className="font-semibold">{b.name}</span>:{" "}
                <span className="text-slate-700">{b.value}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
          Requested Treatment
        </div>
        <div className="text-sm">
          <span className="font-semibold text-slate-900">
            {snapshot.requested_treatment.name}
          </span>
          {snapshot.requested_treatment.j_code && (
            <span className="ml-2 font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100">
              {snapshot.requested_treatment.j_code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
