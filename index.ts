// Do not write code directly here, instead use the `src` folder!
// Then, use this file to export everything you want your user to access.

import { messaging, auth, signInWithCustomToken } from "./firebaseConfig";
import NotificationBtn from "./src/NotificationBtn.astro";
import PWASetupWindow from "./src/PWASetupWindow.astro";
import { sendMessageToDevice } from "./firebaseUtils";
import Firebase from "./src/Firebase.astro";
import PWABtn from "./src/PWABtn.astro";
import LoginPanel from "./src/LoginPanel.astro";
import PWA from "./src/PWA.astro";
import SendPushPage from "./src/SendPushPage.astro";
import * as run from "./src/PushApiPage";

export {
  PWA,
  PWABtn,
  PWASetupWindow,
  NotificationBtn,
  Firebase,
  LoginPanel,
  SendPushPage,
  run,
  messaging,
  auth,
  signInWithCustomToken,
  sendMessageToDevice,
};
