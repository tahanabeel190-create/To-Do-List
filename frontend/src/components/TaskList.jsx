import React from 'react';
import TaskCard from './TaskCard';
import EmptyState from './EmptyState';
import './components.css';

const TaskList = ({ tasks, onComplete, onDelete, onEdit, isSearching, onClearSearch, onLoadSamples }) => {
  if (!tasks || tasks.length === 0) {
    return <EmptyState isSearching={isSearching} onClearSearch={onClearSearch} onLoadSamples={onLoadSamples} />;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onComplete={onComplete}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;
