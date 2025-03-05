"use client";

import { useState } from "react";
import Link from "next/link";
import "@/styles/Navbar.css";
import Image from "next/image";

const Navbar = () => {
  // State to manage mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={100} height={50} className="logo" />
      </Link>

      {/* Hamburger Menu Button */}
      <div className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <ul>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>EXPLORE</Link></li>
          <li><Link href="/login" onClick={() => setMenuOpen(false)}>LOGIN</Link></li>
          <li><Link href="/register" onClick={() => setMenuOpen(false)}>REGISTER</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
