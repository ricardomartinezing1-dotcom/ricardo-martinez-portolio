# Portfolio de Ricardo Martínez — Contexto del proyecto (handoff)

> Documento para pasar a una nueva conversación de Claude sin gastar tokens re-explorando.
> Última actualización: 2026-08-05 · Rama: `main` · Último commit: `c0e29fb`

---

## 1. Qué es

Portfolio personal de un **product designer** (español). Web de una sola página (`index.html`)
+ 3 páginas de case study estáticas. **Sin build step**: React y JSX se compilan en el navegador
con Babel standalone. Bilingüe **EN/ES**.

**Repo remoto:** `https://github.com/ricardomartinezing1-dotcom/rm-portfolio.git`
**Working dir:** `…/Claude-portfolio/Portofolio`

### ⚠️ REGLA PERMANENTE (respétala siempre)
**Nunca hagas `git commit` ni `git push` a menos que el usuario lo pida explícitamente**
("haz push", "commit y push", "sí"). Trabaja, valida, y espera su confirmación.

---

## 2. Stack

- **React 18.3.1** + **Babel standalone** (JSX en el navegador, dentro de `<script type="text/babel">` en `index.html`)
- **GSAP 3.12.7** — animaciones, ScrollTrigger, transiciones de página tipo "grid-shutter"
- **WebGL** — simulación de fluido/ripple que refracta el título de la sección AI (`fluid-sim.js`)
- Sin bundler, sin npm en runtime. Solo archivos estáticos servidos tal cual.

### Servidor de desarrollo
```bash
python3 -m http.server 8000
```
Luego abrir `http://localhost:8000/index.html`. (Verificación se hizo con el Browser pane del IDE.)

---

## 3. Estructura de archivos

```
index.html            ← home SPA completa (3028 líneas): React+JSX inline en <script type="text/babel">
homecheck.html        ← case study estático
optimus.html          ← case study estático
vega.html             ← case study estático

assets/
  css/
    shell.css              ← nav + footer + language toggle + cursor (compartido por TODAS las páginas)
    case-study-tokens.css  ← design tokens (colores, tipografía, spacing) para case studies
    case-study.css         ← estilos de las páginas de case study
  js/
    shell.js          ← window.PortfolioShell: Nav, Footer, LangToggle, LanguageProvider, useT, CursorDot
    fluid-sim.js      ← simulación WebGL del título de la sección AI
    page-transition.js← transiciones grid-shutter entre páginas (GSAP)
    page-i18n.js      ← i18n para las páginas estáticas (swap de atributos data-i18n-es)
    case-study.js     ← lógica compartida de case studies
  fonts/
    JetBrainsMono-VariableFont_wght.ttf   ← única fuente local (mono)
  caratulas/          ← portadas de proyectos (jpg/png/mp4)
  case studies/       ← imágenes de cada case study (Optimus, Vega, homecheck)
  Curriculum/         ← CV en EN y ES (PDF)
  hero/  side-projects/  favicon.svg
```

Nota: fuentes **Inter** y **Fraunces** (.ttf) fueron **eliminadas** — ya no se usan.

---

## 4. Arquitectura compartida ("shell")

Nav, footer, toggle de idioma y cursor viven en **`shell.js`** y se exponen como
`window.PortfolioShell`. El CSS correspondiente está en **`shell.css`**. Todas las páginas
(home + case studies) consumen el mismo shell, así el nav/footer es idéntico en todas partes.

- El home (`index.html`) importa componentes desde `window.PortfolioShell`.
- Antes había CSS de nav **duplicado** dentro de `index.html`; se eliminó. Ahora el nav lo
  estiliza **solo** `shell.css`. (Si vuelves a ver reglas de nav en index, es un regreso del bug.)

---

## 5. Internacionalización (i18n)

- **Home:** objeto `TRANSLATIONS` (en/es) en `shell.js`. Hook `useT()` + `LanguageProvider`.
  Cambio de idioma → evento custom `portfolio-lang-changed` + `localStorage.lang`.
- **Case studies estáticos:** `page-i18n.js` intercambia atributos `data-i18n-es` en el DOM.
- El idioma persiste en `localStorage` con la clave `lang`.

---

## 6. Sistema de diseño — Tipografía (estado ACTUAL)

Tokens CSS (en `:root` de `index.html` y en `case-study-tokens.css`):

```css
--font-heading: 'Host Grotesk', system-ui, -apple-system, sans-serif;
--font-body:    'Geist', system-ui, -apple-system, sans-serif;
--font-sans:    'Geist', system-ui, -apple-system, sans-serif;
--font-serif:   'Host Grotesk', system-ui, -apple-system, sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, Menlo, monospace;
```

