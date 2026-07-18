# Nombre del Proyecto

> BEST.IA.

## 1. Información General

**Módulo:** Módulo 4 - Desarrollo de Aplicaciones con IA  
**Semana:** Semana 1 - Diagnóstico y arquitectura inicial  
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

Describan qué funciona actualmente y qué falta completar.

### Funcionalidades que ya funcionan

- Inicio de sesión y control de acceso por rol con Supabase Auth.

- Chat para estudiantes con sesiones, historial de mensajes y actualización en tiempo real.

- Endpoint /api/chat con validación de entrada, detección básica de crisis, filtrado de temas fuera de alcance y llamada al modelo generativo. 

### Funcionalidades incompletas o pendientes 

- Completar robustez del flujo cuando el proveedor de IA devuelve errores internos.

- Implementar evidencia formal de pruebas, métricas y observabilidad.

- Definir el mecanismo final de escalamiento o supervisión clínica para casos de crisis.


### Evidencias actuales

- Ruta de chat en app/chat/page.tsx con manejo de sesiones, mensajes y renderizado de conversación.

- Endpoint app/api/chat/route.ts con lógica de validación, análisis emocional y generación de respuesta.

- Integración con Supabase Realtime para escuchar inserciones de mensajes por sesión. 

---

## 7. Arquitectura Actual

Incluyan o enlacen el diagrama de la arquitectura actual.

**Archivo sugerido:** `docs/arquitectura-actual.md` o `docs/arquitectura-actual.png`

**Componentes actuales:**
|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Componente                 | Descripción                                                               | Estado actual                                  |
| -------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------- |
| Interfaz                   | Aplicación web en Next.js App Router con pantalla de chat y autenticación | Funcional                                      |
| Backend / lógica principal | Route Handler /api/chat y funciones auxiliares para sesiones y mensajes   | Funcional con mejoras pendientes               |
| Componente IA              | Servicio de análisis emocional y modelo generativo Gemini/Gemma           | Parcialmente funcional                         |
| Datos                      | Supabase PostgreSQL con tablas de usuarios, sesiones y mensajes           | Funcional                                      |
| Servicios externos         | Supabase Auth, Supabase Realtime y Google AI API                          | Funcional con incidencias puntuales del modelo |
| Configuración              | Variables de entorno para Supabase, análisis emocional y proveedor de IA  | Parcial                                        |
|---------------------------------------------------------------------------------------------------------------------------------------------------------|
**Diagrama:**

> !![diagrama](image-1.png)

---

## 8. Arquitectura Objetivo

Describan cómo debería quedar el proyecto al finalizar el módulo.

**Archivo sugerido:** `docs/arquitectura-objetivo.md` o `docs/arquitectura-objetivo.png`

**Elementos esperados:**

- interfaz web para estudiante y psicólogo

- API interna en Next.js con endpoints claros

- módulo IA desacoplado dentro del backend

- Supabase como auth, base de datos y realtime

- configuración por .env

- pruebas mínimas y despliegue con Docker

**Diagrama:**

> ![aruitectura objetivo](image-2.png)

---

## 9. Estructura del Repositorio

Describan la organización del proyecto.

bestia/
app/
  api/
    chat/
      route.ts
  auth/login
   page.tsx
  signup
   page.tsx
  chat/
    page.tsx
  dashboard/
   page.tsx  
lib/
  supabase.ts
  chatSession.ts
  sendStudentMessage.ts
  saveBotMessage.ts

README.md
.env.local
package.json

**Notas sobre la estructura:**

> La carpeta app/ contiene la interfaz y las rutas del App Router. La carpeta lib/ agrupa lógica reutilizable para Supabase, sesiones y persistencia de mensajes. Los archivos de configuración y variables de entorno viven en la raíz del proyecto.

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

```bash

npm install

```

### Ejecución

```bash
npm install
```

### Variables de entorno

