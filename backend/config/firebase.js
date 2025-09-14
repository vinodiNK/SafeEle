import admin from "firebase-admin";
import { readFileSync } from "fs";

// Replace with your Firebase service account path
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safeelephant-e6754.firebaseio.com"
});

const db = admin.firestore();

export { admin, db };
