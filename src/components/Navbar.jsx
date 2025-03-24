"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import "@/styles/Navbar.css"
import Image from "next/image"
import SearchBar from "@/components/Searchbar"
import AccountNav from "@/components/AccountNav"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import Loading from "@/components/Loading"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const { session, loading, status } = useSessionCheck()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
        if (session != null) {
          setLoggedIn(true)
        }
    }
    if(!loading){
      checkSession()
    }
  }, [session])

  if (loading) {
    return <Loading />
  }
  
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
          {!loggedIn && (<li><Link href="/login" onClick={() => setMenuOpen(false)}>LOGIN</Link></li>)}
          {!loggedIn && (<li><Link href="/register" onClick={() => setMenuOpen(false)}>REGISTER</Link></li>)}
          {loggedIn && (<li className="cs4116-account"><AccountNav/></li>)}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
