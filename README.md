# WebApp Astro PWA

A ready-to-use Astro component library for adding Progressive Web App (PWA) support to your Astro projects. This package provides drop-in components and utilities for manifest injection, service worker registration, install prompts, and more. Fully support Astro 4

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

## ⚡ BASIC Usage

### Enable Web App possibilities and features across your entire Astro app

To enable PWA features across your entire Astro app, import the `PWA` component and place it inside your main layout’s `<head>` section. This will inject the manifest, meta tags, and register the service worker automatically.

```astro
---
// new code added
import { PWA } from "webapp-astro-pwa";
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro Basics</title>
   <!-- new code added -->
    <PWA />
  </head>

```

Next Open your `astro.config.mjs` (or `astro.config.ts`) at your astro project and add the following

```js
// filepath: astro.config.mjs
import { defineConfig } from "astro/config";
// new code added
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    // new code added
    PoweredWebAppBuilder({}),
    ...
  ],
});
```

Next, build your application using the command:

```sh
npm run dev

```

This will generate the service worker file at
/
├── src/
├── ap/
├── sw.js

enabling your app to function as a web app with offline capabilities (even if it’s not yet installable as a PWA still you don't have manifest file). By default, files will be stored in the browser’s Cache Storage under the name static-assets. You can change this name in the configuration to manage cache versions and control how assets are cached and updated. This approach gives you flexibility and full control over your app’s offline experience.

```js
// filepath: astro.config.mjs
import { defineConfig } from 'astro/config';
// new code added
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    // this line changed
    PoweredWebAppBuilder({
      "cacheAssets": "static-assets_v2",
    }),
    ...
  ]
});
```

## 🧨 Usage AS PWA

### ⚡️ External Options

#### Choose Strategy

You can also choose a file fetching strategy for your PWA. Available options are: `CacheFirst`, `CacheOnly`, `NetworkFirst`, `NetworkOnly`, and `StaleWhileRevalidate` (the default is `StaleWhileRevalidate`).
For more details about these strategies, see the [Workbox documentation](https://developer.chrome.com/docs/workbox/modules/workbox-strategies).

```js
// filepath: astro.config.mjs
import { defineConfig } from 'astro/config';
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    // this line changed
    PoweredWebAppBuilder({
      "strategy": "CacheFirst",
    }),
    ...
  ]
});
```

#### Enable Workbox logs

- `"disableDevLogs": true` — enables or disables Workbox logs in the console. Set to `true` to turn off Workbox logging, or `false` to see Workbox logs during development. Default `true`

```js
// filepath: astro.config.mjs
import { defineConfig } from 'astro/config';
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    // this line changed
    PoweredWebAppBuilder({
      "disableDevLogs": false,
    }),
    ...
  ]
});
```

#### Adding Custom Scripts to the Service Worker

You can extend your service worker with additional custom scripts using the `scripts` option in your `astro.config.mjs` (or `astro.config.ts`). This allows you to modularize your service worker logic—for example, to add push notifications, analytics, or custom caching strategies—by importing extra files via `importScripts`.

##### How to Use

Add a `scripts` array to your `PoweredWebAppBuilder` configuration. Each entry should be a path (relative to your project root or `public/`) to a JavaScript file you want to include in the service worker.

```js
// filepath: astro.config.mjs
import { defineConfig } from "astro/config";
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    PoweredWebAppBuilder({
      // ...other options...
      scripts: ["./src/pwa/custom-sw-script.js", "./src/pwa/analytics-sw.js"],
    }),
  ],
});
```

All scripts listed will be injected at the top of your generated `sw.js` using `importScripts`:

```js
// In the generated sw.js
importScripts("./src/pwa/custom-sw-script.js", "./src/pwa/analytics-sw.js");
// ...rest of the service worker code...
```

**Tip:**
Use this feature to keep your service worker code clean and maintainable by splitting advanced logic into separate files.

---

### 🟣 Minimal Requirements for PWA in Astro

To make your Astro project installable as a Progressive Web App (PWA) and automatically generate a manifest file during build, update your `astro.config.mjs` (or `astro.config.ts`) as follows:

#### 1. Set the Required Options

- `isManifest: true` — ensures the manifest is used.
- `createManifest: true` — instructs the builder to generate the manifest file.
- `manifestPath: "manifest.json"` — specifies the path where the manifest will be created.
- `manifest` — the basic manifest info.
- `icons` —table of icons for add to component in head.

#### 2. Add Basic settings

Add the following to your configuration for minimal PWA support:

```js
// filepath: astro.config.mjs
import { defineConfig } from "astro/config";
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    PoweredWebAppBuilder({
      isManifest: true,
      createManifest: true,
      manifestPath: "manifest.json",
      manifest: {
        name: "My PWA Example",
        short_name: "PWAExample",
        description: "A simple Progressive Web App example.",
        start_url: "/",
        display: "standalone",
        theme_color: "#8936FF",
        icons: [
          {
            sizes: "512x512",
            src: "node_modules/webapp-astro-pwa/src/manifest_imgs/icon512x512.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "node_modules/webapp-astro-pwa/src/manifest_imgs/icon192x192.png",
            type: "image/png",
          },
        ],
      },
      icons: [
        {
          rel: "icon",
          type: "png",
          sizes: "512x512",
          href: "/webapp-astro-pwa/src/manifest_imgs/icon512x512.png",
        },
        {
          rel: "apple-touch-icon",
          type: "png",
          sizes: "192x192",
          href: "/webapp-astro-pwa/src/manifest_imgs/icon512x512.png",
        },
      ],
    }),
  ],
});
```

##### What this does

- **Enables installation** of your app as a PWA on supported devices.
- **Automatically generates** the manifest file at the specified path after building your project.
- \*\*Injects basic manifest and icons.

After updating your configuration, rebuild your application. The manifest file will be created automatically, and your app will be ready for installation as a PWA.

#### 3. Extend with Meta Information

For a complete PWA experience and optimal support on all platforms, add the following meta tags to your configuration. These tags improve installability, appearance, and integration on both Android and iOS devices:

```js
// filepath: astro.config.mjs
import { defineConfig } from "astro/config";
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    PoweredWebAppBuilder({
      isManifest: true,
      createManifest: true,
      manifestPath: "manifest.json",
      manifest: {
        name: "My PWA Example",
        short_name: "PWAExample",
        description: "A simple Progressive Web App example.",
        start_url: "/",
        display: "standalone",
        theme_color: "#8936FF",
        icons: [
          {
            sizes: "512x512",
            src: "node_modules/webapp-astro-pwa/src/manifest_imgs/icon512x512.png",
            type: "image/png",
          },
          {
            sizes: "192x192",
            src: "node_modules/webapp-astro-pwa/src/manifest_imgs/icon192x192.png",
            type: "image/png",
          },
        ],
      },
      icons: [
        {
          rel: "icon",
          type: "png",
          sizes: "512x512",
          href: "/webapp-astro-pwa/src/manifest_imgs/icon512x512.png",
        },
        {
          rel: "apple-touch-icon",
          type: "png",
          sizes: "192x192",
          href: "/webapp-astro-pwa/src/manifest_imgs/icon512x512.png",
        },
      ],
      // ...table with mete information ...
      meta: [
        {
          name: "mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "apple-mobile-web-app-capable",
          content: "yes",
        },
        {
          name: "application-name",
          content: "PWAExample",
        },
        {
          name: "apple-mobile-web-app-title",
          content: "PWAExample",
        },
        {
          name: "theme-color",
          content: "#8936FF",
        },
        {
          name: "msapplication-navbutton-color",
          content: "#8936FF",
        },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, shrink-to-fit=no",
        },
        {
          name: "msapplication-starturla",
          content: "/",
        },
      ],
    }),
  ],
});
```

### 🛎️ Additional Install Button

To enable extra installation prompts, add the following to your configuration:

```js
// filepath: astro.config.mjs
import { defineConfig } from 'astro/config';
import PoweredWebAppBuilder from "webapp-astro-pwa/pwa";

export default defineConfig({
  integrations: [
    // this line changed
    PoweredWebAppBuilder({
      "isInstallBtnVisible": true,
    }),
    ...
  ]
});
```

There are two options for displaying the install prompt:

Popup Modal: Use <PWASetupWindow /> to show a modal that blocks the page until the user interacts with the install prompt.
Simple Button: Use <PWABtn /> to add a standalone install button anywhere in your app.

Note: Not all browsers support the PWA install prompt. For unsupported browsers, a notification will be shown with instructions to install the PWA using the standard browser menu.

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

### Configure Your PWA

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

- [GitHub](https://github.com/aondodawid/WebApp-Astro-PWA)

---

## 📚 Further Reading

- [Astro Documentation](https://docs.astro.build/)
- [MDN: Progressive Web Apps](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
- [Workbox](https://developer.chrome.com/docs/workbox/)
