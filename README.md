**Resumen**
- **Proyecto:** Link_Load
- **Tecnología:** React + TypeScript + Vite
- **Propósito:** Interfaz para convertir y descargar enlaces (herramienta interna llamada Link-Load).

**Qué hay en el repositorio**
- **Código fuente:** [src/](src)
- **Entradas y configuración:** [index.html](index.html), [vite.config.ts](vite.config.ts)
- **Recursos públicos:** [public/](public) — iconos, `site.webmanifest`, `robots.txt`, `sitemap.xml`
- **Scripts útiles:** [scripts/generate-icons.ps1](scripts/generate-icons.ps1) y [scripts/generate-icons-with-sharp.js](scripts/generate-icons-with-sharp.js)

**Cómo ejecutar el proyecto (desarrollo)**
```bash
npm install
npm run dev
```

Abre `http://localhost:5173` (u otra dirección que indique Vite) para ver la app en desarrollo.

**Cómo construir para producción**
```bash
npm run build
npm run preview
```

**Generar iconos (favicon, 192x192, 512x512)**
- Si prefieres usar la versión Node (sin ImageMagick):
```bash
npm install
npm run generate-icons
```
- Si tienes ImageMagick instalado puedes usar PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\generate-icons.ps1
```

Generará en `public/`: `icon-192.png`, `icon-512.png`, `favicon.ico`.

**SEO / PWA: qué ya añadí**
- `index.html` incluye meta tags de SEO, Open Graph, Twitter Card y JSON-LD.
- `public/site.webmanifest` creado para PWA.
- `public/robots.txt` y `public/sitemap.xml` creados (recuerda cambiar la URL del `sitemap.xml` por tu dominio real).

**Sugerencias y próximos pasos**
- Cambia los textos (título, descripción) en [index.html](index.html) por tu copy final.
- Sustituye la URL en [public/sitemap.xml](public/sitemap.xml) por tu dominio real.
- Ejecuta Lighthouse (DevTools → Lighthouse) para verificar accesibilidad, SEO y PWA.
- Opcional: agregar `meta name="twitter:creator"` con tu usuario de Twitter.

**Contacto / Autor**
- Proyecto creado por Sathaniel99 — mejora y personaliza según necesites.

Gracias por usar Link-Load. Si quieres, puedo:
- Añadir un badge de versión/estado en este `README.md`.
- Publicar en GitHub Pages (configurar `gh-pages`).
- Preparar un `Dockerfile` para despliegue.

