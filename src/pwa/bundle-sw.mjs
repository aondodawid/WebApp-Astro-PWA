import * as esbuild from "esbuild";
import config from "../../pwa.config.json" with { type: "json" };
console.log("🚀 ~ config:", config);
// import { loadEnv } from "vite";
// const { VITE_SETTINGS } = loadEnv(process.env.NODE_ENV, process.cwd(), "");
import { VITE_SETTINGS2 } from "astro:env/server";
// console.log("🚀 ~ VITE_SETTINGS2:", VITE_SETTINGS2)

console.log("process.env.settings", process.env.settings);
const globPath = "src/pwa";
const settings = {
  strategy: config.strategy || "StaleWhileRevalidate",
  cacheAssets: config.cacheAssets || "static_assets",
  disableDevLogs: config.disableDevLogs || true,
};

// bundle the sw file for browser use
await esbuild.build({
  entryPoints: [`${globPath}/sw.js`],
  outfile: `public/sw.js`,
  target: ["esnext"],
  bundle: true,
  minify: false,
  allowOverwrite: true,
  sourcemap: true,
  format: "esm",
  define: {
    "process.env.settings": JSON.stringify(settings),
  },
});
