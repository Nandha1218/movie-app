import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
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
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState('');

  const discoverType = searchParams.get('type') || 'language';

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;
        
        switch (discoverType) {
          case 'language':
            response = await tmdbService.getLanguages();
            break;
          case 'region':
            response = await tmdbService.getCountries();
            break;
          case 'genre':
            response = await tmdbService.getGenres();
            break;
          case 'year':
            // Generate years from 1900 to current year
            const currentYear = new Date().getFullYear();
            response = Array.from({ length: currentYear - 1899 }, (_, i) => ({
              iso_3166_1: (currentYear - i).toString(),
              english_name: (currentYear - i).toString()
            }));
            break;
          default:
            response = await tmdbService.getLanguages();
        }
        
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
      let filters = {
        sort_by: sortBy,
        page: 1
      };
      
      switch (discoverType) {
        case 'language':
          filters.with_original_language = option;
          break;
        case 'region':
          filters.region = option;
          break;
        case 'genre':
          filters.with_genres = option;
          break;
        case 'year':
          filters.primary_release_year = option;
          break;
      }
      
      if (minRating) {
        filters['vote_average.gte'] = minRating;
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
          <div className="control-group">
            <label htmlFor="option-select">
              <FaFilter /> Select {discoverType}
            </label>
            <select 
              id="option-select"
              onChange={handleOptionChange} 
              value={selectedOption}
              className="control-select"
            >
              <option value="">Choose {discoverType}</option>
              {options.map((option) => (
                <option 
                  key={option.iso_639_1 || option.iso_3166_1 || option.id} 
                  value={option.iso_639_1 || option.iso_3166_1 || option.id}
                >
                  {option.english_name || option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="sort-select">
              <FaSort /> Sort By
            </label>
            <select 
              id="sort-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="popularity.desc">Popularity (High to Low)</option>
              <option value="popularity.asc">Popularity (Low to High)</option>
              <option value="vote_average.desc">Rating (High to Low)</option>
              <option value="vote_average.asc">Rating (Low to High)</option>
              <option value="release_date.desc">Release Date (Newest)</option>
              <option value="release_date.asc">Release Date (Oldest)</option>
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="rating-select">
              <FaSearch /> Min Rating
            </label>
            <select 
              id="rating-select"
              value={minRating} 
              onChange={(e) => setMinRating(e.target.value)}
              className="control-select"
            >
              <option value="">Any Rating</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>
        </div>
        
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        
        {movies.length > 0 && (
          <div className="results-info">
            <p>Found {movies.length} movies</p>
          </div>
        )}
        
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {movies.length === 0 && !loading && !error && selectedOption && (
          <div className="no-results">
            <p>No movies found with the selected criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
