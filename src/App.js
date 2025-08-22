import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import SearchResults from './components/SearchResults';
import MovieList from './components/MovieList';
import Discover from './components/Discover';
import { initializeAnimations } from './utils/animations';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize all animations and effects when the app mounts
    initializeAnimations();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/:category" element={<MovieList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
