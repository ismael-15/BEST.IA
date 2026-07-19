# Documentación de API — BEST.IA

API de acompañamiento emocional para estudiantes universitarios. Analiza el mensaje del usuario, detecta emoción y riesgo de crisis, y responde con apoyo empático usando un modelo generativo.

## Tecnologías

- Framework: Next.js (App Router)
- Lenguaje: TypeScript
- Modelo IA generativo: Google Gemini (`gemma-4-26b-a4b-it` o el definido en `CHAT_AI_MODEL`)
- Servicio de análisis emocional: pysentimiento (FastAPI, Python)
- Base de datos: Supabase (PostgreSQL)

---

## 1. GET /api/health

Verifica que el servicio está activo.

**Método:** GET
**Ruta:** `/api/health`
**Payload de entrada:** ninguno

**Respuesta exitosa (200):**
```json
{
  "status": "ok",
  "service": "best-ia-chat",
  "timestamp": "2026-07-18T15:30:00.000Z"
}
```

**Errores:** este endpoint no tiene validaciones de entrada, siempre responde 200 si el servicio está levantado.

**Herramienta usada para probar:** Thunder Client

---

## 2. GET /api/metadata

Informa propósito, versión y tecnología de la API.

**Método:** GET
**Ruta:** `/api/metadata`
**Payload de entrada:** ninguno

**Respuesta exitosa (200):**
```json
{
  "name": "BEST.IA",
  "description": "API de acompañamiento emocional para estudiantes universitarios...",
  "version": "1.0.0",
  "technology": {
    "framework": "Next.js (App Router)",
    "language": "TypeScript",
    "aiModel": "gemma-4-26b-a4b-it",
    "emotionService": "pysentimiento (FastAPI, Python)",
    "database": "Supabase (PostgreSQL)"
  },
  "endpoints": [
    { "path": "/api/health", "method": "GET", "purpose": "Verificar que el servicio está activo." },
    { "path": "/api/metadata", "method": "GET", "purpose": "Informar propósito, versión y tecnología de la API." },
    { "path": "/api/chat", "method": "POST", "purpose": "Ejecutar la capacidad inteligente principal." }
  ]
}
```

**Errores:** no aplica, siempre responde 200.

**Herramienta usada para probar:** Thunder Client

---

## 3. POST /api/chat

Endpoint principal de IA. Recibe el mensaje del estudiante, valida la entrada, analiza la emoción, detecta riesgo de crisis y genera una respuesta empática con Gemini.

**Método:** POST
**Ruta:** `/api/chat`
**Headers:** `Content-Type: application/json`

**Payload de entrada:**
```json
{
  "message": "me siento agotado con los estudios"
}
```

**Validaciones aplicadas:**
- El body debe ser un JSON válido.
- El campo `message` es obligatorio y debe ser texto no vacío.
- El mensaje no puede superar los 1000 caracteres.
- Se filtran intentos de prompt injection (ej. "ignora las instrucciones").
- Se filtran mensajes fuera de contexto (ej. temas de programación, política, deportes).
- Se detecta riesgo de crisis mediante palabras clave explícitas (ej. "quiero morir", "no aguanto más").

**Respuesta exitosa (200):**
```json
{
  "content": "Lamento que te sientas así. Es muy común experimentar cansancio en época de estudios...",
  "emotion": "sadness",
  "blocked": false,
  "crisisDetected": false,
  "model": "gemma-4-26b-a4b-it"
}
```

**Respuesta con error de validación (400):**
```json
{
  "error": "El mensaje es obligatorio."
}
```

**Respuesta con error interno (500):**
```json
{
  "error": "Error al generar respuesta con Gemma.",
  "detail": "No se pudo obtener respuesta del modelo."
}
```

**Respuesta cuando se detecta crisis (200, con bandera de bloqueo):**
```json
{
  "content": "Siento mucho que estés pasando por esto. No estás solo/a...",
  "emotion": "sadness",
  "blocked": true,
  "crisisDetected": true
}
```

**Herramienta usada para probar:** Thunder Client

---

## Evidencia de prueba

Ver PDF adjunto `evidencia-pruebas.pdf` con capturas de:
- GET /api/health → 200 OK
- GET /api/metadata → 200 OK
- POST /api/chat con mensaje válido → 200 OK
- POST /api/chat con body vacío `{}` → 400, error de validación