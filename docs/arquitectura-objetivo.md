# Arquitectura Objetivo — BEST.IA

## Separación entre interfaz, backend, IA, datos y configuración

- Interfaz: `app/` (páginas y componentes).
- Backend/contrato: `app/api/*/route.ts` (solo maneja request/response).
- Lógica de IA: `lib/ai/chatService.ts` (prompt, Gemini, análisis emocional, crisis).
- Validación de contrato: `lib/validation/chatSchema.ts`.
- Datos: Supabase (Auth + PostgreSQL + Realtime).
- Configuración: `.env.local` / `.env.example`.

## API o endpoint inteligente (Semana 2) — Completado

- `/api/chat` (POST): capacidad inteligente principal.
- `/api/health` (GET): estado del servicio.
- `/api/metadata` (GET): versión, tecnología y propósito.
- Contrato documentado en `docs/api.md`.

## Pruebas y automatización (Semana 3)

- Pruebas unitarias para `chatSchema.ts` y `chatService.ts`.
- Pruebas de integración para los tres endpoints.
- Pipeline básico de CI para correr pruebas en cada push.

## Contenedor o despliegue (Semana 4)

- Dockerfile para el servicio Next.js.
- Dockerfile o contenedor separado para el servicio de pysentimiento.
- Despliegue en un proveedor (Vercel para Next.js, Render/Railway para el servicio Python).

## Logs, métricas o monitoreo (Semana 5)

- Logging estructurado de errores en `/api/chat`.
- Métricas básicas de latencia y tasa de error del modelo generativo.
- Alertas ante fallos repetidos del proveedor de IA.

## Seguridad, documentación final y defensa (Semana 6)

- Configurar Row Level Security (RLS) en todas las tablas de Supabase.
- Revisión final de que no se expongan credenciales.
- Documentación consolidada y preparación de la defensa técnica del proyecto.