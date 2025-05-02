import * as esbuild from "esbuild";
import config from "../../pwa.config.json" with { type: "json" };

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
  target: ["es2020"],
  bundle: true,
  minify: false,
  allowOverwrite: true,
  sourcemap: true,
  define: {
    "process.env.settings": JSON.stringify(settings),
  },
});
