import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from "firebase/firestore";

/**
 * 新しいチャットセッションを作成
 */
export const createSession = async (userId: string, title: string = "新しいチャット"): Promise<string> => {
  try {
    const sessionsRef = collection(db, "users", userId, "sessions");
    const sessionDoc = await addDoc(sessionsRef, {
      title,
      createdAt: serverTimestamp(),
    });
    return sessionDoc.id;
  } catch (err) {
    console.error("❌ セッション作成失敗:", err);
    throw err;
  }
};

/**セッションにチャットメッセージを追加
 */
export const addMessageToSession = async (
  userId: string,
  sessionId: string,
  role: string,
  content: string,
  internal: boolean = false // 🔥 追加
) => {
  try {
    // 🔒 空文字（空白含む）を除外
    if (!content.trim()) return;

    const messagesRef = collection(db, "users", userId, "sessions", sessionId, "messages");
    await addDoc(messagesRef, {
      role,
      content,
      internal,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ メッセージ保存失敗:", err);
    throw err;
  }
};

/** セッション一覧を取得
 */
// export const getUserSessions = async (uid: string) => {
//   const sessionsRef = collection(db, "users", uid, "sessions");
//   const q = query(sessionsRef, orderBy("createdAt", "desc"));

//   const snapshot = await getDocs(q);
//   return snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
// };
export const getUserSessions = async (uid: string) => {
  const sessionsRef = collection(db, "users", uid, "sessions");
  const q = query(sessionsRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "無題",
      createdAt: data.createdAt?.toDate?.() ?? new Date(), // ← ここが重要
    };
  });
};

export const getMessagesFromSession = async (uid: string, sessionId: string) => {
  const messagesRef = collection(db, "users", uid, "sessions", sessionId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      doc.data() as {
        role: "user" | "model";
        content: string;
        internal?: boolean;
      }
  );
};
