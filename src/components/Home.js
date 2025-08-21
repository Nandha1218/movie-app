import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay, FaCalendar } from 'react-icons/fa';
import tmdbService, { getPosterUrl } from '../services/tmdb';
import MovieCard from './MovieCard';
import './Home.css';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        // Fetch all movie categories in parallel
        const [trending, topRated, upcoming] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getTopRatedMovies(),
          tmdbService.getUpcomingMovies()
        ]);

        setTrendingMovies(trending.results.slice(0, 8));
        setTopRatedMovies(topRated.results.slice(0, 8));
        setUpcomingMovies(upcoming.results.slice(0, 8));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading amazing movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <h1 className="page-title">Discover Amazing Movies</h1>
        
        {/* Hero Section */}
        <section className="hero-section">
          {trendingMovies.length > 0 && (
            <div className="hero-movie">
              <div className="hero-backdrop">
                <img 
                  src={getPosterUrl(trendingMovies[0].backdrop_path)} 
                  alt={trendingMovies[0].title}
                  className="hero-image"
                />
                <div className="hero-overlay">
                  <div className="hero-content">
                    <h2 className="hero-title">{trendingMovies[0].title}</h2>
                    <p className="hero-overview">{trendingMovies[0].overview}</p>
                    <div className="hero-meta">
                      <span className="hero-rating">
                        <FaStar /> {trendingMovies[0].vote_average.toFixed(1)}
                      </span>
                      <span className="hero-year">
                        {new Date(trendingMovies[0].release_date).getFullYear()}
                      </span>
                    </div>
                    <Link to={`/movie/${trendingMovies[0].id}`} className="hero-btn">
                      <FaPlay /> Watch Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Trending Movies */}
        <section className="movies-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaStar /> Trending This Week
            </h2>
            <Link to="/trending" className="view-all-btn">View All</Link>
          </div>
          <div className="movies-grid">
            {trendingMovies.slice(1, 9).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Top Rated Movies */}
        <section className="movies-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaStar /> Top Rated Movies
            </h2>
            <Link to="/top-rated" className="view-all-btn">View All</Link>
          </div>
          <div className="movies-grid">
            {topRatedMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Upcoming Movies */}
        <section className="movies-section">
          <div className="section-header">
            <h2 className="section-title">
              <FaCalendar /> Coming Soon
            </h2>
            <Link to="/upcoming" className="view-all-btn">View All</Link>
          </div>
          <div className="movies-grid">
            {upcomingMovies.slice(0, 8).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
