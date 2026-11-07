import React, { useEffect, useState } from 'react';
import { IconSun, IconMoon, IconLayers } from './Icons';
import './components.css';

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('taskflow-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taskflow-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar-brand-section">
          <div className="navbar-logo-badge">
            <IconLayers size={22} />
          </div>
          <div className="navbar-titles">
            <div className="navbar-brand">
              TaskFlow
            </div>
            <span className="navbar-tagline">Focus &amp; Productivity</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-date-badge" title="Live status">
            <span className="navbar-pulse-dot"></span>
            <span>{currentDate}</span>
          </div>

          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
