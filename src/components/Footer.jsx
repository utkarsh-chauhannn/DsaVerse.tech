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
          <div className="footer-social">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

