import { Link } from "react-router-dom";
const navbarLinks =
  "ml-4 p-1.5 no-underline text-black dark:text-white font-semibold";
const Navbar = () => {
  return (
    <nav className="mx-auto flex w-[600px] items-center py-6">
      <Link to="/Home">
        <div className="flex align-middle">
          <object data="./src/images/shiori-logo.svg" className="mr-2 w-8" />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Shiori
          </h1>
        </div>
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
