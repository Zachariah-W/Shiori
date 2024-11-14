import { Link } from "react-router-dom";
import { DarkModeSwitch } from "./SwitchButton";
import { useTheme } from "./ThemeContext";

const navbarLinks =
  "ml-4 p-1.5 no-underline text-black dark:text-white font-semibold";
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="p-5 flex items-center max-w-[600px] mx-auto">
      <img src="./src/images/shiori-logo.svg" className="w-9 mr-1"></img>
      <h1 className="text-black dark:text-white font-extrabold text-2xl ">
        Shiori
      </h1>
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
