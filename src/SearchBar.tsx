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
      <div className="flex h-[30px] max-w-[200px] cursor-pointer items-center rounded-md pl-4 font-semibold text-black transition-all duration-500 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
        <button
          onClick={() => {
            onSearch(searchTerm);
          }}
        >
          <FaSearch className="mr-2 text-lg text-black dark:text-white" />
        </button>
        <input
          className="w-full border-none bg-transparent pl-1 text-sm outline-none focus:outline-none"
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
