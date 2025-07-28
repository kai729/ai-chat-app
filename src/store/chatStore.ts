// src/store/chatStore.ts
import { create } from "zustand";

type Message = {
  role: "user" | "model" | "model";
  content: string;
};

type ChatState = {
  messages: Message[];
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  systemPrompt: "",
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));
