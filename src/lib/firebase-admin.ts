import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIRESTORE_API_SECRET!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const firebaseAdminAuth = admin.auth();
