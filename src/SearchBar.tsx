import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({
  onSearch,
}: {
  onSearch: (searchTerms: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userInputting, setUserInputting] = useState<boolean>(false);

  return (
    <div className="flex items-center">
      <div className="flex h-[30px] max-w-[200px] cursor-pointer items-center rounded-md pl-4 font-semibold text-black transition-all duration-500 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
        {userInputting && <p>++</p>}
        <FaSearch className="mr-2 text-lg text-black dark:text-white" />
        <input
          className="w-full border-none bg-transparent pl-1 text-sm outline-none focus:outline-none"
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => {
            const newSearchTerm = e.target.value;
            setUserInputting(true);
            setSearchTerm(e.target.value);
            setTimeout(() => {
              console.log(newSearchTerm);
              onSearch(newSearchTerm);
              setUserInputting(false);
            }, 1000);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
