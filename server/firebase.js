import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

const Firebase_sdk = JSON.parse(process.env.FIREBASE_SDK);

admin.initializeApp({
  credential: admin.credential.cert(Firebase_sdk),
  storageBucket: "filezone-ab5bd.firebasestorage.app",
});

const bucket = admin.storage().bucket();
export { admin, bucket };