|------------------------------------------------------------------------------------------------------|
| Variable                             | Descripción                                     | Obligatoria |
| ------------------------------------ | ----------------------------------------------- | ----------- |
| NEXT_PUBLIC_SUPABASE_URL             | URL del proyecto Supabase                       | Sí          |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Clave pública o anon/publicable key de Supabase | Sí          |
| NEXT_PUBLIC_PYSENTIMIENTO_API_URL    | URL del servicio de análisis emocional          | Sí          |
| GOOGLE_AI_API_KEY                    | Clave del proveedor de IA                       | Sí          |
| GOOGLE_AI_MODEL                      | Modelo generativo a usar                        | No          |
|------------------------------------------------------------------------------------------------------|
---

## 11. Datos Utilizados

Describan los datos que usa la aplicación.

|------------------------------------------------------------------------------------------------------------------------------|
| Fuente de Datos       | Tipo de Datos             | Uso dentro del Proyecto            | Observaciones                       |                                  
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

Identifiquen riesgos reales del proyecto.
|----------------------------------------------------------------------------------------------------------------------------------------------------|1
| Riesgo                                                 | Categoría                 | Probabilidad  | Impacto | Mitigación propuesta                |
|                                                        |                           |               |                                               |                                                                            |                           |               |
| ------------------------------------------------------ | ------------------------- | ------------  | ----------------------------------------------|
| Fallos del proveedor generativo o respuestas 500       | Modelo / Servicio externo | Alta  | Alto  | Implementar fallback seguro, reintentos       | 
|                                                                                                    | controlados y cambio de modelo                |
| Detección de crisis incompleta por reglas simples      | Modelo / Seguridad        | Media | Alto  | Ampliar reglas, validar con expertos y definir|   
|                                                                                                    | protocolo humano                              |
| Exposición de datos sensibles en logs o respuestas     | Seguridad                 | Media | Alto  | Sanitizar logs, aplicar RLS y revisar 
|                                                                                                    | almacenamiento                                |
| Acoplamiento fuerte entre frontend y lógica de negocio | Código / Arquitectura     | Media | Medio | Separar servicios y contratos de entrada/ 
|                                                                                                    | salida                                        |
| Ausencia de pruebas automatizadas                      | Código / Calidad          | Alta  | Medio | Incorporar pruebas unitarias y de integracion |
|----------------------------------------------------------------------------------------------------------------------------------------------------|

---

## 13. Plan de Mejora por Semana

Indiquen cómo evolucionará el proyecto durante el módulo.

## 13. Plan de Mejora por Semana

El plan de mejora por semana se definió con base en el estado actual del proyecto, priorizando primero que el flujo principal del sistema funcione correctamente y después reforzando calidad, despliegue, seguridad y documentación.

| Semana | Mejora esperada | Evidencia esperada |
|----------|-----------------------------------------------------------|----------------------------------------------------------------------------------|
| Semana 1 | Diagnóstico, revisión del estado actual y definición      | Documento inicial del proyecto, problema definido, arquitectura actual,          |
|          |  de arquitectura                                          |  y objetivos backlog de tareas priorizado                                        |
| Semana 2 | Estabilizar el flujo principal del chat y                 | Chat funcional de extremo a extremo, mensajes guardados en base de datos,        |
|          |  la integracion con IA                                    |  prueba manual del endpoint `/api/chat`                                          |
| Semana 3 | Completar el módulo del psicólogo y la gestión de alertas | Dashboard básico funcional, evidencia de lectura de alertas,                     | 
|          |                                                           |  validacion de acceso por roles                                                  |
| Semana 4 | Incorporar pruebas mínimas y mejorar manejo de errores    | Pruebas básicas de utilidades o endpoints, manejo de respuestas vacías,          |
|          |                                                           |  validacion de errores y  estados de carga                                       |
| Semana 5 | Mejorar documentación, variables de entorno y             | README actualizado, archivo `.env.example`, diagramas en `docs/`, estructura     |
|          |  organizacion del repositorio                             |  del proyecto ordenada                                                           |
| Semana 6 | Preparar despliegue, revisión final y                     | Dockerfile o despliegue funcional, validación final del sistema, demo,           |
|          | defensa del proyecto                                      |  presentaciony evidencias                                                        |
|          | completas                                                 |                                                                                  |
|----------|-----------------------------------------------------------|----------------------------------------------------------------------------------|
---

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

se adjuntara un pdf con capturas

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
