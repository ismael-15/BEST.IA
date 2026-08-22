import { randomUUID } from 'crypto';

export type LogStatus = 'success' | 'error';

interface RequestLogInput {
  requestId: string;
  route: string;
  status: LogStatus;
  durationMs: number;
  model?: string | null;
  emotion?: string | null;
  emotionScore?: number | null;
  crisisDetected?: boolean;
  errorType?: string | null;
}

export function createRequestId() {
  return randomUUID();
}

export function logRequestEvent(input: RequestLogInput) {
  console.log(
    JSON.stringify({
      event: 'api_request',
      request_id: input.requestId,
      route: input.route,
      status: input.status,
      duration_ms: Math.round(input.durationMs),
      model: input.model ?? null,
      emotion: input.emotion ?? null,
      emotion_score: input.emotionScore ?? null,
      crisis_detected: input.crisisDetected ?? false,
      error_type: input.errorType ?? null,
      timestamp: new Date().toISOString(),
    })
  );
}