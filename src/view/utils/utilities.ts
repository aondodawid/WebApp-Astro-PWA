/**
 * Checks if the current browser is Chrome or Edge.
 */
function isChromeOrEdge(): boolean {
  const { userAgent } = navigator;
  return /Chrome|Edg/.test(userAgent);
}

/**
 * Checks if the beforeinstallprompt event is supported.
 */
function isBeforeInstallPromptSupported(): boolean {
  return "onbeforeinstallprompt" in window;
}

/**
 * Shows a popover by its element ID, if available.
 * @param id - The element ID of the popover.
 */
function renderPopover(id: string): void {
  const popover = document.getElementById(id) as HTMLElement | null;
  if (popover && "showPopover" in popover && typeof popover.showPopover === "function") {
    (popover as HTMLElement & { showPopover: () => void }).showPopover();
  }
}

/**
 * Checks if the app is running in standalone (PWA) mode.
 */
function isPWAInstalled(): boolean {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export { isBeforeInstallPromptSupported, renderPopover, isPWAInstalled, isChromeOrEdge };
