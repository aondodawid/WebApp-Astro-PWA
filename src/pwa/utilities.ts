import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import type { Config } from "../types";

/**
 * Returns the absolute path to 'pwa.config.json' located in the grandparent directory of the current file.
 * @param fileName - The name of the file to search for (currently unused, always returns 'pwa.config.json').
 * @returns The absolute path as a string, or undefined if not found.
 */
function getPWAConfigPathFromGrandparent(): string | undefined {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const parentDir = path.dirname(__dirname);
  const grandParentDir = path.dirname(parentDir);
  return path.join(grandParentDir, "pwa.config.json");
}

/**
 * Runs a shell command asynchronously and logs stdout, stderr, or errors to the console.
 * @param command - The shell command to execute.
 */
function runShellCommand(command: string) {
  exec(command, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      // console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
}

/**
 * Reads and parses a JSON configuration file from the given file path.
 * @param filePath - The path to the JSON file.
 * @returns The parsed JSON object.
 */
function getConfigJSON(filePath: string) {
  const pwaConfigFile = fs.readFileSync(filePath, "utf8");
  return JSON.parse(pwaConfigFile);
}

/**
 * Edits the given PWA configuration object by updating its properties with values from the provided config object.
 * Only properties defined in config will be updated.
 * @param pwaConfigJSON - The original PWA configuration object.
 * @param config - The configuration object with new values.
 * @returns The updated configuration object.
 */
function updatePWAConfig(pwaConfigJSON: Config, config: Config): Config {
  if (!config) return pwaConfigJSON;
  const pwa = { ...pwaConfigJSON };
  const allowedKeys = [
    "applicationServerKey",
    "saveSubscriptionPath",
    "isInstallBtnVisible",
    "createManifest",
    "disableDevLogs",
    "manifestPath",
    "notification",
    "forceUpdate",
    "cacheAssets",
    "isManifest",
    "manifest",
    "strategy",
    "scripts",
    "icons",
    "meta",
  ];

  allowedKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      (pwa as Record<string, unknown>)[key] = config[key as keyof Config];
    }
  });
  return pwa;
}

/**
 * Checks if any properties between the provided config and the PWA config JSON differ.
 * @param config - The configuration object to compare.
 * @param pwaConfigJSON - The existing PWA configuration object.
 * @returns True if any property differs, false otherwise.
 */
function checkIsPWAConfigChanged(config: Config, pwaConfigJSON: Config): boolean {
  if (!config || Object.entries(config).length === 0) return false;
  if (!pwaConfigJSON) return true; // Handle undefined pwaConfigJSON

  const pwaConfigJSONEntries = Object.entries(pwaConfigJSON);
  const configEntries = Object.entries(config);

  if (pwaConfigJSONEntries.length !== configEntries.length) return true;

  // Use .some to check if any property differs
  const hasChanges = pwaConfigJSONEntries.some(([key, value]) => {
    const pwaConfigJSONValue = JSON.stringify(value).trim();
    const configValue = JSON.stringify(config[key as keyof Config]).trim();
    return pwaConfigJSONValue !== configValue;
  });

  return hasChanges;
}

/**
 * Creates a manifest file at the specified path if all required properties are present in the config.
 * Logs errors if required properties are missing.
 * @param config - The configuration object containing manifestPath, isManifest, and manifest.
 */
function generateManifestFile(config: Config) {
  if (!config) {
    console.error("No config provided");
    return;
  }
  const { manifestPath, isManifest, manifest } = config;
  if (!manifestPath) console.log("Please provide a path for the manifest file");
  if (!isManifest)
    console.log("Please set the isManifest property to true for the manifest file to be generated");
  if (!manifest)
    console.log(
      "Please provide a JSON for manifest in configuration in manifest properties for file to be generated"
    );
  if (!manifestPath || !isManifest || !manifest) return;
  console.log("manifest file generated to the path: ", manifestPath);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * Checks if a file exists in the root directory of the project.
 * @param filePath - The relative path to the file from the root directory.
 * @returns True if the file exists, false otherwise.
 */

function checkIsFileExistsInRoot(filePath: string): boolean {
  const rootPath = process.cwd();
  const pathToFIle = `${rootPath}/${filePath}`;
  return fs.existsSync(pathToFIle);
}

export {
  checkIsFileExistsInRoot,
  getPWAConfigPathFromGrandparent,
  runShellCommand,
  getConfigJSON,
  updatePWAConfig,
  checkIsPWAConfigChanged,
  generateManifestFile,
};
