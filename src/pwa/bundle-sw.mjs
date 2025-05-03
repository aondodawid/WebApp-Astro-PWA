import config from "../../pwa.config.json" with { type: "json" };
import * as esbuild from "esbuild";

const globPath = "src/pwa";
const settings = {
  strategy: config.strategy,
  cacheAssets: config.cacheAssets,
  disableDevLogs: config.disableDevLogs,
  scripts: config.scripts,
  notification: config.notification,
  saveSubscriptionPath: config.notification,
  applicationServerKey: config.notification,
};

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
