import { Link } from "react-router-dom";

const navbarLinks = "ml-4 p-1.5 no-underline hover:text-[#2b83cf]";

const Navbar = () => {
  return (
    <nav class="p-5 flex items-center max-w-[600px] mx-auto border-b border-gray-200">
      <h1 class="text-[#2b83cf] font-extrabold text-2xl ">My Trip Recorder</h1>
      <div class="ml-auto flex items-center gap-2.5">
        <Link to="/" className={navbarLinks}>
          Home
        </Link>
        <Link to="/create" className={navbarLinks}>
          New Trip
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
