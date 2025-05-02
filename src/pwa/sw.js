/* eslint-disable no-restricted-globals */
// public/sw.js
import * as navigationPreload from "workbox-navigation-preload";
import {
  NetworkOnly,
  CacheOnly,
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from "workbox-strategies";
import { registerRoute, NavigationRoute, Route } from "workbox-routing";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { googleFontsCache } from "workbox-recipes";

const SETTINGS = process.env.settings;
const STRATEGY = SETTINGS.strategy;
const CACHE_ASSETS = SETTINGS.cacheAssets;
const DISABLE_DEV_LOGS = SETTINGS.disableDevLogs;

cleanupOutdatedCaches();
googleFontsCache();

//INFO: turn off logging
self.__WB_DISABLE_DEV_LOGS = DISABLE_DEV_LOGS;
// Precache the manifest
precacheAndRoute(self.__WB_MANIFEST);

// Enable navigation preload
navigationPreload.enable();

// Create a new navigation route that uses the Network-first, falling back to
// cache strategy for navigation requests with its own cache. This route will be
// handled by navigation preload. The NetworkOnly strategy will work as well.
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigations",
  }),
);

// Register the navigation route
registerRoute(navigationRoute);

function returnStrategy() {
  //INFO: Possible strategies is CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate

  switch (STRATEGY) {
    case "CacheFirst":
      return new CacheFirst({
        cacheName: CACHE_ASSETS,
      });
      break;
    case "CacheOnly":
      return new CacheOnly({
        cacheName: CACHE_ASSETS,
      });
      break;
    case "NetworkFirst":
      return new NetworkFirst({
        cacheName: CACHE_ASSETS,
      });
      break;
    case "NetworkOnly":
      return new NetworkOnly({
        cacheName: CACHE_ASSETS,
      });
      break;
    default:
      return new StaleWhileRevalidate({
        cacheName: CACHE_ASSETS,
      });
      break;
  }
}

// Create a route for image, script, or style requests that use a
// stale-while-revalidate strategy. This route will be unaffected
// by navigation preload.
const staticAssetsRoute = new Route(
  ({ request }) =>
    ["image", "script", "style"].includes(request.destination) ||
    request.origin === "https://fonts.googleapis.com",
  returnStrategy(),
);

// Register the route handling static assets
registerRoute(staticAssetsRoute);

const googleFontsRoute = new Route(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-stylesheets",
  }),
);

registerRoute(googleFontsRoute);
