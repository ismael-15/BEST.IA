import { NextResponse } from 'next/server';
import { validateChatRequest } from '@/lib/validation/chatSchema';
import { generateChatResponse } from '@/lib/ai/chatService';
import {
  createRequestId,
  logRequestEvent,
} from '@/lib/observability';

const ROUTE = '/api/chat';

export async function POST(request: Request) {
  // NUEVO: identificador único y cronómetro para observabilidad.
  const requestId = createRequestId();
  const startedAt = performance.now();

  try {
    const body = await request.json().catch(() => null);
    const validation = validateChatRequest(body);

    if (!validation.valid) {
      const durationMs = performance.now() - startedAt;

      // NUEVO: log del error controlado de validación.
      // No registra el contenido enviado por el estudiante.
      logRequestEvent({
        requestId,
        route: ROUTE,
        status: 'error',
        durationMs,
        errorType: 'VALIDATION_ERROR',
      });

      return NextResponse.json(
        {
          error: validation.error,
          request_id: requestId,
        },
        { status: 400 }
      );
    }

    
    // emoción, score, bloqueo, crisis y modelo.
    const result = await generateChatResponse(validation.data!.message);
    const durationMs = performance.now() - startedAt;

    if (result.error) {
      // NUEVO: log para errores controlados del componente IA.
      logRequestEvent({
        requestId,
        route: ROUTE,
        status: 'error',
        durationMs,
        model: result.model,
        emotion: result.emotion,
        emotionScore: result.emotionScore,
        crisisDetected: result.crisisDetected,
        errorType: 'AI_SERVICE_ERROR',
      });

      return NextResponse.json(
        {
          error: result.error,
          detail: result.detail,
          request_id: requestId,
        },
        { status: result.status || 500 }
      );
    }

    // NUEVO: log de solicitud exitosa.
    logRequestEvent({
      requestId,
      route: ROUTE,
      status: 'success',
      durationMs,
      model: result.model,
      emotion: result.emotion,
      emotionScore: result.emotionScore,
      crisisDetected: result.crisisDetected,
    });

    
    return NextResponse.json({
      content: result.content,
      emotion: result.emotion,
      emotionScore: result.emotionScore,
      blocked: result.blocked,
      crisisDetected: result.crisisDetected,
      model: result.model,
      request_id: requestId, // NUEVO: correlación cliente/log.
    });
  } catch (error: any) {
    const durationMs = performance.now() - startedAt;

    // NUEVO: log de excepción no esperada.
    logRequestEvent({
      requestId,
      route: ROUTE,
      status: 'error',
      durationMs,
      errorType: 'UNEXPECTED_ERROR',
    });

    
    // body, headers de autorización, tokens o claves.
    console.error('Error en /api/chat:', {
      request_id: requestId,
      error_type: 'UNEXPECTED_ERROR',
      message: error?.message || 'Unexpected server error',
    });

    return NextResponse.json(
      {
        error: 'Error interno en el chat.',
        detail: error?.message || 'Unexpected server error',
        request_id: requestId,
      },
      { status: 500 }
    );
  }
}