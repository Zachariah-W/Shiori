import { Link } from "react-router-dom";
import Logo from "./Logo";

const navbarLinks =
  "ml-4 p-1.5 no-underline text-black dark:text-white font-semibold";
const Navbar = () => {
  return (
    <nav className="w-layout flex items-center justify-between py-3">
      <Link to="/Home">
        <button className="-ml-2 flex cursor-pointer items-center rounded-xl bg-transparent p-2 pl-3 pr-4 transition-all hover:bg-neutral-100 active:scale-95 dark:hover:bg-neutral-800">
          <div className="h-fit w-fit rounded-full text-3xl text-orange-500 dark:text-orange-500">
            <Logo />
          </div>
          <h1 className="ml-2 select-none text-xl font-bold text-black dark:text-white">
            Shiori
          </h1>
        </button>
      </Link>
      <div className="ml-auto flex items-center gap-2.5">
        <Link to="/create" className={navbarLinks}>
          New Trip
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
