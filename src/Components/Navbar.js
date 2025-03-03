import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../Components/Assets/logo.png"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <div className="nav-links">
        <ul>
          <li><Link to="/">EXPLORE</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
          <li><Link to="/register">REGISTER</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
