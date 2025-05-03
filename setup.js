/**
 * Runs a shell command asynchronously and logs stdout, stderr, or errors to the console.
 * @param command - The shell command to execute.
 */
function runShellCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });
}

// write documentation for the function addScriptsToPackageJson

/**
 * Adds a script to the user's package.json file.
 * This function is designed to be run in the context of a Node.js module.
 * It checks if the package.json file exists in the parent directory (one level up from node_modules).
 * If it does, it adds a specified script to the scripts section of the package.json file.
 *
 * @param {string} scriptName - The name of the script to add to package.json.
 * @param {string} scriptValue - The command that the script should run.
 */

async function addScriptsToPackageJson(scriptName, scriptValue) {
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