Fuentes vía Google Fonts (`css2`):
`Host Grotesk (400;500;600;700)` · `Geist (400;500)` · `JetBrains Mono (400;500)`.

**Reglas de tipografía acordadas con el usuario:**
- **Títulos** → Host Grotesk **Bold 700**. Sin la antigua combinación sans + serif-italic.
- **Body / párrafos / botones** → **Geist 400 Regular**.
- **Títulos con color uniforme:** los acentos de título (`<em>` dentro de headings) **NO van en verde**
  y heredan `color`, `letter-spacing` y `font-size` del resto del título (mismo aspecto).
- **EXCEPCIÓN intencionada:** la palabra **"AI"** en la sección *"Where AI fits in my process"*
  **SÍ conserva su relleno degradado** (verde→lima). No la conviertas en texto plano.

Los bloques de override de tipografía están **al final** de `index.html` (`<style>`),
`shell.css` y `case-study.css`. La clase `.ai-ai` está **excluida a propósito** del bloque de
acentos para que sobreviva su degradado.

### El degradado de "AI"
- **CSS** (`.ai-ai`): `linear-gradient(228deg, #364A2C -39.76%, #02734A -13.52%, #B8F300 110.32%)`
  con `-webkit-background-clip: text; color: transparent;`
- **Canvas** (`fluid-sim.js`, función `buildContent`): el título se dibuja en un canvas 2D que
  luego el WebGL refracta. "AI" se pinta con `createLinearGradient` (stops `#364A2C @0`,
  `#02734A @0.14`, `#B8F300 @1`); la línea 2 "my process" se pinta oscura `#1A1A1A`.
  **Si cambias el degradado, hay que cambiarlo en LOS DOS sitios** (CSS y canvas).

### Paleta (tokens de color)
```
--color-lima:#B8F300  --color-forest:#2D6A4F  --color-dark:#0F1A10
--color-mid:#3D5A40    --color-neutral:#F5F5F0  --color-gray:#8A9B8E
--color-border:#D6E4D9 --color-white:#FFFFFF    --color-mist:#EEF3EB
```

---

## 7. Historial reciente (qué se ha hecho)

Commits relevantes (más reciente arriba):

- `c0e29fb` **design-system**: títulos Host Grotesk 700 + body Geist 400; color de título uniforme
  (fuera el verde en keywords); se conserva el degradado de "AI"; se borran Inter/Fraunces;
  stacks de fuente directos en tokens; se elimina el CSS de nav duplicado en index.
- `2e15f39` i18n EN/ES completo en todas las páginas + fixes del cambio de idioma.
- `d069206` imágenes de Optimus + portada del home.
- `489b34c` imágenes de Vega (research grid, solución, Visit Mode).
- `5030baa` imágenes de HomeCheck; Optimus reemplaza a Radar.
- `1258771` transiciones grid-shutter, CV bilingüe, fixes mobile.
- `4857d5e` unificación de nav + footer en el shell compartido, menú mobile.
- `6f5103d` rediseño del título de la sección AI (heading de dos líneas ajustado al ancho).

### Bugs resueltos que conviene recordar
- Los pesos de fuente parecían mal → causas: (a) `var()` anidado en tokens
  (`--font-sans: var(--font-body)`) → se pasó a stacks directos; (b) sintaxis de herramienta
  filtrada `</content></invoke>` dentro de `shell.css` que invalidaba la regla siguiente → eliminada;
  (c) ~240 líneas de CSS de nav duplicado en `index.html` que pisaban a `shell.css` → eliminadas.
- El logo "Martínez" quedaba italic/verde por una regla `.nav-brand-text em` duplicada en index → resuelto al quitar el bloque duplicado.
- Títulos de "Side projects" y "Background" seguían en verde porque tenían
  `style={{ color: 'var(--color-forest)' }}` **inline** (gana al CSS) → se quitó el inline.

---

## 8. Cómo verificar cambios

Las fuentes cargan bien (comprobado con `document.fonts.check()` / `document.fonts.ready` en
navegador en vivo). Para validar tras editar:

```bash
# JSX/Babel del home compila:
node -e "const b=require('@babel/standalone'), fs=require('fs'); \
b.transform(fs.readFileSync('index.html','utf8').match(/<script type=\"text\/babel\">([\s\S]*?)<\/script>/)[1],{presets:['react']}); \
console.log('OK')"

# Sintaxis de JS suelto:
node --check assets/js/fluid-sim.js
```
Y visualmente: `python3 -m http.server 8000` + abrir en navegador, revisar
la sección AI (degradado en "AI") y los títulos (sin verde, Host Grotesk 700).

---

## 9. Estado actual

Todo commiteado y pusheado a `main` (`c0e29fb`). Árbol de trabajo limpio.
No hay tareas pendientes abiertas.
