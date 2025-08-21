import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaPlay, FaArrowLeft, FaCalendar, FaClock, FaGlobe } from 'react-icons/fa';
import tmdbService, { getPosterUrl, getBackdropUrl, getProfileUrl } from '../services/tmdb';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch movie details, credits, and videos in parallel
        const [movieData, creditsData, videosData] = await Promise.all([
          tmdbService.getMovieDetails(id),
          tmdbService.getMovieCredits(id),
          tmdbService.getMovieVideos(id)
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(videosData.results.filter(video => video.site === 'YouTube'));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to fetch movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading movie details...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container">
        <div className="error">{error || 'Movie not found'}</div>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    );
  }

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="movie-detail">
      {/* Backdrop Image */}
      <div className="movie-backdrop">
        <img 
          src={getBackdropUrl(movie.backdrop_path)} 
          alt={movie.title}
          className="backdrop-image"
        />
        <div className="backdrop-overlay">
          <div className="container">
            <Link to="/" className="back-btn">
              <FaArrowLeft /> Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="movie-content">
          {/* Movie Poster and Basic Info */}
          <div className="movie-header">
            <div className="movie-poster-section">
              <img
                src={getPosterUrl(movie.poster_path)}
                alt={movie.title}
                className="movie-poster-large"
              />
            </div>
            
            <div className="movie-info-section">
              <h1 className="movie-title">{movie.title}</h1>
              
              <div className="movie-meta">
                <div className="movie-rating">
                  <FaStar className="star-icon" />
                  <span className="rating-score">{movie.vote_average.toFixed(1)}</span>
                  <span className="rating-count">({movie.vote_count} votes)</span>
                </div>
                
                <div className="movie-details">
                  <span className="detail-item">
                    <FaCalendar /> {formatDate(movie.release_date)}
                  </span>
                  {movie.runtime && (
                    <span className="detail-item">
                      <FaClock /> {formatRuntime(movie.runtime)}
                    </span>
                  )}
                  {movie.original_language && (
                    <span className="detail-item">
                      <FaGlobe /> {movie.original_language.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {movie.tagline && (
                <p className="movie-tagline">"{movie.tagline}"</p>
              )}

              <div className="movie-genres">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div className="movie-overview-section">
                <h3>Overview</h3>
                <p className="movie-overview">{movie.overview}</p>
              </div>

              {movie.homepage && (
                <a 
                  href={movie.homepage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="homepage-btn"
                >
                  Visit Official Website
                </a>
              )}
            </div>
          </div>

          {/* Cast Section */}
          {credits?.cast && credits.cast.length > 0 && (
            <section className="cast-section">
              <h2 className="section-title">Cast</h2>
              <div className="cast-grid">
                {credits.cast.slice(0, 10).map(person => (
                  <div key={person.id} className="cast-member">
                    <img
                      src={getProfileUrl(person.profile_path)}
                      alt={person.name}
                      className="cast-photo"
                    />
                    <h4 className="cast-name">{person.name}</h4>
                    <p className="cast-character">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <section className="videos-section">
              <h2 className="section-title">Videos</h2>
              <div className="videos-grid">
                {videos.slice(0, 6).map(video => (
                  <div key={video.id} className="video-item">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="video-iframe"
                    />
                    <h4 className="video-title">{video.name}</h4>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
