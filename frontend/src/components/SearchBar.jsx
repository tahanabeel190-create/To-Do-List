import React from 'react';
import { IconSearch, IconX } from './Icons';
import './components.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar-wrapper">
      <span className="search-icon-prefix">
        <IconSearch size={16} />
      </span>
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search tasks by title..." 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button 
          className="search-clear-btn" 
          onClick={() => onSearchChange('')}
          title="Clear search"
          aria-label="Clear search"
        >
          <IconX size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
