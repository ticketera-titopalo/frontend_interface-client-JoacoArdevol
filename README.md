<!-- calidad:inicio -->
![Calidad](https://img.shields.io/badge/Calidad-37%2F100-red) ![Aprobado](https://img.shields.io/badge/Aprobado-NO-red) ![Cumple](https://img.shields.io/badge/Cumple-12%2F14-green) ![Duplicación](https://img.shields.io/badge/Duplicaci%C3%B3n-0.0%25-green) ![SEC](https://img.shields.io/badge/SEC-0-green) ![SQL](https://img.shields.io/badge/SQL-0-green) ![DBG](https://img.shields.io/badge/DBG-0-green) ![Capas](https://img.shields.io/badge/Capas-3-green) ![Tests](https://img.shields.io/badge/Tests-0-red) ![Cob](https://img.shields.io/badge/Cob-n%2Fa-lightgrey) ![Vistas](https://img.shields.io/badge/Vistas-16-green)

**Calidad de servicios (heurístico):** índice **37/100** · cumple **12/14** · aprobado **NO** · capas **3**
Detalle completo en [`docs/EVALUACION.md`](docs/EVALUACION.md).
<!-- calidad:fin -->

poner los nombres acá

## Configuración del backend

La URL de la API se configura en `.env` mediante `VITE_API_URL`, por ejemplo `http://ip-back:5000/`. Reemplazá `ip-back` por el host del backend. El prefijo `/api` se agrega en los servicios. `.env` permanece local e ignorado por Git; `.env.example` documenta la configuración.

El cliente HTTP está centralizado en `src/services/apiClient.ts` y aplica un timeout de 10 segundos. Las funciones de acceso a estado y eventos están en `src/services/events.ts`.

Para validar tipos y calidad, ejecutá `npx tsc`, `npx eslint .` y `npx vitest run`.
