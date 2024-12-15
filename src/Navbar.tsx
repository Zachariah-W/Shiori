import { Link } from "react-router-dom";
import { DarkModeSwitch } from "./SwitchButton";
import { useTheme } from "./ThemeContext";

const navbarLinks =
  "ml-4 p-1.5 no-underline text-black dark:text-white font-semibold";
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="mx-auto flex max-w-[600px] items-center py-6">
      <div className="flex align-middle">
        <object data="./src/images/shiori-logo.svg" className="mr-2 w-8" />
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Shiori
        </h1>
      </div>
      <div className="ml-auto flex items-center gap-2.5">
        <Link to="/Home" className={navbarLinks}>
          Home
        </Link>
        <Link to="/create" className={navbarLinks}>
          New Trip
        </Link>
        <DarkModeSwitch
          onChange={() => setTheme(theme === "light" ? "dark" : "light")}
          checked={theme === "dark"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
