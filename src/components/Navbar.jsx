import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">DSA</span>
          <span className="logo-accent">Verse</span>
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/sorting" className="navbar-link">
              Sorting
            </Link>
          </li>
          <li>
            <Link to="/data-structures" className="navbar-link">
              Data Structures
            </Link>
          </li>
          <li>
            <UserProfile />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
