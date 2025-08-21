import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHome, FaStar, FaCalendar, FaPlay } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FaPlay className="logo-icon" />
            <span>MovieApp</span>
          </Link>

          <nav className="nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/trending" className={`nav-link ${isActive('/trending') ? 'active' : ''}`}>
              <FaStar />
              <span>Trending</span>
            </Link>
            <Link to="/top-rated" className={`nav-link ${isActive('/top-rated') ? 'active' : ''}`}>
              <FaStar />
              <span>Top Rated</span>
            </Link>
            <Link to="/upcoming" className={`nav-link ${isActive('/upcoming') ? 'active' : ''}`}>
              <FaCalendar />
              <span>Upcoming</span>
            </Link>
          </nav>

          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
