import React from 'react';
import './components.css';

const FilterButtons = ({ filter, onFilterChange, counts = { all: 0, pending: 0, completed: 0 } }) => {
  const filters = [
    { key: 'All', label: 'All', count: counts.all },
    { key: 'Pending', label: 'Active', count: counts.pending },
    { key: 'Completed', label: 'Completed', count: counts.completed }
  ];

  return (
    <div className="filter-buttons">
      {filters.map((f) => (
        <button 
          key={f.key}
          className={`filter-btn ${filter === f.key ? 'active' : ''}`}
          onClick={() => onFilterChange(f.key)}
        >
          <span>{f.label}</span>
          <span className="filter-count">{f.count}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
