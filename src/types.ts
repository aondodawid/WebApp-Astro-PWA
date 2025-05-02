export type PWAInstallPromptType = {
  btnId: string;
  installPrompt: Function;
  btn: HTMLElement | null;

  // isPWAInstalled(): boolean;
  checkIsPWAInstalled(): boolean;
  installPWABtnHandler(): Promise<void>;
  beforeInstallHandler(event: Event, btn: HTMLElement): void;
  runEvents(isPopup: boolean, popup?: HTMLElement ): void;
};

export type IMetaItem = {
  name: string;
  content: string;
};

export type IIconItem = {
  rel: string;
  type: string;
  sizes: string;
  href: string;
};

export type IPWAOptions = {
  isManifest: boolean;
  isInstallBtnVisible: boolean;
  strategy: "NetworkFirst" | "StaleWhileRevalidate" | "CacheFirst";
  meta: IMetaItem[];
  icons: IIconItem[];
};

export type PWAMeta = {
  name: string;
  content: string;
};

export type PWAIcon = {
  rel: string;
  type: string;
  sizes: string;
  href: string;
};

export type Config =
  | {
      isSetupPageEnabled?: boolean;
      createManifest?: boolean;
      cacheAssets?: string;
      disableDevLogs?: boolean;
      isManifest?: boolean;
      manifestPath?: string;
      isInstallBtnVisible?: boolean;
      strategy?: string;
      meta?: PWAMeta[];
      icons?: PWAIcon[];
      manifest?: object;
    }
  | undefined;
