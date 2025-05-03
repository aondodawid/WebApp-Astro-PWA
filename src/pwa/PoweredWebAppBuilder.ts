import type { Config } from "../types";
import fs from "fs";
import {
  checkIsFileExistsInRoot,
  generateManifestFile,
  runShellCommand,
  getConfigJSON,
  checkIsPWAConfigChanged,
  updatePWAConfig,
  getPWAConfigPathFromGrandparent,
} from "./utilities";

/**
 * @param config - The configuration object to apply.
 * @returns The updated or existing configuration object.
 * @description
 * Applies configuration changes to the PWA config file if necessary.
 * - Reads the current PWA config from the grandparent directory.{@link getPWAConfigPathFromGrandparent}, {@link getConfigJSON}.
 * - Compares it with the provided config.{@link checkIsPWAConfigChanged}.
 * - If changes are detected, runs a shell command {@link runShellCommand} to regenerate and bundle the service worker,
 *   updates the config file, and returns the updated config.
 * - If no changes are detected, returns the existing config.
 * - If the config file does not exist, returns the provided config {@link updatePWAConfig}.
 */
function applyConfigurationsToFile(config: Config): Config {
  console.log("🚀 ~ applyConfigurationsToFile ~ config:", config);
  const PWAConfigFilePath = getPWAConfigPathFromGrandparent("pwa.config.json");
  console.log(
    "🚀 ~ applyConfigurationsToFile ~ PWAConfigFilePath:",
    PWAConfigFilePath,
  );

  if (PWAConfigFilePath && fs.existsSync(PWAConfigFilePath)) {
    const pwaConfigJSON = getConfigJSON(PWAConfigFilePath);

    const isSWFileExists = checkIsFileExistsInRoot("public/sw.js");

    if (!isSWFileExists) {
      runShellCommand("npm run generateAndBundleSW");

      return pwaConfigJSON;
    }
    const isFileChanged: boolean = checkIsPWAConfigChanged(
      config,
      pwaConfigJSON,
    );
    console.log(
      "🚀 ~ applyConfigurationsToFile ~ isFileChanged:",
      isFileChanged,
    );
    if (!isFileChanged) return pwaConfigJSON;
    const finalConfigJSON = updatePWAConfig(pwaConfigJSON, config);
    const pwaConfigFilePath =
      getPWAConfigPathFromGrandparent("pwa.config.json");
    if (pwaConfigFilePath && fs.existsSync(pwaConfigFilePath)) {
      fs.writeFileSync(
        pwaConfigFilePath,
        JSON.stringify(finalConfigJSON, null, 2),
      );
    }
    return finalConfigJSON;
  }
  return config;
}

/**
 * @param config - The configuration object for the integration.
 * @returns An Astro integration object with setup hooks.
 * @description
 * Astro integration builder for the powered web app.
 * - Applies configuration changes to the PWA config file.
 * - Optionally generates a manifest file if requested in the config.
 * - Injects the manifest file into the page if the configuration indicates it should be used.
 *  {@link applyConfigurationsToFile}
 *
 */
export default function PoweredWebAppBuilder(config: Config) {
  return {
    name: "astro-hello",
    hooks: {
      "astro:config:setup": async () => {
        const configurationObject = await applyConfigurationsToFile(config);
        console.log(
          "🚀 ~ PoweredWebAppBuilder ~ configurationObject:",
          configurationObject,
        );

        runShellCommand("npm run generateAndBundleSW");

        if (config?.createManifest) {
          generateManifestFile(config);
        }
      },
    },
  };
}
