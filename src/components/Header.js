import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHome, FaStar, FaCalendar, FaPlay, FaTrophy, FaFilter } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    year: '',
    industry: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams();
      queryParams.set('q', searchQuery.trim());
      
      // Primary search only searches by movie name, not including filters
      navigate(`/search?${queryParams.toString()}`);
      setSearchQuery('');
      setShowFilters(false);
    }
  };

  const handleFilterSearch = () => {
    // Search only by filters without requiring movie name
    if (filters.language || filters.year || filters.industry) {
      const queryParams = new URLSearchParams();
      queryParams.set('q', 'all'); // Use 'all' as a placeholder for filter-only search
      
      // Add filters to search query
      if (filters.language) queryParams.set('language', filters.language);
      if (filters.year) queryParams.set('year', filters.year);
      if (filters.industry) queryParams.set('industry', filters.industry);
      
      navigate(`/search?${queryParams.toString()}`);
      setShowFilters(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      language: '',
      year: '',
      industry: ''
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FaPlay className="logo-icon" />
            <span>Cine Search</span>
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
              <FaTrophy />
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
            
            <div className="filter-container">
              <button 
                type="button" 
                className="filter-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
              </button>
              
              {showFilters && (
                <div className="filter-dropdown">
                  <div className="filter-group">
                    <label>Language:</label>
                    <select 
                      value={filters.language} 
                      onChange={(e) => handleFilterChange('language', e.target.value)}
                    >
                      <option value="">Any Language</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                      <option value="ru">Russian</option>
                      <option value="ja">Japanese</option>
                      <option value="ko">Korean</option>
                      <option value="zh">Chinese</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Year:</label>
                    <select 
                      value={filters.year} 
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                    >
                      <option value="">Any Year</option>
                      {Array.from({ length: 25 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Industry:</label>
                    <select 
                      value={filters.industry} 
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                    >
                      <option value="">Any Industry</option>
                      <option value="hollywood">Hollywood</option>
                      <option value="bollywood">Bollywood</option>
                      <option value="nollywood">Nollywood</option>
                      <option value="korean">Korean Cinema</option>
                      <option value="japanese">Japanese Cinema</option>
                      <option value="chinese">Chinese Cinema</option>
                      <option value="european">European Cinema</option>
                      <option value="tamil">Tamil Cinema (Kollywood)</option>
                    </select>
                  </div>
                  
                                  <div className="filter-actions">
                  <button 
                    type="button" 
                    onClick={handleFilterSearch} 
                    className="filter-search-btn"
                    disabled={!filters.language && !filters.year && !filters.industry}
                  >
                    <FaSearch /> Search by Filters
                  </button>
                  <button type="button" onClick={clearFilters} className="clear-filters-btn">
                    Clear Filters
                  </button>
                </div>
                </div>
              )}
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
