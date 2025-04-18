"use client"

import AccountNav from "@/components/AccountNav"
import Loading from "@/components/Loading"
import SearchBar from "@/components/Searchbar"
import "@/styles/Navbar.css"
import useSessionCheck from "@/utils/hooks/useSessionCheck"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSession, setSession] = useState(null)
  const { session, loading, status } = useSessionCheck()
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  useEffect(() => {
    const checkSession = async () => {
      if (session != null) {
        setLoggedIn(true)
        setSession(session)
      } else {
        setLoggedIn(false)
        setSession(null)
      }
    }
    if (!loading) {
      checkSession()
    }
  }, [session, loading])

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
          {loggedIn && (
          <div className="nav-search">
          <SearchBar />
        </div>
      )}
          <ul>
            {pathname !== "/explore" && (
            <li><Link href="/explore" onClick={() => setMenuOpen(false)}>EXPLORE</Link></li>)}

            {!loggedIn && pathname !== "/login" && (
            <li><Link href="/login" onClick={() => setMenuOpen(false)}>LOGIN</Link></li>)}

            {!loggedIn && pathname !== "/register" && (
            <li><Link href="/register" onClick={() => setMenuOpen(false)}>REGISTER</Link></li>)}
          
            {session?.user?.permission === 1 && <li><Link href="/inquiry" onClick={() => setMenuOpen(false)}>INQUIRY</Link></li>}

            {loggedIn && pathname !== "/messages" && (
            <li><Link href="/messages" onClick={() => setMenuOpen(false)}>MESSAGES</Link></li>)}
            
            {loggedIn && <li className="cs4116-account"><AccountNav /></li>}
          </ul>
        </div>
      </nav>
    </Suspense>
  )
}

export default Navbar
