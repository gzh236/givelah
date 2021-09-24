import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
};

let FirebaseApp: any = null;

export function getFirebaseInstance() {
  if (FirebaseApp) {
    return FirebaseApp;
  }

  FirebaseApp = initializeApp(firebaseConfig);

  return FirebaseApp;
}

getFirebaseInstance();

export const firebaseDb = getFirestore();

export const auth = getAuth();
