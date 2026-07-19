# Riesgos Técnicos y Deuda Técnica - BEST.IA

Este documento detalla los riesgos técnicos identificados y la deuda técnica acumulada en el proyecto BEST.IA, junto con las mitigaciones propuestas para cada uno. El objetivo es proporcionar una visión clara de los desafíos técnicos y las estrategias para abordarlos, asegurando la estabilidad, seguridad y escalabilidad del sistema.

## 1. Riesgos Relacionados con el Modelo y Dependencias

Esta sección aborda los riesgos inherentes al uso de modelos generativos y las dependencias externas críticas.

### 1.1. Fallos del Proveedor Generativo o Respuestas 500

- **Categoría:** Modelo / Dependencias

- **Probabilidad:** Alta

- **Impacto:** Alto

- **Mitigación propuesta:** Implementar un sistema de *fallback* seguro, con reintentos controlados y la posibilidad de cambiar de modelo generativo en caso de fallos persistentes del proveedor principal.

### 1.2. Detección de Crisis Incompleta por Reglas Simples

- **Categoría:** Modelo / Seguridad

- **Probabilidad:** Media

- **Impacto:** Alto

- **Mitigación propuesta:** Ampliar el conjunto de palabras clave y frases para la detección de crisis, validar la efectividad con expertos en la materia y definir un protocolo de escalamiento humano para casos complejos o ambiguos.

### 1.3. Dependencia Manual del Servicio de Pysentimiento

- **Categoría:** Dependencias / Despliegue

- **Probabilidad:** Alta

- **Impacto:** Medio

- **Mitigación propuesta:** Contenerizar el servicio Python de `pysentimiento` utilizando Docker y automatizar su arranque y gestión junto con la aplicación Next.js para asegurar una integración fluida y un despliegue consistente.

## 2. Riesgos de Seguridad y Datos

Esta sección se enfoca en los riesgos asociados a la seguridad de la información y la gestión de datos sensibles.

### 2.1. Exposición de Datos Sensibles en Logs o Respuestas

- **Categoría:** Seguridad

- **Probabilidad:** Media

- **Impacto:** Alto

- **Mitigación propuesta:** Implementar mecanismos de sanitización de logs para evitar el registro de información sensible, aplicar políticas de seguridad a nivel de fila (RLS) en Supabase y revisar periódicamente las políticas de almacenamiento y acceso a datos.

### 2.2. Ausencia de RLS en Supabase

- **Categoría:** Datos / Seguridad

- **Probabilidad:** Alta

- **Impacto:** Alto

- **Mitigación propuesta:** Definir e implementar políticas de seguridad a nivel de fila (RLS) para cada tabla relevante en Supabase antes de la fase de producción, asegurando que los usuarios solo puedan acceder a los datos a los que tienen permiso.

## 3. Deuda Técnica y Calidad del Código

Esta sección aborda la deuda técnica acumulada y los aspectos relacionados con la calidad y mantenibilidad del código.

### 3.1. Acoplamiento entre Frontend y Lógica de Negocio

- **Categoría:** Código

- **Probabilidad:** Media

- **Impacto:** Medio

- **Mitigación propuesta:** Continuar con la separación de la lógica de negocio, extendiendo el patrón ya iniciado en `lib/ai/chatService.ts` y `lib/validation/chatSchema.ts` a otros módulos y componentes de la aplicación para reducir el acoplamiento y mejorar la modularidad.

### 3.2. Ausencia de Pruebas Automatizadas

- **Categoría:** Código / Calidad

- **Probabilidad:** Alta

- **Impacto:** Medio

- **Mitigación propuesta:** Incorporar pruebas unitarias y de integración en el ciclo de desarrollo, con un objetivo inicial de implementación en la Semana 3 del proyecto, para asegurar la calidad y detectar regresiones tempranamente.

## 4. Riesgos de Equipo y Configuración

Esta sección cubre los riesgos operativos y de configuración relacionados con la gestión del equipo y los procesos.

### 4.1. Registro de Psicólogos Solo Manual por Administrador

- **Categoría:** Equipo / Configuración

- **Probabilidad:** Media

- **Impacto:** Bajo

- **Mitigación propuesta:** Definir e implementar un flujo formal para la invitación o auto-registro de psicólogos, reduciendo la dependencia de la intervención manual del administrador y agilizando el proceso de incorporación.