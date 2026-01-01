import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              <span className="logo-text">DSA</span>
              <span className="logo-accent">Verse</span>
            </h3>
            <p className="footer-description">
              Master Data Structures & Algorithms through interactive 3D visualizations.
              Learn by doing, not just reading.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Learn</h4>
            <ul className="footer-links">
              <li>
                <Link to="/sorting" className="footer-link">
                  Sorting Algorithms
                </Link>
              </li>
              <li>
                <Link to="/data-structures" className="footer-link">
                  Data Structures
                </Link>
              </li>
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} DSA Verse. All rights reserved.</p>
            <p className="footer-tagline">Made with ❤️ for learners</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

