// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyAa2LGlBLHE9_fVbu3XLC4FASu90w1jpes",
  authDomain: "ai-chat-app-3cc5d.firebaseapp.com",
  projectId: "ai-chat-app-3cc5d",
  storageBucket: "ai-chat-app-3cc5d.firebasestorage.app",
  messagingSenderId: "349961374144",
  appId: "1:349961374144:web:47cc3d2972f12216fae025",
  measurementId: "G-4H3X40N485",
};

// 🔹 Firebase 初期化
const app = initializeApp(firebaseConfig);

// 🔹 Auth, Firestore インスタンス作成
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Export
export { auth, db, signInAnonymously, onAuthStateChanged };
