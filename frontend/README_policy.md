# 🧱 Frontend Architecture Guidelines (Screaming Architecture – React + JS)

Este documento define la estructura oficial que debe seguirse para **todos los módulos presentes y futuros** del proyecto frontend (Antojo24 / Domus Cloud / similares).  
Su objetivo es mantener **orden, escalabilidad y coherencia** a medida que la app crece.

---

## 🎯 Objetivo

Seguir estrictamente una **arquitectura modular (Screaming Architecture)**, donde cada módulo representa un **dominio funcional independiente** y contiene sus propios componentes, páginas, utilidades, estilos, y lógica de datos.

---

## 📂 Estructura base

```bash
src/
├── api/                        
│   ├── core/                   # Configuración global de Axios o cliente HTTP
│   ├── admin/                  # Endpoints del panel administrador
│   ├── pos/                    # Endpoints del punto de venta (POS)
│   ├── auth/                   # Endpoints de autenticación
│   ├── productos.json          # Data estática temporal
│   └── index.js
│
├── modules/
│   ├── admin/                  # Panel administrativo
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── index.js
│   │
│   ├── pos/                    # Punto de venta (POS)
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── styles/
│   │   └── index.js
│   │
│   ├── common/                 # Elementos reutilizables globales
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   └── index.js
│
├── routes/                     # Configuración de rutas
│   ├── AppRouter.jsx
│   └── PrivateRoute.jsx
│
├── App.jsx                     # Punto de entrada principal
└── main.jsx
```

---

## 🧩 Reglas por módulo

### 1. `components/`
- Contiene solo componentes visuales pertenecientes al módulo.
- No importar componentes entre módulos distintos.
- Componentes comunes van en `modules/common/components`.

### 2. `pages/`
- Cada vista de ruta principal (por ejemplo: `Dashboard`, `CierreCaja`, `Login`).
- No debe incluir lógica pesada — solo composición de componentes y hooks.

### 3. `utils/`
- Funciones puras relacionadas **solo** con el módulo.
- Ejemplo: cálculos de vuelto (`calculateChange`), formateos, validaciones internas.

### 4. `styles/`
- Hojas CSS exclusivas del módulo (`Dashboard.css`, `PrintTicket.css`, etc.)
- Evitar estilos globales salvo los definidos en `modules/common/styles`.

### 5. `api/`
- Endpoints organizados por módulo: `admin/`, `pos/`, `auth/`.
- Usar un cliente Axios central en `api/core/axios_base.js`.

### 6. `common/`
- Contiene componentes, estilos y páginas compartidas entre módulos.
- Ejemplo: `NavBar`, `Login`, `ErrorPage`.

---

## ⚙️ Convenciones de nombres

| Tipo | Convención | Ejemplo |
|------|-------------|----------|
| Componentes | PascalCase | `DashboardCard.jsx` |
| Hooks / Utils | camelCase | `usePOS.js`, `calculateChange.js` |
| Estilos | kebab-case | `print-ticket.css` |
| Archivos API | snake_case | `axios_cierre.js`, `axios_auth.js` |

---

## 🧠 Buenas prácticas

1. **Evitar imports relativos largos.** Usar alias de módulo si el bundler lo permite (`@/modules/pos/pages/...`).
2. **Mantener independencia entre módulos.** El POS no debe importar nada de `admin` directamente.
3. **Cada módulo debe poder moverse o extraerse sin romper dependencias.**
4. **No crear archivos sueltos fuera de `/modules` o `/api`.**
5. **Seguir un orden visual consistente**: `components → pages → utils → styles`.

---

## 🚀 Ejemplo visual (POS)

```bash
modules/pos/
├── components/
│   ├── PaymentModal.jsx
│   ├── OrderSummary.jsx
│   └── TicketPreview.jsx
├── pages/
│   ├── Index.jsx
│   ├── CierreCaja.jsx
│   └── PrintTicket.jsx
├── utils/
│   ├── print.js
│   ├── get_time.js
│   └── uuid-generator.js
├── styles/
│   └── PrintTicket.css
└── index.js
```

---

## ✅ Checklist para crear un nuevo módulo

1. Crear carpeta dentro de `/modules/` con el nombre del dominio (ej: `users`, `reports`, `billing`).  
2. Crear subcarpetas:
   - `components/`
   - `pages/`
   - `utils/`
   - `styles/`
3. Si el módulo se conecta a API, crear su carpeta en `/api/<modulo>/`.
4. Registrar sus rutas dentro de `routes/`.
5. Añadir alias si aplica (`@/modules/<modulo>`).

---

## 📘 Ejemplo de integración con API

```js
// src/api/pos/axios_cierre.js
import axiosBase from "../core/axios_base";

export const getCierreDelDia = () => axiosBase.get("/cierre");
export const crearCierre = (data) => axiosBase.post("/cierre", data);
```

```js
// src/modules/pos/pages/CierreCaja.jsx
import { getCierreDelDia } from "@/api/pos/axios_cierre";
import { useEffect, useState } from "react";

export default function CierreCaja() {
  const [cierre, setCierre] = useState(null);

  useEffect(() => {
    getCierreDelDia().then((res) => setCierre(res.data));
  }, []);

  return <div>Cierre de caja actual: {cierre?.monto_total}</div>;
}
```

---

## 🔐 Estándares de calidad

- Todo nuevo módulo debe mantener esta estructura.  
- Revisar PRs con foco en **orden de carpetas y consistencia**.  
- No usar carpetas genéricas como `helpers`, `shared`, o `misc`.  
- Toda función global debe ir en `common/` o `api/core/`.

---

## 🧭 Conclusión

Esta guía es **la referencia oficial** de organización para el frontend.  
Cualquier módulo nuevo (por ejemplo, `users`, `reports`, `inventory`, `billing`) debe seguir **exactamente** este patrón para asegurar mantenibilidad, orden y escalabilidad.

---
