# Sin Remordimiento

[![Deploy](https://github.com/MHenriquezCA/sin-remordimiento/actions/workflows/deploy.yml/badge.svg)](https://github.com/MHenriquezCA/sin-remordimiento/actions/workflows/deploy.yml)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Hosting-222222?logo=githubpages&logoColor=white)

**Sazón Celestial** — Sitio informativo de comida casera: sopas los fines de semana.

Sitio en producción: https://mhenriquezca.github.io/sin-remordimiento/

## Descripción

Página informativa estática, sin backend. Presenta el menú del fin de semana,
precios, próxima fecha de venta y pedidos por WhatsApp.

Proyecto hermano de Sueños al Horno. Infraestructura y objetivos separados;
solo comparten el estándar de desarrollo de MHenriquez CA.

## Requisitos

- Node.js 22 LTS
- npm 10+

## Instalación

```bash
git clone https://github.com/MHenriquezCA/sin-remordimiento.git
cd sin-remordimiento
npm ci
npm run dev
```

El servidor de desarrollo queda en `http://localhost:5173/sin-remordimiento/`.
Escucha en todas las interfaces (`--host`) para pruebas en dispositivos de la red local.

## Scripts

| Script | Uso |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve `dist/` en local tal como lo serviría Pages |

## Variables de entorno

No aplica. El sitio no usa variables de entorno.

## Tests

No aplica en la fase estática. La verificación es `npm run build` sin errores
y `npm run preview` antes de cada merge a `master`.

## Deploy

Automático con GitHub Actions (`.github/workflows/deploy.yml`):

1. Push a `master`.
2. Actions instala con `npm ci` y compila con `npm run build` (Node 22).
3. Publica `dist/` en GitHub Pages.

`dist/` no se versiona: el build lo genera Actions en cada deploy.

**Ruta base:** `vite.config.js` define `base: '/sin-remordimiento/'` porque Pages
sirve el sitio en un subdirectorio. Con dominio propio, `base` vuelve a `'/'`.

## Estructura

```text
├── .github/workflows/deploy.yml   Deploy a Pages
├── docs/                          Documentación y material de marca (fuera del build)
├── src/
│   ├── main.js                    Punto de entrada JS
│   └── styles/app.css             Tailwind v4 y tokens de marca
├── index.html                     Punto de entrada de Vite
└── vite.config.js
```

## Flujo de trabajo

- GitHub Flow: `master` es producción. Todo cambio entra por rama corta
  (`feature/`, `fix/`, `chore/`, `docs/`) con merge `--no-ff`.
- Issue antes de rama. Commits semánticos en español con referencia al issue:
  `tipo: descripción (#N)`.
- Formato: 4 espacios, LF (`.editorconfig` y `.gitattributes`).

## Horizonte

Cuando el menú o el inventario necesiten editarse sin tocar código, el proyecto
migra a Laravel Fase I con panel admin. Los componentes Tailwind se portan a Blade.

---

Created by [mhenriquez.com](https://mhenriquez.com)