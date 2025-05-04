import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

/**
 * Adds a script to the user's package.json file.
 * This function is designed to be run in the context of a Node.js module.
 * It checks if the package.json file exists in the parent directory (one level up from node_modules).
 * If it does, it adds a specified script to the scripts section of the package.json file.
 *
 * @param {string} scriptName - The name of the script to add to package.json.
 * @param {string} scriptValue - The command that the script should run.
 */

function addScriptsToPackageJson(scriptName, scriptValue) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const userPackageJsonPath = path.join(__dirname, "..", "..", "package.json");

  if (fs.existsSync(userPackageJsonPath)) {
    console.log("Adding service worker scripts to package.json...");

    const userPackageJson = JSON.parse(fs.readFileSync(userPackageJsonPath, "utf8"));

    userPackageJson.scripts = userPackageJson.scripts || {};

    userPackageJson.scripts[scriptName] = scriptValue;

    fs.writeFileSync(userPackageJsonPath, JSON.stringify(userPackageJson, null, 2));

    console.log("✅ Scripts successfully added!");
    console.log("Run npm run generateAndBundleSW to create your service worker");
  }
}

// INFO: This script will add a script to the user's package.json file and run it

addScriptsToPackageJson(
  "generateAndBundleSW",
  "SW_DIST_PATH=src/pwa npx workbox-cli injectManifest node_modules/webapp-astro-pwa/src/pwa/workbox.config.cjs && node node_modules/webapp-astro-pwa/src/pwa/bundle-sw.mjs"
);
