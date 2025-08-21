// Configuration file for Movie Search App
// Copy this file to .env.local and add your actual API keys

// TMDB API Configuration
// Get your API key from: https://www.themoviedb.org/settings/api
export const config = {
  TMDB_API_KEY: process.env.REACT_APP_TMDB_API_KEY || 'YOUR_TMDB_API_KEY_HERE',
  
  // App Configuration
  APP_NAME: 'Movie Search App',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  API_BASE_URL: 'https://api.themoviedb.org/3',
  API_LANGUAGE: 'en-US',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGES_DISPLAY: 5,
  
  // Image Configuration
  DEFAULT_POSTER_SIZE: 'w500',
  DEFAULT_BACKDROP_SIZE: 'w1280',
  DEFAULT_PROFILE_SIZE: 'w185',
};

// Instructions:
// 1. Create a .env.local file in the root directory
// 2. Add: REACT_APP_TMDB_API_KEY=your_actual_api_key_here
// 3. Restart the development server
