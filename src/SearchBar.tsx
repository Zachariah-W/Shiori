import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { cn } from "./lib/utils";

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
      const checkTimer = setTimeout(() => setIsSearching(false), 2000);
      return () => clearTimeout(checkTimer);
    }
  }, [searchTerm, isTyping, isSearching, onSearch]);

  return (
    <div
      className={cn(
        "flex h-10 w-52 cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 px-4 text-sm text-black transition-all duration-500 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white",
        isSearching &&
          "border-amber-300 bg-amber-100 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
      )}
    >
      <FiLoader className={cn(isTyping ? "block animate-spin" : "hidden")} />
      <FiCheck
        className={cn(
          "transition-all",
          !isTyping && isSearching ? "block animate-in" : "hidden",
        )}
      />
      <FaSearch className={cn(isTyping || isSearching ? "hidden" : "block")} />
      <input
        className="w-full border-none bg-transparent pl-1 outline-none placeholder:text-inherit focus:outline-none"
        placeholder="Search title..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsTyping(true);
        }}
      />
    </div>
  );
};

export default SearchBar;
