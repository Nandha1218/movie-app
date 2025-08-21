// Animation utilities for the movie app

// Intersection Observer for fade-in animations
export const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Add staggered animation delays for movie cards
        if (entry.target.classList.contains('movie-card')) {
          const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
          entry.target.style.animationDelay = `${index * 0.1}s`;
        }
      }
    });
  }, observerOptions);

  // Observe all movie cards and other animated elements
  document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    observer.observe(el);
  });

  return observer;
};

// Parallax effect for hero sections
export const initParallaxEffect = () => {
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    parallaxElements.forEach(element => {
      const yPos = -(scrolled * parallaxSpeed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  };

  // Use requestAnimationFrame for smooth animations
  let ticking = false;
  const scrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', scrollHandler, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', scrollHandler);
  };
};

// Typeahead animation for search suggestions
export const animateSearchSuggestions = (suggestions, container) => {
  container.innerHTML = '';
  
  suggestions.forEach((suggestion, index) => {
    const item = document.createElement('div');
    item.className = 'search-suggestion animate-slide-in-left';
    item.style.animationDelay = `${index * 0.1}s`;
    item.textContent = suggestion;
    container.appendChild(item);
  });
};

// Ripple effect for buttons
export const addRippleEffect = (button, event) => {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
};

// Check if user prefers reduced motion
export const respectsReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Accessibility: Focus management
export const initFocusManagement = () => {
  // Add visible focus indicators
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
};

// Loading animation with movie reel
export const showCustomLoader = (container) => {
  const loader = document.createElement('div');
  loader.className = 'custom-loader';
  loader.innerHTML = `
    <div class="loading-reel"></div>
    <p>Loading amazing movies...</p>
  `;
  container.appendChild(loader);
  return loader;
};

// Initialize all animations and effects
export const initializeAnimations = () => {
  // Check for reduced motion preference
  if (respectsReducedMotion()) {
    return;
  }

  initScrollAnimations();
  initParallaxEffect();
  initFocusManagement();

  // Add ripple effect to all buttons
  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn, .search-btn, .hero-btn')) {
      addRippleEffect(e.target, e);
    }
  });
};
