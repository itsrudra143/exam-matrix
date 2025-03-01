import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header-container">
      <header className="header">
        <div className="logo">Exam Matrix</div>
        <div className="nav-links">
          <button className="nav-button">Create Account</button>
          <button className="nav-button">Log In</button>
        </div>
      </header>
    </div>
  );
};

export default Header;
