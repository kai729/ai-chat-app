import { useEffect, useState } from "react";
import { auth, signInAnonymously, onAuthStateChanged } from "../lib/firebase";
import type { User } from "firebase/auth";

// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isTest = process.env.NEXT_PUBLIC_E2E === "true";

    if (isTest) {
      // ✅ テスト時は即ログイン済みとみなす
      setUser({ uid: "test-user" } as User); // 型合わせで最低限
      setLoading(false);
      return;
    }

    // ✅ 通常モード：Firebase匿名認証
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        signInAnonymously(auth).catch((err) => {
          console.error("匿名ログイン失敗:", err);
        });
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
  };
};
