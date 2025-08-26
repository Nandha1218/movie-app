import axios from 'axios';

// TMDB API configuration
const API_BASE_URL = 'https://api.themoviedb.org/3';

// For development, you can use a demo key or get your own from TMDB
// Visit: https://www.themoviedb.org/settings/api
const API_KEY = process.env.REACT_APP_TMDB_API_KEY || '9f9a757cb62eff6be8b4396f051a86be';

// Create axios instance with base configuration
const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Add request interceptor to check API key
tmdbApi.interceptors.request.use(
  (config) => {
    if (API_KEY === 'YOUR_TMDB_API_KEY') {
      console.warn('⚠️ Please set your TMDB API key in src/services/tmdb.js or as REACT_APP_TMDB_API_KEY environment variable');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Invalid TMDB API key. Please check your API key configuration.');
    } else if (error.response?.status === 429) {
      console.error('⏰ TMDB API rate limit exceeded. Please wait before making more requests.');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const tmdbEndpoints = {
  trending: '/trending/movie/week',
  search: '/search/movie',
  movieDetails: (id) => `/movie/${id}`,
  movieCredits: (id) => `/movie/${id}/credits`,
  movieVideos: (id) => `/movie/${id}/videos`,
  topRated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  nowPlaying: '/movie/now_playing',
  discover: '/discover/movie',
  languages: '/configuration/languages',
  countries: '/configuration/countries',
};

// Helper function to get full image URL
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to get poster URL
export const getPosterUrl = (path) => getImageUrl(path, 'w500');

// Helper function to get backdrop URL
export const getBackdropUrl = (path) => getImageUrl(path, 'w1280');

// Helper function to get profile URL
export const getProfileUrl = (path) => getImageUrl(path, 'w185');

// API functions
export const tmdbService = {
  // Get trending movies
  getTrendingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.trending, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query, page = 1, language = null) => {
    try {
      const params = { query, page };
      if (language) {
        params.language = language;
      }
      
      const response = await tmdbApi.get(tmdbEndpoints.search, { params });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (id) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.movieDetails(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Get movie credits
  getMovieCredits: async (id) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.movieCredits(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching movie credits:', error);
      throw error;
    }
  },

  // Get movie videos
  getMovieVideos: async (id) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.movieVideos(id));
      return response.data;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  },

  // Get top rated movies
  getTopRatedMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.topRated, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  // Get upcoming movies
  getUpcomingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.upcoming, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  },

  // Get now playing movies
  getNowPlayingMovies: async (page = 1) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.nowPlaying, {
        params: { page },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  },

  // Discover movies
  discoverMovies: async (filters) => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.discover, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error discovering movies:', error);
      throw error;
    }
  },

  // Get languages
  getLanguages: async () => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.languages);
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  },

  // Get countries
  getCountries: async () => {
    try {
      const response = await tmdbApi.get(tmdbEndpoints.countries);
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },
};

export default tmdbService;
