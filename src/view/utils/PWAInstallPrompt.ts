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
 * @property {BeforeInstallPromptEvent | null} installPrompt - The install prompt event object.
 * @property {HTMLElement | null} btn - The button element that triggers the installation prompt.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
};

class PWAInstallPrompt {
  btnId: string;

  installPrompt: BeforeInstallPromptEvent | null;

  btn: HTMLElement | null;

  constructor(btnId: string) {
    this.btnId = btnId;
    this.installPrompt = null;
    this.btn = document.querySelector(this.btnId);
  }

  checkIsPWAInstalled(): boolean {
    if (isPWAInstalled()) {
      console.log("PWA is installed and running in standalone mode.");
      return true;
    }
    console.log("PWA is not installed or running in a browser tab.");
    return false;
  }

  hideButton(btn: HTMLElement): void {
    this.installPrompt = null;
    btn.setAttribute("hidden", "");
  }

  installPWABtnHandler = async (): Promise<void> => {
    if (!this.installPrompt) {
      console.log("No install prompt available");
      return;
    }
    await this.installPrompt.prompt();
    if (this.installPrompt.userChoice) {
      const result = await this.installPrompt.userChoice;
      if (result.outcome === "dismissed" || result.outcome === "accepted") {
        this.btn?.parentNode?.removeChild(this.btn);
        const modal = document.getElementById("modal");
        if (modal) modal.hidePopover();
      }
      console.log(`Install prompt was: ${result.outcome}`);
    }
  };

  beforeInstallHandler = (event: Event, btn: HTMLElement): void => {
    this.installPrompt = event as BeforeInstallPromptEvent;
    btn.removeAttribute("hidden");
  };

  runEvents = (isPopup: boolean, popup?: HTMLElement): void => {
    const installButton: HTMLElement | null = this.btn;
    if (!installButton) return;

    const beforeInstallPromptHandler = (e: Event) => {
      this.beforeInstallHandler(e, installButton);
      window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
    const appinstalledHandler = () => {
      if (isPopup && popup && typeof popup.hidePopover === "function") popup.hidePopover();
      installButton?.parentNode?.removeChild(installButton);
      window.removeEventListener("appinstalled", appinstalledHandler);
    };
    window.addEventListener("appinstalled", appinstalledHandler);
  };
}

export default PWAInstallPrompt;
