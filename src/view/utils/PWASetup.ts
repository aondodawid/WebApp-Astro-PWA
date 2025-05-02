import { isBeforeInstallPromptSupported } from "./utilities";
import type { PWAInstallPromptType } from "../../types";
import PWAInstallPrompt from "./PWAInstallPrompt";
import EventHandler from "./EventHandler";
// make me documentation for this class
/**
 * @class PWASetup
 * @param {string}
 * @param {string} installSelector - The CSS selector for the install button element.
 * @param {string} popoverId - The ID of the popover element to show installation messages.
 * @description This class handles the setup and management of the PWA installation process.
 * It initializes the PWA installation prompt, checks if the PWA is already installed,
 * and manages the display of installation messages.
 * It also provides methods to run the installation process and check if the PWA is installed.
 * @example
 * const pwaSetup = new PWASetup("#install", "mypopover");
 * pwaSetup.run();
 * // Initializes the PWA installation process and checks if the PWA is installed.
 * // If the PWA is installed, no action is taken.
 * @see {@link PWAInstallPrompt}
 * @see {@link EventHandler}
 * @see {@link isBeforeInstallPromptSupported}
 * @see {@link isPWAInstalled}
 * @see {@link renderPopover}
 * @see {@link runPWASetup}
 * @see {@link PWASetup}
 */
class PWASetup {
  private pwaInstall: PWAInstallPromptType;

  private popover: HTMLElement | null;

  private isPWAInstalled: boolean;

  constructor(
    installSelector: string = "#install",
    popoverId: string = "mypopover",
  ) {
    this.pwaInstall = new PWAInstallPrompt(installSelector);
    this.popover = document.getElementById(popoverId);

    // Initialize
    if (this.popover) this.pwaInstall.runEvents(true, this.popover);
    else this.pwaInstall.runEvents(false);
    this.isPWAInstalled = this.pwaInstall.checkIsPWAInstalled();
  }

  showInstallationMessage(id: string): void {
    const installationMessage = document.getElementById(id);
    if (!installationMessage) return;
    installationMessage.style.display = "block";
  }

  checkIsPWAInstalled(isSetupEnabled: boolean = true): void {
    if (!this.isPWAInstalled && this.popover && isSetupEnabled) {
      this.popover.showPopover();
    }
    switch (true) {
      case !this.isPWAInstalled && !isBeforeInstallPromptSupported():
        this.showInstallationMessage("installation-message");
        break;
      case !this.isPWAInstalled:
        this.showInstallationMessage("installation-page");
        break;
      case !this.isPWAInstalled && !isSetupEnabled:
        this.showInstallationMessage("id");
        break;
      default:
    }
  }

  run(isSetupEnabled: boolean = true): void {
    if (!isSetupEnabled) return;

    const eventHandler = new EventHandler(this.pwaInstall);
    this.checkIsPWAInstalled(isSetupEnabled);
    eventHandler.runEventHandler();
  }

  getInstallPrompt(): PWAInstallPromptType {
    return this.pwaInstall;
  }

  getIsInstalled(): boolean {
    return this.isPWAInstalled;
  }
}

// Update factory function to accept props
function runPWASetup(isSetupEnabled: boolean): void {
  const setup = new PWASetup();
  setup.run(isSetupEnabled);
}

export default runPWASetup;
export { PWASetup };
