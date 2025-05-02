# WebApp Astro PWA

A ready-to-use Astro component library for adding Progressive Web App (PWA) support to your Astro projects. This package provides drop-in components and utilities for manifest injection, service worker registration, install prompts, and more.


---

## 🚦 Supercharge Your Astro App with PWA!

Boost your Astro project’s performance and user experience by enabling Progressive Web App (PWA) features. With WebApp Astro PWA, your site loads faster, works offline, and can be installed directly to users’ devices—just like a native app.

- **Faster Load Times:** Assets are cached for instant loading, even on slow or unreliable networks.
- **Offline Support:** Your app remains accessible and functional without an internet connection.
- **Installable Experience:** Users can add your app to their home screen for quick access, increasing engagement and retention.
- **Native-like Feel:** Deliver a seamless, app-like experience with push notifications, background sync, and more.

**Empower your Astro project with PWA capabilities and stand out with a modern, high-performance web app!**

---

## ✨ Features

- **Easy PWA Integration**: Add PWA support to any Astro project with minimal setup.
- **Customizable Install UI**: Includes install button, popover, and installation messages.
- **Manifest & Meta Tags**: Auto-injects manifest and meta tags from config.
- **Service Worker**: Bundles and registers a Workbox-powered service worker.
- **Configurable Strategies**: Choose caching strategies and assets via `pwa.config.json`.
- **TypeScript Support**: Fully typed for safer integration.

---

## 🚀 Project Structure

Your project will include the following files and folders:

```text
/
├── index.ts
├── src/
│   ├── PWA.astro
│   ├── PWABtn.astro
│   ├── PWASetupWindow.astro
│   ├── types.ts
│   ├── manifest_imgs/
│   └── pwa/
│       ├── bundle-sw.mjs
│       ├── index.ts
│       ├── PoweredWebAppBuilder.ts
│       ├── setup.js
│       ├── sw.js
│       ├── utilities.ts
│       └── workbox.config.cjs
│   └── view/
│       ├── PopoverSupport.ts
│       ├── components/
│       │   ├── InstallationMessage.astro
│       │   ├── InstallationPage.astro
│       │   ├── InstallBtn.astro
│       │   ├── MetaServiceWorker.astro
│       │   └── ServiceWorkerRegistration.astro
│       └── utils/
│           ├── EventHandler.ts
│           ├── PWAInstallPrompt.ts
│           ├── PWASetup.ts
│           └── utilities.ts
├── pwa.config.json
├── package.json
├── setup.js
└── README.md
```

---

## 🛠️ Installation

```sh
npm install webapp-astro-pwa
```

After install, the setup script will automatically add a `generateAndBundleSW` script to your project's `package.json`.

---

## ⚡ Usage

### 1. Add the PWA Components

Import and use the main components in your Astro pages/layouts:

```astro
---
import { PWA, PWABtn, PWASetupWindow } from "webapp-astro-pwa";
---

<PWA /> <!-- Injects manifest/meta and registers service worker -->
<PWASetupWindow
  title="Install Our App"
  description="Get the best experience by installing our app."
  btnText="Install"
  btnBackground="#4361ee"
  background="#fff"
  hideSvg={false}
/>
```

Or, for a simple install button:

```astro
<PWABtn btnText="Install App" btnBackground="#3a0ca3" hideSvg={false} />
```

### 2. Configure Your PWA

Edit [`pwa.config.json`](pwa.config.json) at the root of your project to customize manifest, icons, meta tags, caching strategy, and more.

Example:

```json
{
  "isInstallBtnVisible": true,
  "createManifest": true,
  "cacheAssets": "static-assets",
  "disableDevLogs": true,
  "isManifest": true,
  "manifestPath": "manifest.json",
  "strategy": "CacheFirst",
  "manifest": {
    /* ... */
  },
  "icons": [
    /* ... */
  ],
  "meta": [
    /* ... */
  ]
}
```

---

## 🧩 Components

- [`PWA`](src/PWA.astro): Injects manifest/meta and registers the service worker.
- [`PWABtn`](src/PWABtn.astro): Standalone install button.
- [`PWASetupWindow`](src/PWASetupWindow.astro): Full install popover with customizable UI.
- [`InstallBtn`](src/view/components/InstallBtn.astro): The install button UI.

---

## ⚙️ Service Worker

To (re)generate and bundle your service worker, run:

```sh
npm run generateAndBundleSW
```

This uses Workbox and your config to inject the manifest and bundle the service worker to `public/sw.js`.

---

## 📝 TypeScript

Type definitions for configuration and component props are available in [`src/types.ts`](src/types.ts).

---

## 📄 License

MIT

---

## 🙋‍♂️ Contributing

Feel free to open issues or PRs for improvements and bug fixes.

---

## 📚 Further Reading

- [Astro Documentation](https://docs.astro.build/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
- [Workbox](https://developer.chrome.com/docs/workbox/)
