import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

function addScriptsToPackageJson(scriptName, scriptValue) {
  // Get the path to the user's package.json (one level up from node_modules)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const userPackageJsonPath = path.join(__dirname, "..", "..", "package.json");

  // Only proceed if we're in node_modules
  if (fs.existsSync(userPackageJsonPath)) {
    console.log("Adding service worker scripts to package.json...");

    // Read the user's package.json
    const userPackageJson = JSON.parse(
      fs.readFileSync(userPackageJsonPath, "utf8"),
    );

    // Add your custom scripts
    userPackageJson.scripts = userPackageJson.scripts || {};

    // Add the service worker generation script
    userPackageJson.scripts[scriptName] = scriptValue;

    // Write back the updated package.json
    fs.writeFileSync(
      userPackageJsonPath,
      JSON.stringify(userPackageJson, null, 2),
    );

    console.log("✅ Scripts successfully added!");
    console.log(
      "Run npm run generateAndBundleSW to create your service worker",
    );
  }
}
addScriptsToPackageJson(
  "generateAndBundleSW",
  "SW_DIST_PATH=src/pwa npx workbox-cli injectManifest node_modules/my-new-component-directory-astro/src/pwa/workbox.config.cjs && node node_modules/my-new-component-directory-astro/src/pwa/bundle-sw.mjs",
);
