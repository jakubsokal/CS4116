"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { usePathname } from 'next/navigation'
import "@/styles/Searchbar.css";

const SearchBar = () => {
  const [query, setQuery] = useState(() => localStorage.getItem("searchQuery") || "");
  const router = useRouter();
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleSearch = (e) => {
    e.preventDefault();
    if(!query) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("query", query);
    
    if(pathname === "/explore") window.location.replace(`/explore?${params.toString()}`)
    else router.push(`/explore?${params.toString()}`);
  }

  return (
    <div className="search-bar">
      <div className="search-icon-container" onClick={(e) => {
          localStorage.setItem("searchQuery", query);
          handleSearch(e);
        }}>
        <FaSearch className="search-icon" alt="search"/>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchBar;
