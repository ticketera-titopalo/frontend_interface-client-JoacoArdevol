<!-- calidad:inicio -->
![Calidad](https://img.shields.io/badge/Calidad-57%2F100-orange) ![Cumple](https://img.shields.io/badge/Cumple-11%2F15-yellow) ![Aprobado](https://img.shields.io/badge/Aprobado-NO-red)

**Calidad de servicios (heurístico):** índice **57/100** · cumple **11/15** · aprobado **NO** · capas **2**
`SEC 0 · SQL 0 · DBG 0 · duplicación 0.0% · vistas 6 · tests 0`
<!-- calidad:fin -->

poner los nombres acá

## Configuración del backend

La URL de la API se configura con `VITE_API_URL`; no está fijada en los componentes. Copiá `.env.example` como `.env` y reemplazá `192.168.1.100` por la IP LAN del equipo donde corre el backend. Conservá el puerto y el prefijo `/api` que correspondan a esa instalación. El `.env` local está ignorado por Git.

El cliente HTTP está centralizado en `src/services/apiClient.ts` y aplica un timeout de 10 segundos. Las funciones de acceso a estado y eventos están en `src/services/events.ts`.

Para validar los tipos, ejecutá `npx tsc` o `npm run typecheck`.
