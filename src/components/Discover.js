import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import tmdbService from '../services/tmdb';
import MovieCard from './MovieCard';
import './Discover.css';

const Discover = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [options, setOptions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');

  const discoverType = searchParams.get('type') || 'language';

  useEffect(() => {
    console.log('discoverType:', discoverType);
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        if (discoverType === 'language') {
          response = await tmdbService.getLanguages();
        } else {
          response = await tmdbService.getCountries();
        }
        console.log('options:', response);
        setOptions(response);
      } catch (err) {
        console.error(`Error fetching ${discoverType}:`, err);
        setError(`Failed to fetch ${discoverType}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [discoverType]);

  const handleOptionChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value) {
      fetchMovies(value);
    }
  };

  const fetchMovies = async (option) => {
    try {
      setLoading(true);
      setError(null);
      let filters = {};
      if (discoverType === 'language') {
        filters.with_original_language = option;
      } else {
        filters.region = option;
      }
      const response = await tmdbService.discoverMovies(filters);
      setMovies(response.results);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discover" key={discoverType}>
      <div className="container">
        <h1 className="page-title">Discover Movies by {discoverType}</h1>
        <div className="discover-controls">
          <select onChange={handleOptionChange} value={selectedOption}>
            <option value="">Select {discoverType}</option>
            {options.map((option) => (
              <option key={option.iso_639_1 || option.iso_3166_1} value={option.iso_639_1 || option.iso_3166_1}>
                {option.english_name}
              </option>
            ))}
          </select>
        </div>
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
