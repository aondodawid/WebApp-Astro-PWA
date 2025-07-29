// notifications
import admin from "firebase-admin";
// import serviceAccount from "../../fcmServiceAccountKey.json" with { type: "json" };
import pwaOptions from "./pwa.config.json";
type PWAOptions = {
  fcmServiceAccountKey: object;

};

import { getAuth, signInWithCustomToken } from "firebase/auth";
let token = "";

const fcmServiceAccountKey = pwaOptions?.fcmServiceAccountKey as PWAOptions["fcmServiceAccountKey"] || null;

// Only initialize if no apps have been initialized yet
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(fcmServiceAccountKey as admin.ServiceAccount),
  });
}

const auth = admin.auth();

const messaging = admin.messaging();

export { messaging, auth, signInWithCustomToken };
