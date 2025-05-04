// Utility to register the service worker
/**
 * Registers the service worker if supported in the current environment.
 * @param swPath - The path to the service worker file (default: "/sw.js").
 */
export async function registerServiceWorker(
  swPath: string = "/sw.js",
): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.warn("Service Worker is not supported in this environment");
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register(swPath);
    if (registration.installing) {
      console.log("Service Worker installing");
    } else if (registration.waiting) {
      console.log("Service Worker installed");
    } else if (registration.active) {
      console.log("Service Worker active");
    }
  } catch (err) {
    console.error("Error registering service worker:", err);
  }
}
