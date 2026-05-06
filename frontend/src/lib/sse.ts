// EventSource wrapper for the Authrex agent trace stream.
import type { TraceEvent } from "./types";

export interface StreamHandle {
  close(): void;
}

const EVENT_TYPES = ["agent_started", "agent_finished", "agent_error", "done"] as const;

export function openTraceStream(
  caseId: string,
  onEvent: (event: TraceEvent) => void,
  onError?: (err: Event) => void,
  onOpen?: () => void,
): StreamHandle {
  const url = `/api/v1/cases/${caseId}/stream`;
  const es = new EventSource(url);

  if (onOpen) {
    es.addEventListener("open", () => onOpen());
  }
  if (onError) {
    es.addEventListener("error", (ev) => onError(ev));
  }

  for (const eventType of EVENT_TYPES) {
    es.addEventListener(eventType, (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        onEvent({ ...data, type: eventType } as TraceEvent);
      } catch (e) {
        // Malformed event - skip
        console.warn("Failed to parse SSE event", eventType, e);
      }
    });
  }

  return {
    close: () => es.close(),
  };
}
