# rt-liquid-glass

![Platform: Web](https://img.shields.io/badge/platform-web-000000)
![JavaScript](https://img.shields.io/badge/language-JavaScript-F7DF1E?logo=javascript)
[![npm version](https://img.shields.io/npm/v/%40rethink-js%2Frt-liquid-glass.svg)](https://www.npmjs.com/package/@rethink-js/rt-liquid-glass)
[![jsDelivr hits](https://data.jsdelivr.com/v1/package/npm/@rethink-js/rt-liquid-glass/badge)](https://www.jsdelivr.com/package/npm/@rethink-js/rt-liquid-glass)
[![bundle size](https://img.shields.io/bundlephobia/min/%40rethink-js%2Frt-liquid-glass)](https://bundlephobia.com/package/@rethink-js/rt-liquid-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-FFD632.svg)](https://opensource.org/licenses/MIT)

`rt-liquid-glass` is a lightweight JavaScript utility that applies an attribute-driven liquid glass effect using SVG displacement maps and CSS backdrop filters, with safe fallbacks for unsupported browsers, featuring:

- **Zero-config defaults** (works out of the box)
- Attribute-driven configuration
- Automatic browser feature detection
- Defensive fallbacks (never crashes your page)
- Support for multiple elements
- A clean global API under `window.rtLiquidGlass`
- Safe degradation on unsupported browsers
- Clear console logs for debugging and verification

**Primary inspiration:**  
https://www.ekino.fr/publications/liquid-glass-in-css-and-svg/

---

# Table of Contents

- [1. Installation](#1-installation)
  - [1.1 CDN (jsDelivr)](#11-cdn-jsdelivr)
  - [1.2 npm](#12-npm)
- [2. Quick Start](#2-quick-start)
- [3. Activation Rules](#3-activation-rules)
- [4. Configuration (HTML Attributes)](#4-configuration-html-attributes)
- [5. Multiple Elements](#5-multiple-elements)
- [6. Global API](#6-global-api)
- [7. Console Logging](#7-console-logging)
- [8. Troubleshooting](#8-troubleshooting)
- [9. License](#9-license)

---

## 1. Installation

### 1.1 CDN (jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/@rethink-js/rt-liquid-glass@latest/dist/index.min.js"></script>
```

### 1.2 npm

```bash
npm install @rethink-js/rt-liquid-glass
```

Then bundle or load `dist/index.min.js` as appropriate for your build setup.

---

## 2. Quick Start

Add the script to your page. With no configuration provided, `rt-liquid-glass` will:

- Auto-initialize itself when applicable
- Detect browser capabilities
- Apply safe defaults
- Fallback gracefully when unsupported
- Expose the global API

Example:

```html
<div rt-liquid-glass>Liquid Glass Panel</div>

<script src="https://cdn.jsdelivr.net/npm/@rethink-js/rt-liquid-glass@latest/dist/index.min.js"></script>
```

> Note: If you do not provide any `rt-liquid-glass-*` attributes, the library runs using its internal defaults.

---

## 3. Activation Rules

The library activates when **any** of the following are true:

- One or more elements with `rt-liquid-glass` are detected
- A root activation attribute exists on `<html>` or `<body>`
- No explicit opt-out is defined (auto-enable fallback)

If none are found, the library will not run.

---

## 4. Configuration (HTML Attributes)

### Core Activation

```html
<div rt-liquid-glass></div>
```

### Disable on Specific Elements

```html
<div rt-liquid-glass="false"></div>
```

---

### Core Attributes

| Attribute                         | Description                        |
| --------------------------------- | ---------------------------------- |
| `rt-liquid-glass`                 | Enables the effect                 |
| `rt-liquid-glass="false"`         | Disables effect                    |
| `rt-liquid-glass-debug`           | Enable console logging             |
| `rt-liquid-glass-disable-firefox` | Disable SVG liquid mode on Firefox |

---

### Visual Controls

| Attribute                       | Description                        |
| ------------------------------- | ---------------------------------- |
| `rt-liquid-glass-blur`          | Gaussian blur amount (px)          |
| `rt-liquid-glass-scale`         | Displacement intensity             |
| `rt-liquid-glass-map`           | Resolution cap for SVG map         |
| `rt-liquid-glass-fallback-blur` | Fallback blur when SVG is disabled |

Example:

```html
<div
  rt-liquid-glass
  rt-liquid-glass-blur="12"
  rt-liquid-glass-scale="40"
  rt-liquid-glass-map="256"
></div>
```

---

### Reveal Animation

Reveal animation is opacity-based and optional.

```html
<div rt-liquid-glass rt-liquid-glass-reveal></div>
```

Custom duration:

```html
<div rt-liquid-glass rt-liquid-glass-reveal="1.5s"></div>
```

---

### Global Styling Overrides

| Attribute                             | Description                     |
| ------------------------------------- | ------------------------------- |
| `rt-liquid-glass-base-bg`             | Background color                |
| `rt-liquid-glass-transition-ms`       | Transition duration             |
| `rt-liquid-glass-observe-threshold`   | IntersectionObserver threshold  |
| `rt-liquid-glass-observe-root-margin` | IntersectionObserver rootMargin |

---

### Advanced JSON Options

```html
<body
  rt-liquid-glass
  rt-liquid-glass-options-json='{"blur":12,"scale":50}'
></body>
```

Used for advanced or programmatic configuration.

---

## 5. Multiple Elements

`rt-liquid-glass` automatically supports multiple elements on the same page.

Each element:

- Is measured independently
- Gets its own SVG displacement filter
- Has isolated configuration
- Degrades independently if unsupported

No additional setup is required.

---

## 6. Global API

Once initialized:

```js
window.rtLiquidGlass;
```

### Methods

| Method      | Description                    |
| ----------- | ------------------------------ |
| `refresh()` | Re-scan and reapply effects    |
| `destroy()` | Remove styles, observers, SVGs |

---

### Feature Flags

```js
rtLiquidGlass.isLiquidEnabled();
rtLiquidGlass.supportsBackdrop();
```

---

## 7. Console Logging

When enabled via:

```html
<body rt-liquid-glass-debug></body>
```

The library logs:

- Browser capability detection
- Liquid vs fallback mode
- Global resolved options
- Runtime activation state

---

## 8. Troubleshooting

### Effect not visible

- Ensure `backdrop-filter` is supported
- Check Firefox fallback behavior
- Verify the element has a visible background
- Ensure there's content behind the glass

---

### Looks like a normal blur

This means SVG displacement is disabled due to:

- Browser limitations
- Firefox protection
- Manual fallback

This is expected and intentional.

---

### Nothing happens

- Ensure the script loaded
- Check console for logs
- Confirm attribute spelling

---

## 9. License

MIT License

Package: `@rethink-js/rt-liquid-glass` <br>
GitHub: [https://github.com/Rethink-JS/rt-liquid-glass](https://github.com/Rethink-JS/rt-liquid-glass)

---

by **Rethink JS** <br>
[https://github.com/Rethink-JS](https://github.com/Rethink-JS)
