import { Link } from "react-router-dom";
import LogoAnimation from "./brand/LogoAnimation";
import shioriLogo from "./brand/shiori-logo-animation.json";

const Navbar = () => {
  return (
    <nav className="w-layout flex items-center justify-between py-3">
      <Link
        to="/Home"
        className="-ml-2 flex cursor-pointer items-center rounded-xl bg-transparent p-2 pl-3 pr-4 transition-all hover:scale-105 hover:bg-neutral-100 active:scale-100 dark:hover:bg-neutral-800"
      >
        <div className="h-fit w-fit rounded-full text-3xl text-orange-500 dark:text-orange-500">
          <LogoAnimation src={shioriLogo}>
            <h1 className="ml-2 select-none text-xl font-semibold text-black dark:text-white">
              Shiori
            </h1>
          </LogoAnimation>
        </div>
      </Link>
      <div className="ml-auto flex items-center gap-2.5">
        <Link
          to="/create"
          className="cursor-pointer rounded-xl p-2 font-semibold text-black no-underline transition-all hover:scale-105 hover:bg-neutral-100 active:scale-100 dark:text-white dark:hover:bg-neutral-800"
        >
          New Trip
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
