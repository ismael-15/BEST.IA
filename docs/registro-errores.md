# Registro de Errores y Correcciones — Semana 3

Este documento detalla los errores encontrados durante la implementación de pruebas y del pipeline CI/CD, junto con su causa y solución.

## 1. Desajuste de versiones entre Jest y ts-jest

**Error:** Al ejecutar `npm test`, TypeScript no reconocía `describe`, `it` y `expect`, mostrando el error "Cannot find name 'describe'".

**Causa:** El proyecto tenía `jest@30.4.2` pero `ts-jest@29.4.12`, versiones mayores incompatibles entre sí.

**Solución:** Alinear ambas dependencias a la misma versión mayor (`jest@29` + `ts-jest@29`), que es una combinación oficialmente soportada.

## 2. Alias de rutas no resuelto en Jest

**Error:** `Cannot find module '@/lib/validation/chatSchema' from 'tests/chatSchema.test.ts'`.

**Causa:** El proyecto usa el alias `@/` definido en `tsconfig.json` (resuelto automáticamente por Next.js), pero Jest no lo conocía.

**Solución:** Agregar `moduleNameMapper` en `jest.config.js` para mapear `@/*` a la raíz del proyecto:

```js
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/$1",
},
```

## 3. Script de pruebas faltante

**Error:** `npm test` no ejecutaba nada.

**Causa:** El `package.json` no tenía el script `"test"` definido.

**Solución:** Agregar `"test": "jest"` dentro de la sección `"scripts"`.

## 4. Versión inexistente de ts-jest en package.json

**Error:** El pipeline de GitHub Actions falló en el paso "Install dependencies" con:


**Causa:** Se había especificado `"ts-jest": "^30.0.0"` en `package.json`, una versión que no existe en el registro de npm. Localmente no se detectó porque `node_modules` ya tenía instalada una versión previa (29.4.12), pero el entorno limpio de CI sí valida la existencia real del paquete.

**Solución:** Corregir `package.json` a `"ts-jest": "^29.4.12"` y regenerar `package-lock.json` con `npm install`.

## Resultado final

Tras aplicar las 4 correcciones, el pipeline de GitHub Actions ejecuta correctamente:
- Checkout code
- Setup Node.js
- Install dependencies
- Run tests (10 pruebas pasando)

Evidencia visual disponible en `docs/evidencia-pruebas.pdf`, incluyendo la ejecución fallida original (CI #1) y la ejecución corregida exitosa (CI #2).