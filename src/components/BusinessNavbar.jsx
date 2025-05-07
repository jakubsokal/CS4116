"use client";

import AccountNav from "@/components/AccountNav";
import "@/styles/Navbar.css";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const BusinessNavbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, loading } = useSessionCheck();
  const pathName = usePathname();


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
          {pathName !== "/business" && (
            <li> <Link href="/business" onClick={() => setMenuOpen(false)}> HOME</Link> </li>)}
          <li><Link href="/explore" onClick={() => setMenuOpen(false)}>EXPLORE</Link></li>
          {pathName !== "/messages" && (
            <li> <Link href="/messages" onClick={() => setMenuOpen(false)}> MESSAGES</Link> </li>)}

          <li className="cs4116-account"><AccountNav /></li>
        </ul>
      </div>
    </nav>
  );
};

export default BusinessNavbar;