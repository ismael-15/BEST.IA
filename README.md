# Nombre del Proyecto

> BEST.IA.

## 1. Información General

**Módulo:** Módulo 4 - Desarrollo de Aplicaciones con IA  
**Semana:** Semana 2 - API inteligente y contratos de integración 
**Nombre del equipo:**  
**Integrantes:**  

- Integrante 1: placido Ismael Luna Argueta
- Integrante 2: Naser Audeli Claros Rivera
- Integrante 3: Sofia Gissell Hernadez AScensio

---

## 2. Descripción del Problema

Describan claramente el problema que busca resolver la aplicación.

**Preguntas guía:**

- ¿Qué problema real se quiere resolver?
- ¿A quién afecta este problema?
- ¿En qué contexto ocurre?
- ¿Por qué una solución con IA puede aportar valor?

**Descripción:**

> BEST.IA busca atender una necesidad real en estudiantes universitarios: muchas veces enfrentan ansiedad, estrés académico, tristeza, agotamiento emocional o momentos de crisis sin contar con un canal inmediato, privado y accesible para expresar lo que sienten. El problema afecta principalmente a estudiantes que necesitan un primer espacio de acompañamiento emocional, especialmente cuando no tienen acceso inmediato a apoyo humano, cuando sienten vergüenza de pedir ayuda o cuando requieren una orientación inicial antes de acudir a un profesional.

>El contexto del problema es educativo y emocional. La carga académica, los conflictos personales, la presión por el rendimiento y el aislamiento pueden deteriorar el bienestar del estudiante y afectar tanto su salud mental como su desempeño. Una solución con IA aporta valor porque permite ofrecer una primera capa de acompañamiento conversacional, detección preliminar de emociones y activación de respuestas seguras ante posibles señales de crisis, además de mantener disponibilidad inmediata dentro de la aplicación.

---

## 3. Usuarios o Beneficiarios

Identifiquen quiénes usarían o se beneficiarían de la aplicación.

|-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|Usuario / Beneficiario.        | Necesidad principa.                                      |Cómo ayuda la aplicación.                                                 |
|-------------------------------|----------------------------------------------------------|------------------------------------------------------------------------- |
|Estudiantes universitarios.    |Expresar cómo se sienten y recibir acompañamiento inicial | Proporciona un chat privado con respuestas empáticas y detección         |
|                               |                                                          | básica de emociones.                                                     |
|                               |                                                          |                                                                          |
|Psicólogos o personal de apoyo.|Identificar casos que requieren seguimiento.              | Permite supervisión del flujo y futura escalación de casos críticos.     |
|                               |                                                          |                                                                          |
|Institución educativa          |Mejorar el bienestar y la atención temprana.              | Facilita un canal digital inicial de apoyo emocional para su comunidad.  |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
---

## 4. Descripción de la Solución

Expliquen qué hace la aplicación en términos generales.

**Preguntas guía:**

- ¿Qué permite hacer la aplicación?
- ¿Qué recibe como entrada?
- ¿Qué entrega como resultado?
- ¿Qué parte del proceso automatiza o mejora?

**Descripción:**

> BEST.IA es una aplicación web de acompañamiento emocional orientada a estudiantes. Permite iniciar sesión, abrir conversaciones, enviar mensajes en un chat privado y recibir respuestas generadas por un componente de IA con enfoque en bienestar emocional estudiantil.

>La aplicación recibe como entrada mensajes de texto escritos por el estudiante. Como resultado, entrega una respuesta empática en español, una emoción detectada por el componente de análisis y, cuando corresponde, activa una respuesta segura de crisis o bloqueo por temas fuera de alcance. La solución automatiza la atención inicial conversacional, la clasificación emocional básica y el filtrado de consultas no permitidas, dejando abierta la posibilidad de derivación a apoyo humano.

---

## 5. Componente de Inteligencia Artificial

Indiquen claramente dónde está la IA dentro del proyecto.
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|             Elemento                       |                                  Descripcion                                                                           |
| -------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Tipo de IA utilizada.                      | IA generativa conversacional y análisis automático de emoción.                                                         |  
|                                            |                                                                                                                        |
| Modelo, algoritmo, servicio o técnica.     | Gemini/Gemma mediante generateContent y servicio externo de análisis emocional.                                        |
|                                            |                                                                                                                        |
| Datos de entrada.                          | Texto escrito por el estudiante.                                                                                       |
|                                            |                                                                                                                        |
| Resultado generado por la IA.              | Respuesta conversacional empática, emoción detectada y banderas de riesgo o bloqueo.                                   |
|                                            |                                                                                                                        |
| Métrica o forma de evaluación, si aplica.  | Pruebas funcionales manuales, coherencia de respuesta y detección segura de crisis.                                    |
|                                            |                                                                                                                        |
| Limitaciones actuales.                     | Dependencia de servicios externos, errores del modelo, reglas heurísticas simples para                                 |
|                                            | crisis y cobertura parcial del cominio.                                                                                |
|                                            |                                                                                                                        |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
**Explicación breve:**

