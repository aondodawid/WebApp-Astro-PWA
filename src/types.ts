export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed"; platform?: string }>;
}
export type PWAOptions = {
  isManifest?: boolean;
  isInstallBtnVisible?: boolean;
};
export type PWAInstallPromptType = {
  btnId: string;
  installPrompt: BeforeInstallPromptEvent | null;
  btn: HTMLElement | null;

  checkIsPWAInstalled(): boolean;
  installPWABtnHandler(): Promise<void>;
  beforeInstallHandler(event: Event, btn: HTMLElement): void;
  runEvents(isPopup: boolean, popup?: HTMLElement): void;
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
export type firebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
};
export type fcmServiceAccountKey = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
};
export type Config =
  | {
      saveSubscriptionPath?: string;
      applicationServerKey?: string;
      notification?: boolean;
      forceUpdate?: boolean;
      scripts?: string[];
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
      notificationAutoRequestPermission?: boolean;
      notificationBtn?: boolean;
      firebaseConfig?: firebaseConfig;
      fcmServiceAccountKey?: fcmServiceAccountKey;
      vapidKey?: string;
      AUTH_USER: string;
      AUTH_PASS: string;
    }
  | undefined;
