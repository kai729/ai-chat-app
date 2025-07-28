"use client";

import React, { createContext, useContext } from "react";
import { useChat } from "../hooks/useChat";

// 型定義（必要に応じて拡張できる）
export const ChatContext = createContext<ReturnType<typeof useChat> | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chat = useChat();

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
