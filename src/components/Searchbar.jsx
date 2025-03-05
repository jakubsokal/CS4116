"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "@/styles/Searchbar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="search-bar">
      <div className="search-icon-container">
        <FaSearch className="search-icon" alt="search" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;
