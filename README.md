<!-- calidad:inicio -->
![Calidad](https://img.shields.io/badge/Calidad-45%2F100-orange) ![Aprobado](https://img.shields.io/badge/Aprobado-NO-red) ![Cumple](https://img.shields.io/badge/Cumple-11%2F15-yellow) ![Duplicación](https://img.shields.io/badge/Duplicaci%C3%B3n-0.0%25-green) ![SEC](https://img.shields.io/badge/SEC-0-green) ![SQL](https://img.shields.io/badge/SQL-0-green) ![DBG](https://img.shields.io/badge/DBG-0-green) ![Capas](https://img.shields.io/badge/Capas-2-green) ![Tests](https://img.shields.io/badge/Tests-0-red) ![Vistas](https://img.shields.io/badge/Vistas-6-orange)

**Calidad de servicios (heurístico):** índice **45/100** · cumple **11/15** · aprobado **NO** · capas **2**
Detalle completo en [`docs/EVALUACION.md`](docs/EVALUACION.md).
<!-- calidad:fin -->

poner los nombres acá

## Configuración del backend

La URL de la API se configura con `VITE_API_URL`; no está fijada en los componentes. Copiá `.env.example` como `.env` y reemplazá `192.168.1.100` por la IP LAN del equipo donde corre el backend. Conservá el puerto y el prefijo `/api` que correspondan a esa instalación. El `.env` local está ignorado por Git.

El cliente HTTP está centralizado en `src/services/apiClient.ts` y aplica un timeout de 10 segundos. Las funciones de acceso a estado y eventos están en `src/services/events.ts`.

Para validar los tipos, ejecutá `npx tsc` o `npm run typecheck`.
