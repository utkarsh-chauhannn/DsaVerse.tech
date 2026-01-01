import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { logOut } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await logOut();
      setShowDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  if (!currentUser) {
    return (
      <Link to="/login" className="navbar-link login-link">
        Sign In
      </Link>
    );
  }

  return (
    <div className="user-profile-nav" ref={dropdownRef}>
      <div 
        className="profile-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {currentUser.photoURL ? (
          <img 
            src={currentUser.photoURL} 
            alt="Profile" 
            className="profile-avatar"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="profile-avatar-fallback" style={{ display: currentUser.photoURL ? 'none' : 'flex' }}>
          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
        </div>
        <span className="profile-name">{currentUser.displayName?.split(' ')[0] || 'User'}</span>
      </div>

      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="dropdown-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="dropdown-avatar-fallback" style={{ display: currentUser.photoURL ? 'none' : 'flex' }}>
              {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
            </div>
            <div className="dropdown-info">
              <p className="dropdown-name">{currentUser.displayName || 'User'}</p>
              <p className="dropdown-email">{currentUser.email}</p>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <button onClick={handleSignOut} className="dropdown-item sign-out">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
