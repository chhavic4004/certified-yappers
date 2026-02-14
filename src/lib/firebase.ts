import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5cCbzFhZf8AY8Js3CYqAuUtATWooW5tI",
  authDomain: "flavourai-942f9.firebaseapp.com",
  projectId: "flavourai-942f9",
  storageBucket: "flavourai-942f9.firebasestorage.app",
  messagingSenderId: "311276458734",
  appId: "1:311276458734:web:1cf629350be498ab61d9ff",
  measurementId: "G-7RF59TXB98",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const initializeAnalytics = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  return supported ? getAnalytics(app) : null;
};

export { app, auth, initializeAnalytics };
