import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute, Route } from "workbox-routing";
import * as navigationPreload from "workbox-navigation-preload";
import { googleFontsCache } from "workbox-recipes";
import {
  NetworkOnly,
  CacheOnly,
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from "workbox-strategies";

const SETTINGS = process.env.settings;
const STRATEGY = SETTINGS.strategy;
const CACHE_ASSETS = SETTINGS.cacheAssets;
const DISABLE_DEV_LOGS = SETTINGS.disableDevLogs;
const scripts = SETTINGS.scripts;
const notification = SETTINGS.notification;
const saveSubscriptionPath = SETTINGS.saveSubscriptionPath;
const applicationServerKey = SETTINGS.applicationServerKey;

async function runNotifications() {
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };
  const saveSubscription = async (subscription) => {
    const response = await fetch(saveSubscriptionPath, {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(subscription),
    });

    return response.json();
  };

  const handleSubscription = async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
    });
    saveSubscription(subscription);
  };

  self.addEventListener("activate", handleSubscription);

  const getNotification = async (event) => {
    console.log("notify");
    console.log("notification :>> ", event.data);
    let notification = { title: "Notification", body: "", icon: "", url: "/" };
    if (event.data) {
      try {
        notification = event.data.json();
      } catch {
        // fallback if not JSON
        notification.body = event.data.text();
      }
    }
    event.waitUntil(
      self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon,
        data: { notifURL: notification.url },
      }),
    );
  };
  self.addEventListener("push", getNotification);

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.notifURL || "/";
    event.waitUntil(clients.openWindow(url));
  });
}
if (notification) runNotifications();

if (scripts?.lenght > 0) {
  scripts.forEach(function (script) {
    importScripts(script);
  });
}

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
