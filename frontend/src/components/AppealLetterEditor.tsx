import { FileEdit, Mail, Paperclip } from "lucide-react";
import { useState } from "react";

import type { AppealDraft } from "../lib/types";

interface Props {
  appeal: AppealDraft;
}

export function AppealLetterEditor({ appeal }: Props) {
  const [showStructured, setShowStructured] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-brand-600" />
          <h3 className="font-semibold text-slate-900">Drafted Appeal Letter</h3>
          <span className="text-xs font-mono text-slate-500">
            {appeal.appeal_body.split(/\s+/).length} words
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowStructured(!showStructured)}
          className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
        >
          <FileEdit size={12} />
          {showStructured ? "Letter view" : "Structured arguments"}
        </button>
      </div>

      <div className="p-6 max-h-[500px] overflow-auto">
        {!showStructured && (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed text-sm">
              {appeal.appeal_body}
            </pre>
          </div>
        )}

        {showStructured && (
          <div className="space-y-4">
            {appeal.structured_arguments.map((arg, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50/40"
              >
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
                  Argument #{i + 1}
                </div>
                <div className="font-semibold text-slate-900 text-sm mb-2">
                  {arg.contested_criterion}
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-rose-600 font-mono uppercase mb-1">
                      Payer position
                    </div>
                    <p className="text-slate-700">{arg.payer_position}</p>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-600 font-mono uppercase mb-1">
                      Our position
                    </div>
                    <p className="text-slate-700">{arg.counter_position}</p>
                  </div>
                </div>

                {arg.cited_evidence.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-xs text-slate-500 font-mono uppercase mb-1">
                      Cited clinical evidence
                    </div>
                    <ul className="text-sm text-slate-700 space-y-0.5 list-disc list-inside">
                      {arg.cited_evidence.map((e, j) => (
                        <li key={j}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {arg.cited_guideline && (
                  <div className="mt-2">
                    <span className="text-[11px] font-mono px-2 py-1 rounded bg-violet-50 text-violet-800 border border-violet-200">
                      📖 {arg.cited_guideline}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {appeal.attachments_referenced.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 font-mono uppercase mb-1.5 flex items-center gap-1">
            <Paperclip size={11} />
            Attachments referenced
          </div>
          <div className="flex flex-wrap gap-1.5">
            {appeal.attachments_referenced.map((a, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded bg-white border border-slate-200"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-3 border-t-2 border-brand-100 bg-brand-50/50">
        <div className="text-xs text-brand-700 font-mono uppercase mb-1">
          Requested action
        </div>
        <div className="text-sm text-brand-900">{appeal.requested_action}</div>
      </div>
    </div>
  );
}
