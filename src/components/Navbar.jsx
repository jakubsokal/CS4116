"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import "@/styles/Navbar.css"
import Image from "next/image"
import SearchBar from "@/components/Searchbar"
import AccountNav from "@/components/AccountNav"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import Loading from "@/components/Loading"
import { useRouter } from "next/navigation"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSession, setSession] = useState(null)
  const { session, loading, status } = useSessionCheck()
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }


  useEffect(() => {
    const checkSession = async () => {
      if (session != null) {
        setLoggedIn(true)
        setSession(session)
        console.log(session.user)
      }
    }
    if (!loading) {
      checkSession()
    }
  }, [session])

  if (loading) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
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
            {session.user.permission == 1 && <li><Link href="/inquiry" onClick={() => setMenuOpen(false)}>INQUIRY</Link></li>}
            {loggedIn && <li><Link href="/messages" onClick={() => setMenuOpen(false)}>MESSAGES</Link></li>}
            {loggedIn && <li className="cs4116-account"><AccountNav /></li>}
          </ul>
        </div>
      </nav>
    </Suspense>
  )
}

export default Navbar
