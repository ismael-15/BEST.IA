import { NextResponse } from 'next/server';
import { validateChatRequest } from '@/lib/validation/chatSchema';
import { generateChatResponse } from '@/lib/ai/chatService';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const validation = validateChatRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await generateChatResponse(validation.data!.message);

    if (result.error) {
      return NextResponse.json(
        { error: result.error, detail: result.detail },
        { status: result.status || 500 }
      );
    }

    return NextResponse.json({
      content: result.content,
      emotion: result.emotion,
      blocked: result.blocked,
      crisisDetected: result.crisisDetected,
      model: result.model,
    });
  } catch (error: any) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json(
      { error: 'Error interno en el chat.', detail: error?.message || 'Unexpected server error' },
      { status: 500 }
    );
  }
}