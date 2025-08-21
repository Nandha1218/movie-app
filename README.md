# Movie Search App 🎬

A modern, responsive movie search application that fetches data from the TMDB API to display trending movies, ratings, and comprehensive movie details.

## ✨ Features

- **🎯 Trending Movies**: Discover what's popular this week
- **⭐ Top Rated**: Browse the highest-rated movies
- **📅 Upcoming**: See what's coming to theaters
- **🔍 Search**: Find movies by title, actor, or genre
- **📱 Responsive Design**: Works perfectly on all devices
- **🎭 Movie Details**: Comprehensive information including cast, videos, and ratings
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd movie_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get TMDB API Key**
   - Visit [TMDB](https://www.themoviedb.org/)
   - Create an account and log in
   - Go to your account settings
   - Click on "API" in the left sidebar
   - Request an API key (choose "Developer" option)
   - Copy your API key

4. **Configure API Key**
   - Open `src/services/tmdb.js`
   - Replace `YOUR_TMDB_API_KEY` with your actual API key:
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Enjoy your movie app! 🎉

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **CSS3** - Modern styling with gradients and animations

## 📱 App Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation and search
│   ├── Home.js         # Landing page with movie sections
│   ├── MovieCard.js    # Individual movie display
│   ├── MovieDetail.js  # Detailed movie information
│   └── SearchResults.js # Search functionality
├── services/           # API services
│   └── tmdb.js        # TMDB API integration
├── App.js             # Main app component
└── index.js           # App entry point
```

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## 🌟 Key Features Explained

### Home Page
- **Hero Section**: Features the top trending movie with backdrop image
- **Trending Movies**: Shows the most popular movies this week
- **Top Rated**: Displays highest-rated movies
- **Upcoming**: Shows movies coming to theaters soon

### Movie Details
- **Comprehensive Info**: Title, rating, release date, runtime, genres
- **Cast Information**: Top 10 cast members with photos
- **Video Trailers**: YouTube videos and trailers
- **Official Website**: Direct link to movie's official site

### Search Functionality
- **Real-time Search**: Find movies by any keyword
- **Pagination**: Navigate through search results
- **Sorting Options**: Sort by relevance, rating, date, or title
- **Responsive Results**: Beautiful grid layout for all screen sizes

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-blue gradients
- **Glass Morphism**: Modern translucent UI elements
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adapts to all screen sizes
- **Modern Typography**: Clean, readable fonts

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔑 API Endpoints Used

- `/trending/movie/week` - Weekly trending movies
- `/movie/top_rated` - Top rated movies
- `/movie/upcoming` - Upcoming releases
- `/search/movie` - Movie search
- `/movie/{id}` - Movie details
- `/movie/{id}/credits` - Cast and crew
- `/movie/{id}/videos` - Trailers and videos

## 🚨 Important Notes

- **API Key Required**: You must have a valid TMDB API key
- **Rate Limiting**: TMDB has rate limits for API calls
- **Image URLs**: Movie posters and backdrops are served from TMDB's CDN
- **CORS**: The app handles CORS through the TMDB API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [React](https://reactjs.org/) for the amazing framework
- [Create React App](https://create-react-app.dev/) for the project setup

## 📞 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Verify your API key is correct
3. Ensure you have a stable internet connection
4. Check if TMDB API is accessible

---

**Happy Movie Browsing! 🎬✨**
