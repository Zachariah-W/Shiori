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
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (isTyping) {
      setIsSearching(false);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setIsSearching(true);
        onSearch(searchTerm);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (isSearching) {
      const checkTimer = setTimeout(() => setIsSearching(false), 1000);
      return () => clearTimeout(checkTimer);
    }
  }, [searchTerm, isTyping, isSearching, onSearch]);

  return (
    <div className="flex items-center gap-2">
      {isTyping && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ type: "tween", repeat: Infinity, duration: 1 }}
        >
          <FiLoader />
        </motion.div>
      )}
      {!isTyping && isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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
            setSearchTerm(e.target.value);
            setIsTyping(true);
          }}
        />
      </div>
    </div>
  );
};

export default SearchBar;
