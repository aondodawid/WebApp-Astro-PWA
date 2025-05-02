import type { PWAInstallPromptType } from "../../types";
/**
 * @class EventHandler class for handling PWA installation events.
 * @param {PWAInstallPromptType} object - The PWAInstallPromptType object to handle events for.
 *
 * @description
 * This class is responsible for handling click events related to the PWA installation prompt.
 * It listens for click events on the document and checks if the target element is the install button.
 * If the install button is clicked, it calls the installPWABtnHandler method of the PWAInstallPromptType object {@link PWAInstallPromptType} .
 * The class also provides a method to run the event handler.
 *
 * @example
 * const pwaInstallPrompt = new PWAInstallPromptType();
 * const eventHandler = new EventHandler(pwaInstallPrompt);
 * eventHandler.runEventHandler();
 * // Now, clicking the install button will trigger the installPWABtnHandler method .
 *
 */
class EventHandler {
  private pwaObject: PWAInstallPromptType;

  constructor(object: PWAInstallPromptType) {
    this.pwaObject = object;
  }

  handleClickEventPWA = async (e: Event) => {
    e.stopPropagation();
    if (!e.target) return;
    const target = e.target as HTMLElement;
    const installContainer = target.closest("#install");
    if (!target.closest("#install") || installContainer?.id !== "install")
      return;
    const response = this.pwaObject.installPWABtnHandler();
    console.log(
      "🚀 ~ EventHandler ~ handleClickEventPWA= ~ response:",
      response,
    );
  };

  runEventHandler() {
    document.addEventListener("click", this.handleClickEventPWA);
  }
}

export default EventHandler;
