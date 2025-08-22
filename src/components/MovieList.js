import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tmdbService from '../services/tmdb';
import MovieCard from './MovieCard';
import './MovieList.css';

const MovieList = () => {
  const { category } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(category, 1);
  }, [category]);

  const fetchMovies = async (movieCategory, page) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (movieCategory === 'trending') {
        response = await tmdbService.getTrendingMovies(page);
      } else if (movieCategory === 'top-rated') {
        response = await tmdbService.getTopRatedMovies(page);
      } else if (movieCategory === 'upcoming') {
        response = await tmdbService.getUpcomingMovies(page);
      }

      setMovies(response.results);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMovies(category, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-list">
      <div className="container">
        <h1 className="page-title">{category.replace('-', ' ')} Movies</h1>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovieList;
