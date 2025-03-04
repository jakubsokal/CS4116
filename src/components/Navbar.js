import Link from "next/link"; 
import "@/styles/Navbar.css"; 
import Image from "next/image"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <Image src="/logo.png" alt="Logo" width={100} height={50} className="logo" />
      </Link>
      <div className="nav-links">
        <ul>
          <li><Link href="/">EXPLORE</Link></li>
          <li><Link href="/login">LOGIN</Link></li>
          <li><Link href="/register">REGISTER</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
