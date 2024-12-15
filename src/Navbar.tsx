import { Link } from "react-router-dom";
import { DarkModeSwitch } from "./SwitchButton";
import { useTheme } from "./ThemeContext";
import Logo from "./Logo";

const navbarLinks =
  "ml-4 p-1.5 no-underline text-black dark:text-white font-semibold";
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <nav className="mx-auto flex max-w-[600px] items-center py-6">
      <button className="flex items-center bg-transparent transition-all hover:bg-neutral-200/50 dark:hover:bg-neutral-800 p-2 pr-4 pl-3 rounded-xl cursor-pointer active:scale-95 ">
        <div className="w-fit h-fit rounded-full text-orange-500 dark:text-orange-500 text-4xl">
          <Logo/>
        </div>
        <h1 className="ml-2 text-2xl font-bold text-black dark:text-white select-none">
          Shiori
        </h1>
      </button>
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
