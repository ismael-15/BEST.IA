import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'BEST.IA Chat API',
    version: '1.0.0',
    description:
      'API de acompañamiento emocional para estudiantes universitarios, con análisis de emoción, detección de crisis y respuesta generativa.',
    aiComponents: {
      emotionAnalysis: {
        provider: 'pysentimiento (microservicio propio)',
        endpoint: '/analyze',
      },
      generativeModel: {
        provider: 'Google Generative Language API',
        model: process.env.CHAT_AI_MODEL || 'gemma-4-26b-a4b-it',
      },
    },
    endpoints: [
      { path: '/api/health', method: 'GET', description: 'Verifica que el servicio está activo.' },
      { path: '/api/metadata', method: 'GET', description: 'Información del servicio y modelo utilizado.' },
      { path: '/api/chat', method: 'POST', description: 'Analiza emoción, detecta crisis y genera respuesta empática.' },
    ],
  });
}