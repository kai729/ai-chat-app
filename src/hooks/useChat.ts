import { useState, useEffect } from "react";
import { createSession, addMessageToSession, getMessagesFromSession, getUserSessions } from "../utils/firebaseChat";
import { useAuth } from "./useAuth";
import { debounce } from "lodash";

type Role = "user" | "model";
type Message = { role: Role; content: string; internal?: boolean };
type Session = {
  id: string;
  title?: string;
  // createdAt?: any;
  createdAt?: string | Date;
};

export const useChat = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemPromptAdded, setSystemPromptAdded] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);

  // 🔸 セッション一覧取得（ログイン時）
  useEffect(() => {
    if (user) {
      (async () => {
        const sessionList = await getUserSessions(user.uid);
        console.log("📋 セッション一覧:", sessionList);
        setSessions(sessionList);
      })();
    }
  }, [user]);

  // ✅ 明示的に「新しいチャット」開始したいとき用
  const startNewSession = async () => {
    if (!user) return;

    const timestamp = new Date().toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const title = `新しいチャット（${timestamp}）`;
    const newId = await createSession(user.uid, title);
    setSessionId(newId);
    setMessages([]);
    setSystemPromptAdded(false);

    // 🔄 少し後で一覧更新
    setTimeout(async () => {
      const sessionList = await getUserSessions(user.uid);
      setSessions(sessionList);
    }, 1000);
  };

  // Firestore保存（user / model 発言のみ）
  const saveMessage = debounce(async (role: Role, content: string) => {
    if (user && sessionId) {
      try {
        console.log("💾 Firestore保存中:", {
          user: user.uid,
          sessionId,
          role,
          content,
        });
        await addMessageToSession(user.uid, sessionId, role, content);
      } catch (err) {
        console.error("❌ Firestore書き込みエラー:", err);
      }
    }
  }, 300);

  const loadSession = async (selectedId: string) => {
    if (!user) return;

    setLoading(true);
    const history = await getMessagesFromSession(user.uid, selectedId);
    console.log("📥 復元した履歴:", history);
    setMessages(history);
    setSessionId(selectedId);
    setSystemPromptAdded(true); // 再送させない
    setLoading(false);
  };

  const sendMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    let currentMessages = [...messages];

    // ✅ セッションが無ければここで作る
    let activeSessionId = sessionId;
    if (!activeSessionId && user) {
      const timestamp = new Date().toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      const title = `新しいチャット（${timestamp}）`;
      activeSessionId = await createSession(user.uid, title);
      setSessionId(activeSessionId);

      // セッション一覧も更新
      setTimeout(async () => {
        const sessionList = await getUserSessions(user.uid);
        setSessions(sessionList);
      }, 1000);
    }

    // ✅ 最初の送信時だけ systemPrompt を注入
    if (systemPrompt && !systemPromptAdded) {
      const injectedPrompt = `【ルール】以下を守って会話してください。\n${systemPrompt}`;
      const fakeUserMessage: Message = {
        role: "user",
        content: injectedPrompt,
        internal: true,
      };
      currentMessages = [fakeUserMessage, ...currentMessages];
      setMessages((prev) => [fakeUserMessage, ...prev]);
      await addMessageToSession(user!.uid, activeSessionId!, "user", injectedPrompt, true);
      setSystemPromptAdded(true);
    }

    const userMessage: Message = { role: "user", content: prompt };
    currentMessages.push(userMessage);
    setMessages((prev) => [...prev, userMessage]);
    // await addMessageToSession(user!.uid, activeSessionId!, "user", prompt);
    await saveMessage("user", prompt);

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          history: currentMessages,
        }),
      });

      const data = await res.json();
      const modelMessage: Message = { role: "model", content: data.text };
      setMessages((prev) => [...prev, modelMessage]);
      // await addMessageToSession(user!.uid, activeSessionId!, "model", data.text);
      await saveMessage("model", data.text);
    } catch (err) {
      console.error("❌ APIエラー", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    input,
    setInput,
    systemPrompt,
    setSystemPrompt,
    loading,
    startNewSession,
    loadSession,
    sessions,
  };
};
