import { Link } from "react-router-dom";
import { FiBarChart2, FiPlus } from "react-icons/fi";
import LogoAnimation from "./brand/LogoAnimation";
import shioriLogo from "./brand/shiori-logo-animation.json";

const Navbar = () => (
  <nav className="w-layout flex items-center justify-between py-5">
    <Link
      to="/Home"
      className="-ml-2 flex cursor-pointer items-center rounded-full bg-transparent p-2.5 pl-4 pr-5 transition-all hover:bg-neutral-100 active:scale-95 dark:hover:bg-neutral-800"
    >
      <div className="h-fit w-fit rounded-full text-3xl text-orange-500 dark:text-orange-500">
        <LogoAnimation src={shioriLogo}>
          <h1 className="ml-2 select-none text-xl font-semibold text-black dark:text-white">
            Shiori
          </h1>
        </LogoAnimation>
      </div>
    </Link>
    <div className="ml-auto flex items-center gap-1 text-base">
      <Link to="/data" className="nav-link">
        <FiBarChart2 />
        Data
      </Link>
      <Link to="/create" className="nav-link">
        <FiPlus />
        New Trip
      </Link>
    </div>
  </nav>
);

export default Navbar;
