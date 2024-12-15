import { DarkModeSwitch } from "./SwitchButton";
import { useTheme } from "./ThemeContext";

const Footer = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="fixed bottom-0 h-16 w-layout flex-row items-center justify-between rounded-t-md border border-gray-800 bg-dotted-bg">
      <div>
        <p>Shiori</p>
        <DarkModeSwitch
          onChange={() => setTheme(theme === "light" ? "dark" : "light")}
          checked={theme === "dark"}
        />
      </div>
      <div></div>
    </div>
  );
};

export default Footer;
