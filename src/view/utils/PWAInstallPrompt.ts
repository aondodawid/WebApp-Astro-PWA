import { isPWAInstalled } from "./utilities";

/**
 * Handles the installation prompt for Progressive Web Apps (PWAs).
 *
 * This class manages the display and behavior of the install button, and the installation process.
 * It listens for the [`beforeinstallprompt`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent) and
 * [`appinstalled`](https://developer.mozilla.org/docs/Web/API/Window/appinstalled_event) events to show or hide the install button.
 * It also provides a method to check if the PWA is already installed.
 *
 * @class PWAInstallPrompt
 * @param {string} btnId - The CSS selector for the button element that triggers the installation prompt.
 * @property {any} installPrompt - The [`BeforeInstallPromptEvent`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent) object.
 * @property {HTMLElement | null} btn - The button element that triggers the installation prompt.
 *
 * @method checkIsPWAInstalled - Checks if the PWA is already installed. Uses [`isPWAInstalled`](../utilities.ts).
 * @method HTMLElement - Hides the install button element.
 * @method installPWABtnHandler - Handles the installation button click event. Calls [`prompt()`](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent/prompt) on the install prompt.
 * @method beforeInstallHandler - Handles the [`beforeinstallprompt`](https://developer.mozilla.org/docs/Web/API/Window/beforeinstallprompt_event) event and shows the install button.
 * @method runEvents - Sets up event listeners for the [`beforeinstallprompt`](https://developer.mozilla.org/docs/Web/API/Window/beforeinstallprompt_event) and [`appinstalled`](https://developer.mozilla.org/docs/Web/API/Window/appinstalled_event) events.
 *
 * @example
 * const pwaInstallPrompt = new PWAInstallPrompt("#install");
 * pwaInstallPrompt.runEvents();
 * // Sets up event listeners and shows the install button if the PWA is not installed.
 * // When the install button is clicked, it triggers the installation prompt.
 * // If the PWA is already installed, the install button is hidden.
 *
 * @see [MDN: beforeinstallprompt](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent)
 * @see [MDN: appinstalled](https://developer.mozilla.org/docs/Web/API/Window/appinstalled_event)
 * @see [MDN: prompt()](https://developer.mozilla.org/docs/Web/API/BeforeInstallPromptEvent/prompt)
 */

class PWAInstallPrompt {
  btnId: string;
  installPrompt: any;
  btn: HTMLElement | null;

  constructor(btnId: string) {
    this.btnId = btnId;
    this.installPrompt = null;
    this.btn = document.querySelector(this.btnId);
  }

  checkIsPWAInstalled() {
    if (isPWAInstalled()) {
      console.log("PWA is installed and running in standalone mode.");
      return true;
    }
    console.log("PWA is not installed or running in a browser tab.");
    return false;
  }

  HTMLElement(btn: HTMLElement) {
    this.installPrompt = null;
    btn.setAttribute("hidden", "");
  }

  installPWABtnHandler = async () => {
    if (!this.installPrompt) {
      console.log("No install prompt available");
      return;
    }
    const result = await this.installPrompt.prompt();
    console.log(
      "🚀 ~ PWAInstallPrompt ~ installPWABtnHandler= ~ result:",
      result,
    );
    console.log(`Install prompt was: ${result.outcome}`);
  };

  beforeInstallHandler = (event: Event, btn: HTMLElement) => {
    console.log("event", event);
    this.installPrompt = event;
    btn.removeAttribute("hidden");
  };

  runEvents = (isPopup: boolean, popup?: HTMLElement) => {
    const installButton: HTMLElement | null = this.btn;
    if (!installButton) return;

    const beforeInstallPromptHandler = (e: Event) => {
      this.beforeInstallHandler(e, installButton);
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler,
      );
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    const appinstalledHandler = () => {
      if (isPopup && popup) popup.hidePopover();
      installButton?.parentNode?.removeChild(installButton);
      window.removeEventListener("beforeinstallprompt", appinstalledHandler);
    };
    window.addEventListener("appinstalled", appinstalledHandler);
  };
}

export default PWAInstallPrompt;
