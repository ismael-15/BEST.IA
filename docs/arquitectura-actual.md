# Arquitectura Actual — BEST.IA

## Usuario o actor principal

Estudiante universitario que necesita acompañamiento emocional; psicólogo que supervisa casos (funcionalidad parcial).

## Interfaz o punto de entrada

Aplicación web en Next.js App Router, con pantallas de login, chat (`/chat`) y dashboard del psicólogo (`/dashboard`).

## Backend, script o servicio actual

Route Handlers de Next.js: `/api/chat`, `/api/health`, `/api/metadata`. Lógica de negocio separada en `lib/ai/chatService.ts` y validación en `lib/validation/chatSchema.ts`.

## Componente de IA

- Análisis emocional: servicio externo FastAPI + pysentimiento (Python), expuesto en `/analyze`.
- Generación de respuesta: modelo generativo Gemini/Gemma vía `generateContent`.
- Detección de crisis: reglas heurísticas locales por palabras clave.

## Datos utilizados

Tablas en Supabase PostgreSQL: `users`, `chat_sessions`, `messages`, `alerts`.

## Servicios externos

Supabase Auth, Supabase Realtime, servicio de pysentimiento (local), Google Generative Language API.

## Flujo básico de información

1. El estudiante envía un mensaje desde `/chat`.
2. El mensaje se guarda en Supabase (`sendStudentMessage`).
3. Se llama a `/api/chat`, que valida el mensaje, consulta el servicio de emoción, evalúa riesgo de crisis y genera respuesta con Gemini.
4. La respuesta se guarda en Supabase (`saveBotMessage`) y se muestra en el chat en tiempo real.

## Dependencias manuales o puntos frágiles

- El servicio de pysentimiento debe levantarse manualmente en cada entorno.
- No hay reintentos automáticos si Gemini responde con error 500.
- La detección de crisis depende de una lista fija de palabras clave, sin cobertura semántica amplia.

## Arquitectura final 

La solución está desplegada mediante una arquitectura de dos servicios en Railway:

Un servicio web con Next.js que contiene el chat, el dashboard y las rutas API.

Un servicio Python llamado emotion-service que ejecuta el análisis emocional con pysentimiento.

Supabase se utiliza como proveedor de autenticación, base de datos PostgreSQL, Realtime y políticas Row Level Security. El servicio web se comunica con el servicio emocional a través de la red privada de Railway, por lo que el analizador no se expone públicamente.

Usuario
  │
  ▼
Railway: BEST.IA (Next.js)
  ├── Chat del estudiante
  ├── Dashboard del psicólogo
  └── API Routes
          │
          ├── Supabase
          │   ├── Auth y confirmación de correo
          │   ├── PostgreSQL
          │   ├── Realtime
          │   └── RLS
          │
          └── Railway: emotion-service
              └── FastAPI + pysentimiento