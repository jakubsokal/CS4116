"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/Navbar.css";
import Image from "next/image";
import SearchBar from "@/components/Searchbar";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar-main">
      <Link href="/">
        <Image src="/images/logo.png" alt="Logo" width={100} height={50} className="logo" />
      </Link>

      <div className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <div className="nav-search">
          <SearchBar />
        </div>
        <ul>
          <li><Link href="/explore" onClick={() => setMenuOpen(false)}>EXPLORE</Link></li>
          <li><Link href="/login" onClick={() => setMenuOpen(false)}>LOGIN</Link></li>
          <li><Link href="/register" onClick={() => setMenuOpen(false)}>REGISTER</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
