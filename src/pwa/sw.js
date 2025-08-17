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
let { applicationServerKey } = SETTINGS;
const { isFirebaseMessaging } = SETTINGS;

/**
 * Dynamically imports additional scripts into the Service Worker.
 * @param {Array<string>} scripts - Array of script URLs to import.
 */
function addScriptsToSW(scripts) {
  if (scripts && scripts.length > 0) {
    scripts.forEach((script) => {
      importScripts(script);
    });
  }
}
/**
 * Handles web push notifications, including subscription and notification events.
 */
(function runNotifications() {
  /**
   * Converts a Base64 string to a Uint8Array.
   * @param {string} base64String - The Base64 string to convert.
   * @returns {Uint8Array} - The converted Uint8Array.
   */
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  /**
   * Sends the subscription object to the server.
   * @param {PushSubscription} subscription - The subscription object.
   * @param {Object} body - The request body containing subscription details.
   * @returns {Promise<Object>} - The server response.
   */
  const saveSubscription = async (saveSubscriptionPath, body) => {
    const response = await fetch(saveSubscriptionPath, body);
    const data = await response.json();
    return data;
  };
  async function fetchData(url = "", params = "") {
    try {
      const res = await fetch(url + params);
      if (!res.ok) throw new Error("sm fetch data failed");
      const data = await res.text();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Handles the subscription process for push notifications.
   */
  const handleSubscription = async () => {
    if (Notification.permission !== "granted") return;
    if (applicationServerKey.includes("http")) {
      applicationServerKey = (await fetchData(applicationServerKey)) || applicationServerKey;
    }
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(applicationServerKey),
    });

    const body = {
      method: "post",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(subscription),
    };
    if (!saveSubscriptionPath) return;
    saveSubscription(saveSubscriptionPath, body);
  };

  /**
   * Handles incoming push notifications and displays them.
   * @param {PushEvent} event - The push event.
   */
  const getNotification = async (event) => {
    let notifications = {
      title: "Notification",
      body: "",
      icon: "",
      badge: "",
      image: "",
      actions: [],
      vibrate: [],
      sound: "",
      url: "/",
    };
    if (event && event?.data) {
      try {
        notifications = event.data.json();
      } catch {
        // fallback if not JSON
        notifications.body = event.data.text();
      }
    }
    const options = {
      body: notifications.body,
      icon: notifications.icon || notifications.image,
      data: { notifURL: notifications.url },
      badge: notifications.badge,
      vibrate: notifications.vibrate,
      sound: notifications.sound,
      image: notifications.image,
      actions: notifications.actions,
    };
    event?.waitUntil(
      self.registration.showNotification(notifications.title || "Notification", options)
    );
  };

  /**
   * Handles messages to subscribe to push notifications.
   * @param {MessageEvent} event - The message event.
   */
  function getNotificationAcceptMessage(event) {
    getNotification();
    if (isFirebaseMessaging) return;
    if (!("serviceWorker" in navigator)) {
      return;
    }
    if (!("PushManager" in window)) {
      return;
    }
    if (Notification.permission !== "granted") return;
    if (event.data && event.data.action === "subscribeWEBAppPWA") {
      handleSubscription();
    }
  }

  /**
   * Handles notification click events and opens the associated URL.
   * @param {NotificationEvent} event - The notification click event.
   */
  function handleNitificationClick(event) {
    event.notification.close();
    const url = event.notification.data?.notifURL || "/";
    event?.waitUntil(self.clients.openWindow(url));
  }

  /**
   * Registers event listeners for push notifications.
   */
  function runNotificationsEventsListeners() {
    self.addEventListener("message", getNotificationAcceptMessage);
    self.addEventListener("push", getNotification);
    self.addEventListener("notificationclick", handleNitificationClick);
    if (isFirebaseMessaging) return;
    self.addEventListener("activate", () => {
      handleSubscription();
    });
  }

  if (notification) runNotificationsEventsListeners();
})();

/**
 * Configures caching strategies and routes using Workbox.
 */
function workboxCacheAssets() {
  cleanupOutdatedCaches();
  googleFontsCache();

  // INFO: turn off logging
  // eslint-disable-next-line no-underscore-dangle
  self.__WB_DISABLE_DEV_LOGS = DISABLE_DEV_LOGS;

  // Precache the manifest
  precacheAndRoute(self.__WB_MANIFEST);

  // Enable navigation preload
  navigationPreload.enable();

  // Create a navigation route with a Network-first strategy
  const navigationRoute = new NavigationRoute(
    new NetworkFirst({
      cacheName: "navigations",
    })
  );
  registerRoute(navigationRoute);

  /**
   * Returns the caching strategy based on the configured strategy.
   * @returns {WorkboxStrategy} - The caching strategy.
   */
  // INFO: Possible strategies is CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate

  function returnStrategy() {
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

  // Create a route for static assets with a caching strategy
  const staticAssetsRoute = new Route(
    ({ request }) =>
      ["image", "script", "style"].includes(request.destination) ||
      request.origin === "https://fonts.googleapis.com",
    returnStrategy()
  );
  registerRoute(staticAssetsRoute);

  // Create a route for Google Fonts with a Cache-first strategy
  const googleFontsRoute = new Route(
    ({ url }) => url.origin === "https://fonts.gstatic.com",
    new CacheFirst({
      cacheName: "google-fonts-stylesheets",
    })
  );
  registerRoute(googleFontsRoute);
}

addScriptsToSW(scripts);
workboxCacheAssets();
