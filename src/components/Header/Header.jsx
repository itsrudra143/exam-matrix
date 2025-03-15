import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="header-logo">Exam Matrix</a>
      </div>
      <div className="header-right">
        <button className="header-button secondary">Create Account</button>
        <button className="header-button primary">Log In</button>
      </div>
    </header>
  );
};

export default Header;