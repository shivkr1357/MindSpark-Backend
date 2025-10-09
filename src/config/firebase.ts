import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App;
let auth: Auth;

export const initializeFirebase = (): void => {
  try {
    // Check if Firebase app is already initialized
    if (getApps().length === 0) {
      // Validate required environment variables
      const requiredEnvVars = [
        "FIREBASE_PROJECT_ID",
        "FIREBASE_PRIVATE_KEY_ID",
        "FIREBASE_PRIVATE_KEY",
        "FIREBASE_CLIENT_EMAIL",
        "FIREBASE_CLIENT_ID",
      ];

      const missingVars = requiredEnvVars.filter(
        (varName) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required Firebase environment variables: ${missingVars.join(
            ", "
          )}\n` +
            "Please check your .env file and ensure all Firebase credentials are set."
        );
      }

      // Create service account object from environment variables
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri:
          process.env.FIREBASE_AUTH_URI ||
          "https://accounts.google.com/o/oauth2/auth",
        token_uri:
          process.env.FIREBASE_TOKEN_URI ||
          "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain:
          process.env.FIREBASE_UNIVERSE_DOMAIN || "googleapis.com",
      } as any;

      app = initializeApp({
        credential: cert(serviceAccount),
      });

      auth = getAuth(app);
      console.log(
        "✅ Firebase Admin SDK initialized successfully with environment variables"
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
