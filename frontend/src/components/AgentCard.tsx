import clsx from "clsx";
import { AlertCircle, CheckCircle2, ChevronDown, Clock, Cpu } from "lucide-react";
import { useState } from "react";

export type AgentStatus = "pending" | "running" | "done" | "error";

interface AgentCardProps {
  name: string;
  displayName?: string;
  status: AgentStatus;
  latencyMs?: number | null;
  modelId?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  error?: string | null;
  output?: Record<string, unknown>;
  description?: string;
}

const statusStyles: Record<AgentStatus, { ring: string; pill: string; pillText: string }> = {
  pending: {
    ring: "border-slate-200",
    pill: "bg-slate-100",
    pillText: "text-slate-500",
  },
  running: {
    ring: "border-brand-300 shadow-md",
    pill: "bg-brand-100 animate-pulse-soft",
    pillText: "text-brand-700",
  },
  done: {
    ring: "border-emerald-200",
    pill: "bg-emerald-100",
    pillText: "text-emerald-700",
  },
  error: {
    ring: "border-rose-200",
    pill: "bg-rose-100",
    pillText: "text-rose-700",
  },
};

const statusLabel: Record<AgentStatus, string> = {
  pending: "Pending",
  running: "Thinking...",
  done: "Completed",
  error: "Error",
};

export function AgentCard({
  name,
  displayName,
  status,
  latencyMs,
  modelId,
  inputTokens,
  outputTokens,
  error,
  output,
  description,
}: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const s = statusStyles[status];

  return (
    <div
      className={clsx(
        "border-2 rounded-xl bg-white p-4 transition-all animate-slide-in-right",
        s.ring,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-slate-900">
              {displayName || name}
            </div>
            <span
              className={clsx(
                "text-[10px] font-mono uppercase tracking-wider rounded px-2 py-0.5",
                s.pill,
                s.pillText,
              )}
            >
              {statusLabel[status]}
            </span>
          </div>
          {description && (
            <div className="text-xs text-slate-500 mb-2">{description}</div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            {latencyMs != null && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {latencyMs < 1000
                  ? `${latencyMs}ms`
                  : `${(latencyMs / 1000).toFixed(1)}s`}
              </span>
            )}
            {modelId && (
              <span className="flex items-center gap-1 font-mono">
                <Cpu size={12} />
                {modelId.split("/").pop()}
              </span>
            )}
            {inputTokens != null && outputTokens != null && (
              <span className="font-mono">
                {inputTokens.toLocaleString()} in /{" "}
                {outputTokens.toLocaleString()} out
              </span>
            )}
          </div>
        </div>

        {status === "done" && (
          <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
        )}
        {status === "error" && (
          <AlertCircle size={20} className="text-rose-500 flex-shrink-0" />
        )}
        {status === "running" && (
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}
      </div>

      {error && (
        <div className="mt-3 p-2 rounded bg-rose-50 text-rose-700 text-xs font-mono">
          {error}
        </div>
      )}

      {output && Object.keys(output).length > 0 && status === "done" && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <ChevronDown
              size={12}
              className={clsx("transition-transform", expanded && "rotate-180")}
            />
            {expanded ? "Hide" : "Show"} output
          </button>
          {expanded && (
            <pre className="mt-2 p-3 rounded bg-slate-50 text-[11px] font-mono text-slate-700 overflow-auto max-h-64">
              {JSON.stringify(output, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
