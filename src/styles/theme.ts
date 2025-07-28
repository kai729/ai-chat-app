// styles/theme.ts
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#007bff" },
    background: { default: "#f7f9fc", paper: "#fff" },
    text: { primary: "#000" },
  },
  typography: {
    fontFamily: '"Geist", "Geist Mono", sans-serif',
    fontSize: 14,
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  spacing: 8,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  typography: {
    fontFamily: `'Geist Variable', 'Geist Mono', sans-serif`,
  },
  spacing: 8,
});
