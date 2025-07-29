"use client";

import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { useAuth } from "../hooks/useAuth";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Box, Button, Typography, TextField, Paper, IconButton, CircularProgress } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";

const ChatMain = () => {
  const { loading: authLoading, isLoggedIn } = useAuth();
  const { messages, input, setInput, systemPrompt, setSystemPrompt, sendMessage, loading, startNewSession } =
    useChatContext();

  // const theme = useTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) sendMessage(lastUser.content);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      alert("コピーに失敗しました");
    }
  };

  if (authLoading) {
    return (
      <Typography textAlign="center" mt={10}>
        認証確認中...
      </Typography>
    );
  }

  if (!isLoggedIn) {
    return (
      <Typography textAlign="center" mt={10} color="error">
        チャットを利用するにはログインが必要です。
      </Typography>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      flex={1}
      height="100dvh"
      px={2}
      py={2}
      sx={{ bgcolor: "background.default", color: "text.primary", ml: 2, mr: 2 }}
    >
      <Typography variant="h6" mb={2} data-testid="chat-title">
        AIチャット
      </Typography>

      <Button variant="outlined" size="small" onClick={startNewSession} sx={{ mb: 2, alignSelf: "flex-start" }}>
        🆕 新規チャット
      </Button>

      {/* チャットメッセージエリア */}
      <Box
        flex={1}
        overflow="auto"
        p={2}
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          mb: 2,
        }}
      >
        {messages
          .filter((msg) => !msg.internal)
          .map((msg, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Box
                key={i}
                display="flex"
                justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
                position="relative"
                mb={1.5}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    maxWidth: "80%",
                    bgcolor: msg.role === "user" ? "primary.main" : "grey.900",
                    color: msg.role === "user" ? "#fff" : "grey.100",
                    fontSize: "0.875rem",
                    whiteSpace: "pre-wrap",
                    borderTopRightRadius: 4,
                    borderTopLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    borderBottomLeftRadius: 16,
                    boxShadow: msg.role === "user" ? "0px 2px 6px rgba(0,0,0,0.3)" : undefined,
                  }}
                >
                  {msg.role === "model" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // code({ node, className, children, ...props }) {
                        code({ node, children, ...props }) {
                          const match = /language-(\w+)/.exec(props.className || "");
                          // const isInline = (node as any)?.inline ?? false;
                          const isInline =
                            (node && typeof node === "object" && "inline" in node && (node as any).inline) ?? false;

                          return !isInline && match ? (
                            <SyntaxHighlighter
                              language={match[1]}
                              style={oneDark}
                              PreTag="div"
                              customStyle={{
                                padding: "1em",
                                borderRadius: "0.5em",
                                fontSize: "0.85rem",
                                overflowX: "auto",
                              }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code style={{ backgroundColor: "#eee", padding: "0.2em 0.4em", borderRadius: "4px" }}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </Paper>

                {msg.role === "model" && (
                  <IconButton
                    size="small"
                    onClick={() => handleCopy(msg.content, i)}
                    sx={{ position: "absolute", top: 4, right: 4, color: "grey.500" }}
                  >
                    {copiedIndex === i ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                  </IconButton>
                )}
              </Box>
            </motion.div>
          ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Typography variant="body2" sx={{ bgcolor: "grey.200", p: 1, borderRadius: 1, color: "#000" }}>
              AIが応答中...
            </Typography>
          </motion.div>
        )}

        {!loading && messages.length > 1 && messages.at(-1)?.role === "model" && (
          <Box textAlign="right" mt={2}>
            <Button size="small" onClick={handleRegenerate}>
              🔄 再生成
            </Button>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* 入力欄 */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          fullWidth
          label="システムプロンプト（AIの前提設定）"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          multiline
          rows={2}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          placeholder="メッセージを入力"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          multiline
          rows={3}
          variant="outlined"
          size="medium"
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          startIcon={loading && <CircularProgress size={18} color="inherit" />}
        >
          {loading ? "送信中..." : "送信"}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatMain;
