import pwaOptions from "../../../pwa.config.json";
import type { Config } from "../../types";

const config: Config = pwaOptions;
/**
 * @description Service Worker utils
 * @class SWUtils
 */
export default class SWUtils {
  private checkSupport = () => {
    if (!("serviceWorker" in navigator)) {
      console.error("No support for service worker!");
      return false;
    }

    if (!("Notification" in window)) {
      console.error("No support for notification API");
      return false;
    }

    if (!("PushManager" in window)) {
      console.error("No support for Push API");
      return false;
    }
    return true;
  };

  private requestNotificationPermission = async () => {
    const notificationBtn = document.getElementById("notification-btn");

    const permission = await Notification.requestPermission();
    switch (true) {
      case permission === "granted":
        navigator.serviceWorker.ready.then((reg) => {
          reg?.active?.postMessage({ action: "subscribeWEBAppPWA" });
        });
        break;
      case permission !== "default":
        if (notificationBtn) {
          notificationBtn.removeEventListener("click", this.notificationPermissions);
          notificationBtn.parentNode?.removeChild(notificationBtn);
        }
        break;
      case permission !== "granted":
        throw new Error("Notification permission not granted");
      default:
        break;
    }
  };

  notificationPermissions = async () => {
    const isNotificationsSupported = this.checkSupport();
    if (isNotificationsSupported) await this.requestNotificationPermission();
  };

  permisionHandler() {
    if (!config?.notification) return;

    if (config?.notificationAutoRequestPermission) this.notificationPermissions();
    if (config.notificationBtn) {
      const notificationBtn = document.getElementById("notification-btn");
      if (!notificationBtn) return;
      const isPermisionDefault = Notification.permission === "default";
      if (!isPermisionDefault) {
        notificationBtn.parentNode?.removeChild(notificationBtn);
        return;
      }
      notificationBtn.addEventListener("click", this.notificationPermissions);
    }
  }

  forceUpdate() {
    if (!config?.forceUpdate) return;
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach(function (registration) {
            registration.update();
          });
        });
      });
    }
  }
}
