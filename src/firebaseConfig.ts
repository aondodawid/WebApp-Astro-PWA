// notifications
import admin from "firebase-admin";
import { signInWithCustomToken } from "firebase/auth";
import pwaOptions from "../pwa.config.json";

type PWAOptions = {
  fcmServiceAccountKey: object;
};

const fcmServiceAccountKey =
  (pwaOptions?.fcmServiceAccountKey as PWAOptions["fcmServiceAccountKey"]) || null;

// Only initialize if no apps have been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(fcmServiceAccountKey as admin.ServiceAccount),
  });
}

const auth = admin.auth();

const messaging = admin.messaging();

export { messaging, auth, signInWithCustomToken };
