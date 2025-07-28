"use client";

import ChatSidebar from "../../components/ChatSidebar";
import ChatMain from "../../components/ChatMain";
import { ChatProvider } from "../../contexts/ChatContext";
// import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { darkTheme } from "../../styles/theme";

export default function ChatPage() {
  return (
    <ThemeProvider>
      {/* <CssBaseline /> */}
      <ChatProvider>
        <div style={{ display: "flex", height: "100vh" }}>
          <ChatSidebar />
          <ChatMain />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}
