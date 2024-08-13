import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="all-home-search">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          id="search-input"
          placeholder="Type to Search Countries..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
