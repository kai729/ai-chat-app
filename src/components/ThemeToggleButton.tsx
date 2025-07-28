import { IconButton, Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useThemeContext } from "../contexts/ThemeContext";

const ThemeToggleButton = () => {
  const { mode, toggleMode } = useThemeContext();

  return (
    <Tooltip title={mode === "light" ? "ダークモードに切り替え" : "ライトモードに切り替え"}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === "light" ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
