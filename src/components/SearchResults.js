import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaStar, FaFilter, FaSort } from 'react-icons/fa';
import tmdbService from '../services/tmdb';
import MovieCard from './MovieCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      setCurrentPage(1);
      searchMovies(query, 1);
    }
  }, [query]);

  const searchMovies = async (searchQuery, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tmdbService.searchMovies(searchQuery, page);
      
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Failed to search movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      searchMovies(query, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // In a real app, you would implement sorting logic here
    // For now, we'll just re-fetch the current page
    searchMovies(query, currentPage);
  };

  if (!query) {
    return (
      <div className="container">
        <div className="no-search">
          <FaSearch className="no-search-icon" />
          <h2>No Search Query</h2>
          <p>Please enter a search term to find movies.</p>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="container">
        <div className="search-header">
          <h1 className="page-title">Search Results</h1>
          <div className="search-info">
            <p className="search-query">"{query}"</p>
            <p className="results-count">
              {totalResults > 0 ? `${totalResults} movies found` : 'No movies found'}
            </p>
          </div>
        </div>

        {/* Search Controls */}
        <div className="search-controls">
          <div className="sort-controls">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="date">Release Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">Searching for movies...</div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">{error}</div>
        )}

        {/* Results */}
        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && !error && movies.length === 0 && (
          <div className="no-results">
            <FaSearch className="no-results-icon" />
            <h2>No Movies Found</h2>
            <p>We couldn't find any movies matching "{query}".</p>
            <p>Try searching with different keywords or browse our trending movies.</p>
            <Link to="/" className="btn">Browse Trending Movies</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
