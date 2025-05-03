import { runShellCommand, addScriptsToPackageJson } from "./src/pwa/utilities";

// INFO: This script will add a script to the user's package.json file and run it
// INFO: The script will generate a service worker using Workbox and bundle it using esbuild

async function setup() {
  await addScriptsToPackageJson(
    "generateAndBundleSW",
    "SW_DIST_PATH=src/pwa npx workbox-cli injectManifest node_modules/webapp-astro-pwa/src/pwa/workbox.config.cjs && node node_modules/webapp-astro-pwa/src/pwa/bundle-sw.mjs",
  );

  runShellCommand("npm run generateAndBundleSW");
}
setup();
