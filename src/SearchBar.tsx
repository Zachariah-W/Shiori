import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";

const SearchBar = ({
  onSearch,
}: {
  onSearch: (searchTerms: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userInputting, setUserInputting] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="flex items-center gap-2">
      {userInputting && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ type: "tween", repeat: Infinity, duration: 1 }}
        >
          <FiLoader />
        </motion.div>
      )}
      {!userInputting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 1, 1, 0] }}
          transition={{ duration: 1.5, times: [0, 0.2, 0.5, 0.8, 1] }}
        >
          <FiCheck />
        </motion.div>
      )}
      <div className="flex h-8 w-44 cursor-pointer items-center rounded-md pl-4 font-semibold text-black transition-all duration-500 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
        <FaSearch className="mr-2 text-lg text-black dark:text-white" />
        <input
          className="w-full border-none bg-transparent pl-1 text-sm outline-none focus:outline-none"
          placeholder="Search title..."
          value={searchTerm}
          onChange={(e) => {
            setUserInputting(true);
            setSearchTerm(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
