import React from 'react';
import { IconSparkles, IconSearch } from './Icons';
import './components.css';

const EmptyState = ({ isSearching, onClearSearch, onLoadSamples }) => {
  if (isSearching) {
    return (
      <div className="empty-state">
        <div className="empty-state-graphic">
          <IconSearch size={36} />
        </div>
        <h3 className="empty-state-title">No matching tasks found</h3>
        <p className="empty-state-desc">
          Try refining your search keyword or clearing the search filter.
        </p>
        {onClearSearch && (
          <button className="btn btn-outline btn-sm" onClick={onClearSearch}>
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-graphic">
        <IconSparkles size={38} />
      </div>
      <h3 className="empty-state-title">No tasks on your plate</h3>
      <p className="empty-state-desc">
        Enjoy your free time, or create your first task using the form on the left.
      </p>
      {onLoadSamples && (
        <button className="btn btn-outline btn-sm" onClick={onLoadSamples} style={{ marginTop: '0.5rem' }}>
          <IconSparkles size={14} />
          Load Sample Tasks
        </button>
      )}
    </div>
  );
};

export default EmptyState;
