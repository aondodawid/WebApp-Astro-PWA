function supportsPopover(): boolean {
  return Object.prototype.hasOwnProperty.call(HTMLElement.prototype, "popover");
}

/**
 * Checks for popover support and dynamically loads the polyfill if needed.
 * Loads the script via DOM injection for browser compatibility.
 */
function checkIsPopoverSupport(): void {
  if (!supportsPopover()) {
    const script = document.createElement("script");
    script.src = "/src/view/js/popover.min.js";
    script.async = true;
    script.onload = () => console.log("Popover polyfill loaded");
    script.onerror = (e) =>
      console.error("Failed to load popover polyfill:", e);
    document.head.appendChild(script);
  }
}

export default checkIsPopoverSupport;
