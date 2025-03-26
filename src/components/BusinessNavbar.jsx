"use client";

import "@/styles/Navbar.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const BusinessNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar-main">
      <Link href="/business">
        <Image src="/images/logo.png" alt="Logo" width={100} height={50} className="logo" />
      </Link>

      <div className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link href="/business/messages" onClick={() => setMenuOpen(false)}> MESSAGES</Link>
          </li>
          <li>
            <Link href="/business/profile" onClick={() => setMenuOpen(false)}> PROFILE</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BusinessNavbar;