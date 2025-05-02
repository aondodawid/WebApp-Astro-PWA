function supportsPopover() {
  return HTMLElement.prototype.hasOwnProperty("popover");
}

function checkIsPopoverSupport() {
  if (!supportsPopover()) {
    try {
      const popoverScript = require("./js/popover.min.js");
      console.log("Popover script loaded:", popoverScript);
    } catch (error) {
      console.error("Failed to load popover script:", error);
    }
  }
}
export default checkIsPopoverSupport;
