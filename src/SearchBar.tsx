import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  onSearch,
}: {
  onSearch: (searchTerms: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex items-center">
      <div className="max-w-[200px] h-[30px] flex items-center pl-4 transition-all hover:bg-gray-200 duration-500 font-semibold rounded-md cursor-pointer dark:hover:bg-gray-700 text-black dark:text-white">
        <FaSearch className="text-lg mr-2 text-black dark:text-white" />
        <input
          className="bg-transparent border-none w-full pl-1 text-sm outline-none focus:outline-none"
          placeholder="Search Countries..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
