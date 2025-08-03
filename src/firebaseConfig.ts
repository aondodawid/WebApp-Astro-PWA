// notifications
import admin from "firebase-admin";
import { signInWithCustomToken } from "firebase/auth";
import pwaOptions from "../pwa.config.json";

type PWAOptions = {
  fcmServiceAccountKey: object;
};

let messaging = null;
let auth = null;

const fcmServiceAccountKey =
  (pwaOptions?.fcmServiceAccountKey as PWAOptions["fcmServiceAccountKey"]) || null;
if (fcmServiceAccountKey) {
  // Only initialize if no apps have been initialized yet
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(fcmServiceAccountKey as admin.ServiceAccount),
    });
  }

  auth = admin.auth();

  messaging = admin.messaging();
}

export { messaging, auth, signInWithCustomToken };
