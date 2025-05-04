import type { PWAInstallPromptType } from "../../types";

/**
 * Handles click events for the PWA install button.
 * Listens for clicks on the document and triggers the install handler if the install button is clicked.
 */
class EventHandler {
  private pwaObject: PWAInstallPromptType;

  constructor(object: PWAInstallPromptType) {
    this.pwaObject = object;
  }

  handleClickEventPWA = async (e: MouseEvent): Promise<void> => {
    if (!e.target) return;
    const target = e.target as HTMLElement;
    const installContainer = target.closest("#install");
    if (!installContainer || installContainer?.id !== "install") return;
    await this.pwaObject.installPWABtnHandler();
  };

  runEventHandler(): void {
    document.addEventListener("click", this.handleClickEventPWA);
  }
}

export default EventHandler;