> La IA participa en dos momentos principales. Primero, un servicio de análisis emocional procesa el texto del usuario para estimar una emoción predominante. Después, un modelo generativo produce una respuesta en lenguaje natural siguiendo restricciones de seguridad, alcance temático y tono empático. Además, el sistema incorpora reglas locales para detectar posibles situaciones de crisis y responder de forma segura antes de correr completamente en el modelo.

---

## 6. Estado Actual del Proyecto

Ver diagnóstico técnico completo en [`docs/diagnostico-semana-1.md`](./docs/diagnostico-semana-1.md), incluyendo funcionalidades activas, partes incompletas, dependencias y evidencia de que el prototipo funciona. 



## 7. Arquitectura Actual

Incluyan o enlacen el diagrama de la arquitectura actual.

**Archivo sugerido:** `docs/arquitectura-actual.md` o `docs/arquitectura-actual.png`

Ver detalle completo en [`docs/arquitectura-actual.md`](./docs/arquitectura-actual.md), incluyendo actor principal, interfaz, backend, componente de IA, datos, servicios externos y puntos frágiles.

**Diagrama:**

> !![diagrama](image-1.png)

---

## 8. Arquitectura Objetivo

Describan cómo debería quedar el proyecto al finalizar el módulo.

**Archivo sugerido:** `docs/arquitectura-objetivo.md` o `docs/arquitectura-objetivo.png`

Ver detalle completo en [`docs/arquitectura-objetivo.md`](./docs/arquitectura-objetivo.md), incluyendo la separación entre interfaz, backend, IA, datos y configuración, y el plan por semana hasta el despliegue final.

**Diagrama:**

> ![aruitectura objetivo](image-2.png)

---

## 9. Estructura del Repositorio

Describan la organización del proyecto.

.
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── health/
│   │   │   └── route.ts
│   │   └── metadata/
│   │       └── route.ts
│   ├── auth/
│   ├── chat/
│   └── dashboard/
├── lib/
│   ├── ai/
│   │   └── chatService.ts
│   ├── chatSession.ts
│   ├── sendStudentMessage.ts
│   ├── saveBotMessage.ts
│   └── supabase.ts
├── docs/
│   ├── api.md
│   ├── evidencias_despliegue.pdf
│   └── [otros documentos y evidencias]
├── emotion_service.py
├── Dockerfile
├── Dockerfile.emotion
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── requirements.txt
├── package.json
└── README.md

**Notas sobre la estructura:**

> La carpeta app/api/ expone tres endpoints: /chat (capacidad inteligente principal), /health (estado del servicio) y /metadata (información de versión y tecnología). La carpeta lib/validation/ contiene la validación del contrato de entrada, y lib/ai/ concentra la lógica de negocio (prompt, llamada a Gemini, análisis emocional y detección de crisis), separada del route handler. La documentación completa del contrato de la API está en docs/api.md.

---

## 10. Instalación y Ejecución

### Requisitos previos
- Node.js: versión compatible con Next.js App Router.

- Gestor de paquetes: npm, pnpm o yarn.

- Proyecto activo en Supabase.

- Clave del proveedor de IA y URL del servicio de análisis emocional.

servio de pysentimeinto local
crear en un entrono virtual python -m venv venv 
instalar las librerias pip install fastapi uvicorn pysentimiento torch transformers sentencepiece 
levantar el entorno virtual .\venv\Scripts\Activate.ps1   
correr el servicio uvicorn emotion_service:app --host 0.0.0.0 --port 8000 --reload  


### Instalación

### Ejecución local de la aplicación web

```bash
npm install
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```
### Ejecución con Docker

Configura el archivo `.env.local` y ejecuta:

```bash
docker compose up --build
```

La aplicación web estará disponible en:

```text
http://localhost:3000
```

Para detener los contenedores:

```bash
docker compose down
```

Para ver los logs:

```bash
docker compose logs -f
```
### Ejecución local del servicio emocional

```bash
python -m venv venv
```

En Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Instala las dependencias:

```bash
pip install -r requirements.txt
```

Inicia el servicio:

```bash
uvicorn emotion_service:app --host 0.0.0.0 --port 8000 --reload
```

En ejecución local, utiliza:

```env
PYSENTIMIENTO_API_URL=http://localhost:8000
```

En Docker, utiliza:

```env
PYSENTIMIENTO_API_URL=http://emotion-service:8000
```

### Variables de entorno

