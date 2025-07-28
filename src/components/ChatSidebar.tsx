"use client";

import { useChatContext } from "../contexts/ChatContext";
import { Box, Button, Typography, List, ListItem, ListItemButton } from "@mui/material";
import ThemeToggleButton from "./ThemeToggleButton";

const ChatSidebar = () => {
  const { startNewSession, loadSession, sessions } = useChatContext();

  return (
    <Box
      component="aside"
      sx={{
        width: 280,
        p: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6" gutterBottom>
        チャットメニュー
      </Typography>

      <Button variant="contained" onClick={startNewSession} sx={{ mt: 2, mb: 4, px: 3, fontWeight: "bold" }}>
        新規チャット
      </Button>
      <ThemeToggleButton />

      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        📂 過去のセッション
      </Typography>

      {sessions.length === 0 ? (
        <Typography variant="body2" color="text.disabled">
          セッションがありません
        </Typography>
      ) : (
        <List disablePadding dense>
          {sessions.map((session) => (
            <ListItem key={session.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => loadSession(session.id)}
                sx={{
                  bgcolor: "grey.900",
                  color: "grey.100",
                  border: "1px solid",
                  borderColor: "grey.800",
                  borderRadius: 1,
                  fontSize: "0.875rem",
                  "&:hover": {
                    bgcolor: "grey.800",
                  },
                }}
              >
                {session.title || "無題セッション"}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ChatSidebar;
