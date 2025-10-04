import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app: App;
let auth: Auth;

export const initializeFirebase = (): void => {
  try {
    // Check if Firebase app is already initialized
    if (getApps().length === 0) {
      // Path to the service account JSON file in the root directory
      const serviceAccountPath = path.join(
        __dirname,
        "../../projecttutorial-5f94d-firebase-adminsdk-r949n-769a4e752f.json"
      );

      app = initializeApp({
        credential: cert(serviceAccountPath),
      });

      auth = getAuth(app);
      console.log(
        "✅ Firebase Admin SDK initialized successfully with service account file"
      );
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      console.log("✅ Firebase Admin SDK already initialized");
    }
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin SDK:", error);
    throw error;
  }
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error(
      "Firebase Auth not initialized. Call initializeFirebase() first."
    );
  }
  return auth;
};

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    const auth = getFirebaseAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    throw new Error("Invalid Firebase token");
  }
};
