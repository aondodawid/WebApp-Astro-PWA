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
const { scripts } = SETTINGS;
const { notification } = SETTINGS;
const { saveSubscriptionPath } = SETTINGS;
const { applicationServerKey } = SETTINGS;

async function runNotifications() {
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      // eslint-disable-next-line no-useless-escape
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    // eslint-disable-next-line no-plusplus
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

  const handleSubscription = async () => {
    const subscription = await window.self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
    });
    saveSubscription(subscription);
  };

  window.self.addEventListener("activate", handleSubscription);

  const getNotification = async (event) => {
    console.log("notify");
    console.log("notification :>> ", event.data);
    let notifications = { title: "Notification", body: "", icon: "", url: "/" };
    if (event.data) {
      try {
        notifications = event.data.json();
      } catch {
        // fallback if not JSON
        notifications.body = event.data.text();
      }
    }
    event.waitUntil(
      window.self.registration.showNotification(notifications.title, {
        body: notifications.body,
        icon: notifications.icon,
        data: { notifURL: notifications.url },
      })
    );
  };
  window.self.addEventListener("push", getNotification);

  window.self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.notifURL || "/";
    event.waitUntil(window.self.clients.openWindow(url));
  });
}
if (notification) runNotifications();

if (scripts?.length > 0) {
  scripts.forEach(function (script) {
    importScripts(script);
  });
}

cleanupOutdatedCaches();
googleFontsCache();

// INFO: turn off logging
// eslint-disable-next-line no-underscore-dangle
window.self.__WB_DISABLE_DEV_LOGS = DISABLE_DEV_LOGS;
// Precache the manifest
precacheAndRoute(window.self.__WB_MANIFEST);

// Enable navigation preload
navigationPreload.enable();

// Create a new navigation route that uses the Network-first, falling back to
// cache strategy for navigation requests with its own cache. This route will be
// handled by navigation preload. The NetworkOnly strategy will work as well.
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "navigations",
  })
);

// Register the navigation route
registerRoute(navigationRoute);

function returnStrategy() {
  // INFO: Possible strategies is CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate
  switch (STRATEGY) {
    case "CacheFirst":
      return new CacheFirst({
        cacheName: CACHE_ASSETS,
      });
    case "CacheOnly":
      return new CacheOnly({
        cacheName: CACHE_ASSETS,
      });
    case "NetworkFirst":
      return new NetworkFirst({
        cacheName: CACHE_ASSETS,
      });
    case "NetworkOnly":
      return new NetworkOnly({
        cacheName: CACHE_ASSETS,
      });
    default:
      return new StaleWhileRevalidate({
        cacheName: CACHE_ASSETS,
      });
  }
}

// Create a route for image, script, or style requests that use a
// stale-while-revalidate strategy. This route will be unaffected
// by navigation preload.
const staticAssetsRoute = new Route(
  ({ request }) =>
    ["image", "script", "style"].includes(request.destination) ||
    request.origin === "https://fonts.googleapis.com",
  returnStrategy()
);

// Register the route handling static assets
registerRoute(staticAssetsRoute);

const googleFontsRoute = new Route(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-stylesheets",
  })
);

registerRoute(googleFontsRoute);
