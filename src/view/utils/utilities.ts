function isChromeOrEdge() {
  const { userAgent } = navigator;
  return /Chrome|Edg/.test(userAgent);
}

function isBeforeInstallPromptSupported(): boolean {
  return "onbeforeinstallprompt" in window;
}

function renderPopover(id: string) {
  const popover = document.getElementById(id);
  if (popover) popover.showPopover();
}

function isPWAInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export { isBeforeInstallPromptSupported, renderPopover, isPWAInstalled };