|------------------------------------------------------------------------------------------------------|
| Variable                             | Descripción                                     | Obligatoria |
| ------------------------------------ | ----------------------------------------------- | ----------- |
| NEXT_PUBLIC_SUPABASE_URL             | URL del proyecto Supabase                       | Sí          |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Clave pública o anon/publicable key de Supabase | Sí          |
| PYSENTIMIENTO_API_URL                | URL del servicio de análisis emocional          | Sí          |
| GOOGLE_AI_API_KEY                    | Clave del proveedor de IA                       | Sí          |
| GOOGLE_AI_MODEL                      | Modelo generativo a usar                        | No          |
|------------------------------------------------------------------------------------------------------|
---
### Probar los endpoints

Con el servidor corriendo (`npm run dev`) y el servicio de pysentimiento activo en el puerto 8000, prueba los endpoints con curl, Thunder Client o Postman:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/metadata
curl -X POST http://localhost:3000/api/chat
```

La documentación completa del contrato de entrada/salida de cada endpoint está en [`docs/api.md`](./docs/api.md).
## 11. Datos Utilizados

Describan los datos que usa la aplicación.

|------------------------------------------------------------------------------------------------------------------------------|
| Fuente de Datos       | Tipo de Datos             | Uso dentro del Proyecto            |        Observaciones           |                                  
|-----------------------|---------------------------|------------------------------------|-------------------------------------|
| Mensajes del chat     | Texto libre               | Entrada para análisis emocional    | Puede contener información sensible |
|                       |                           | y generacion de respuestas.        |                                     |
| Sesiones de chat      | Metadatos conversacionales| Agrupar conversaciones por usuario | Requiere control de acceso.         |            
| Usuarios y roles      | Datos de autenticación    | Restringir acceso según tipo       | Datos privados.                     |  
|                       | y perfil                  | de usuario.                        |                                     |
| Respuestas del modelo | Texto generado            | Apoyo conversacional.              | Debe validarse antes de confiar     |
|                       |                           | y feedback emocional.              | plenamente.                         |
|------------------------------------------------------------------------------------------------------------------------------|
**Consideraciones:**

- ¿Los datos son públicos, privados o simulados?
Los datos son principalmente privados y asociados a conversaciones de usuarios autenticados.
- ¿Contienen información sensible?
Sí pueden contener información sensible relacionada con salud emocional.
- ¿Requieren limpieza o validación?
Requieren validación, control de acceso y políticas claras de almacenamiento.
- ¿Existen limitaciones de calidad?
La calidad del texto puede variar y afectar tanto la detección emocional como la generación de respuesta.


---


## 12. Riesgos Técnicos y Deuda Técnica

Ver tabla completa de riesgos, categorías, probabilidad, impacto y mitigación en [`docs/riesgos-tecnicos.md`](./docs/riesgos-tecnicos.md).

---

## 13. Plan de Mejora por Semana

Indiquen cómo evolucionará el proyecto durante el módulo.


Ver plan completo semana por semana en [`docs/plan-mejora.md`](./docs/plan-mejora.md).

## 14. Limitaciones Actuales

Describan con honestidad las limitaciones del prototipo.

- La solución depende de servicios externos para análisis emocional y generación de texto.

- El flujo de crisis aún se basa en reglas simples y no sustituye acompañamiento profesional.

- No existe todavía una capa formal de observabilidad, pruebas automatizadas ni despliegue final. 

- solo funciona de manera local

- El dasboarh del psicologo no cuenta con todas las funciones actualmente

- Base de datos falta agregar RLS para que funcione bien con las demas funciones que se le agregaran

- Login solo se puede registrar estudiantes psicologos solo por admin estamos viendo como solucionar esa parte
---

## 15. Evidencias

Agreguen enlaces o referencias a evidencias del proyecto.

Ver [`docs/api.md`](./docs/api.md) para el contrato completo de cada endpoint, y [`docs/evidencia-pruebas.pdf`](./docs/evidencia-pruebas.pdf) para capturas de:
- GET /api/health → respuesta 200 OK
- GET /api/metadata → respuesta 200 OK
- POST /api/chat con mensaje válido → respuesta 200 OK
- POST /api/chat con body vacío → error controlado 400

---

## 16. Créditos y Referencias

Incluyan librerías, modelos, datasets, documentación o servicios utilizados.

- Next.js App Router para interfaz y Route Handlers.

- Supabase Auth para autenticación en aplicaciones Next.js.

- Supabase Realtime Postgres Changes para sincronización de mensajes.

- Gemini API generateContent como base del componente generativo

---

## 17. Checklist de Revisión

Antes de entregar, verifiquen:

- [ ] El problema está claramente descrito.
- [ ] Se explica quién usará o se beneficiará de la aplicación.
- [ ] Se identifica dónde está la IA.
- [ ] Se describen entradas y salidas.
- [ ] Se documenta el estado actual del proyecto.
- [ ] Se incluye arquitectura actual.
- [ ] Se incluye arquitectura objetivo.
- [ ] Se explica cómo ejecutar el proyecto.
- [ ] Se identifican riesgos técnicos.
- [ ] Se presenta plan de mejora por semana.
- [ ] No se incluyen claves, contraseñas ni tokens privados.
