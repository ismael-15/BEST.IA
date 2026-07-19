# Diagnóstico Técnico — BEST.IA

## Estado actual del proyecto

El proyecto tiene un flujo funcional de extremo a extremo: autenticación, chat de estudiante con historial de mensajes, y un endpoint de IA que analiza emoción, detecta riesgo de crisis y genera respuesta empática.

## Qué funciona actualmente

- Inicio de sesión y control de acceso por rol con Supabase Auth.
- Chat para estudiantes con sesiones, historial de mensajes y actualización en tiempo real (Supabase Realtime).
- Endpoint `/api/chat` con validación de entrada, detección de crisis, filtrado de temas fuera de alcance y llamada al modelo generativo.
- Endpoints `/api/health` y `/api/metadata` para verificación de estado y contrato del servicio.
- Servicio externo de análisis emocional (pysentimiento, FastAPI) corriendo localmente.

## Qué es manual, incompleto o frágil

- El dashboard del psicólogo no cuenta con todas las funciones aún.
- La base de datos no tiene RLS (Row Level Security) configurado completamente.
- El registro de usuarios solo permite crear estudiantes; los psicólogos se crean manualmente por admin.
- La detección de crisis se basa en reglas heurísticas simples (palabras clave), no en un modelo clínico validado.
- No existen pruebas automatizadas todavía.
- El proyecto solo se ejecuta de forma local, sin despliegue en producción.

## Dependencias técnicas

- Next.js (App Router) + TypeScript para frontend y backend.
- Supabase (Auth, PostgreSQL, Realtime).
- Servicio Python (FastAPI + pysentimiento) para análisis emocional.
- Google Generative Language API (Gemini/Gemma) para generación de respuestas.

## Datos, archivos, servicios o credenciales necesarios

- Proyecto activo en Supabase (URL + clave pública).
- Clave de API de Google AI (`GOOGLE_AI_API_KEY`).
- Servicio de pysentimiento corriendo localmente (puerto 8000).
- Archivo `.env.local` con las variables descritas en el README.

## Cómo se ejecuta actualmente

1. Levantar el servicio de pysentimiento con `uvicorn emotion_service:app --reload`.
2. Configurar `.env.local` con las credenciales necesarias.
3. Ejecutar `npm install` y `npm run dev`.
4. Acceder a `http://localhost:3000`.

## Evidencia de que el prototipo funciona

- Ruta `app/chat/page.tsx` con manejo de sesiones, mensajes y renderizado de conversación en tiempo real.
- Endpoint `app/api/chat/route.ts` con lógica de validación, análisis emocional y generación de respuesta, probado con Thunder Client.
- Capturas de prueba en `docs/evidencia-pruebas.pdf`.