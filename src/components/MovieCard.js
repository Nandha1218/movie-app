import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaPlay } from 'react-icons/fa';
import { getPosterUrl } from '../services/tmdb';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
    overview
  } = movie;

  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';

  return (
    <Link to={`/movie/${id}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster-container">
          <img
            src={getPosterUrl(poster_path)}
            alt={title}
            className="movie-poster"
            loading="lazy"
          />
          <div className="movie-overlay">
            <div className="movie-overlay-content">
              <FaPlay className="play-icon" />
              <span>View Details</span>
            </div>
          </div>
        </div>
        
        <div className="movie-info">
          <h3 className="movie-title" title={title}>
            {title}
          </h3>
          
          <div className="movie-meta">
            <div className="movie-rating">
              <FaStar className="star-icon" />
              <span>{rating}</span>
            </div>
            <span className="movie-year">{year}</span>
          </div>
          
          {overview && (
            <p className="movie-overview" title={overview}>
              {overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
