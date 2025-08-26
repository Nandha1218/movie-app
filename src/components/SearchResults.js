import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaSearch, FaStar, FaFilter, FaSort } from 'react-icons/fa';
import tmdbService from '../services/tmdb';
import MovieCard from './MovieCard';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const language = searchParams.get('language');
  const year = searchParams.get('year');
  const industry = searchParams.get('industry');
  
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
  }, [query, language, year, industry]);

  const searchMovies = async (searchQuery, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      let filteredMovies = [];
      
      // Check if this is a filter-only search (query === 'all')
      if (searchQuery === 'all') {
        // Search by filters only - use discover endpoint for better results
        let discoverParams = {
          page: page
        };
        
        if (language) {
          discoverParams.with_original_language = language;
        }
        
        if (year) {
          discoverParams.primary_release_year = parseInt(year);
        }
        
        // Map industry to language if no language specified
        if (industry && !language) {
          let targetLanguage = null;
          switch (industry) {
            case 'tamil':
              targetLanguage = 'ta';
              break;
            case 'bollywood':
              targetLanguage = 'hi';
              break;
            case 'korean':
              targetLanguage = 'ko';
              break;
            case 'japanese':
              targetLanguage = 'ja';
              break;
            case 'chinese':
              targetLanguage = 'zh';
              break;
            case 'hollywood':
              targetLanguage = 'en';
              break;
            default:
              targetLanguage = null;
          }
          
          if (targetLanguage) {
            discoverParams.with_original_language = targetLanguage;
          }
        }
        
        // Use discover endpoint for filter-only search
        response = await tmdbService.discoverMovies(discoverParams);
        filteredMovies = response.results;
      } else {
        // Regular search with movie name
        response = await tmdbService.searchMovies(searchQuery, page, language);
        filteredMovies = response.results;
        
        // Apply additional filters after search
        if (year) {
          const targetYear = parseInt(year);
          filteredMovies = filteredMovies.filter(movie => {
            if (movie.release_date) {
              const movieYear = new Date(movie.release_date).getFullYear();
              return movieYear === targetYear;
            }
            return false;
          });
        }
        
        // Apply industry filter
        if (industry) {
          let targetLanguage = null;
          switch (industry) {
            case 'tamil':
              targetLanguage = 'ta';
              break;
            case 'bollywood':
              targetLanguage = 'hi';
              break;
            case 'korean':
              targetLanguage = 'ko';
              break;
            case 'japanese':
              targetLanguage = 'ja';
              break;
            case 'chinese':
              targetLanguage = 'zh';
              break;
            case 'hollywood':
              targetLanguage = 'en';
              break;
            default:
              targetLanguage = null;
          }
          
          if (targetLanguage) {
            filteredMovies = filteredMovies.filter(movie => 
              movie.original_language === targetLanguage
            );
          }
        }
      }
      
             setMovies(filteredMovies);
       
       // Reset sort to relevance when new search results come in
       setSortBy('relevance');
       
       // Calculate pagination based on filtered results
       if (filteredMovies.length === 0) {
         setTotalPages(0);
         setTotalResults(0);
       } else {
         // For filtered results, we need to handle pagination differently
         // Since TMDB doesn't support all our filters natively, we'll show all results on one page
         setTotalPages(1);
         setTotalResults(filteredMovies.length);
       }
      
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
    // Sort the current movies based on the selected criteria
    sortMovies(newSortBy);
  };

  const sortMovies = (sortCriteria) => {
    const sortedMovies = [...movies];
    
    switch (sortCriteria) {
      case 'rating':
        sortedMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        break;
      case 'date':
        sortedMovies.sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA; // Newest first
        });
        break;
      case 'title':
        sortedMovies.sort((a, b) => {
          const titleA = (a.title || '').toLowerCase();
          const titleB = (b.title || '').toLowerCase();
          return titleA.localeCompare(titleB);
        });
        break;
      case 'relevance':
      default:
        // Keep original order (relevance from TMDB)
        break;
    }
    
    setMovies(sortedMovies);
  };

  if (!query || query === '') {
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
              <p className="search-query">
                {query === 'all' ? 'Filtered Movies' : `"${query}"`}
              </p>
              <p className="results-count">
                {totalResults > 0 ? `${totalResults} movies found` : 'No movies found'}
              </p>
            {(language || year || industry) && (
              <div className="active-filters">
                <span className="filter-label">Active Filters:</span>
                {language && (
                  <span className="filter-tag">
                    Language: {language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : language === 'zh' ? 'Chinese' : language.toUpperCase()}
                  </span>
                )}
                {year && (
                  <span className="filter-tag">
                    Year: {year}
                  </span>
                )}
                {industry && (
                  <span className="filter-tag">
                    Industry: {industry === 'tamil' ? 'Tamil Cinema' : industry === 'bollywood' ? 'Bollywood' : industry === 'korean' ? 'Korean Cinema' : industry === 'japanese' ? 'Japanese Cinema' : industry === 'chinese' ? 'Chinese Cinema' : industry.charAt(0).toUpperCase() + industry.slice(1)}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Search Controls */}
        <div className="search-controls">
          <div className="sort-controls">
            <label htmlFor="sort-select">
              <FaSort /> Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="relevance">Relevance (Default)</option>
              <option value="rating">Rating (High to Low)</option>
              <option value="date">Release Date (Newest First)</option>
              <option value="title">Title (A-Z)</option>
            </select>
            {sortBy !== 'relevance' && (
              <span className="sort-indicator">
                Sorted by: {sortBy === 'rating' ? 'Rating' : sortBy === 'date' ? 'Release Date' : 'Title'}
              </span>
            )}
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
            <div className="filtered-results-info">
              <p className="filtered-count">
                {query === 'all' 
                  ? `Showing ${movies.length} movies based on your filters`
                  : `Showing ${movies.length} filtered results for "${query}"`
                }
                {(language || year || industry) && query !== 'all' && (
                  <span className="filter-applied">
                    {' '}with applied filters
                  </span>
                )}
              </p>
            </div>
            
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
