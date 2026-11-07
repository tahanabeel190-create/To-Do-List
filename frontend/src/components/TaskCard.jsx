import React from 'react';
import { IconCheck, IconEdit, IconTrash, IconCalendar, IconAlertCircle } from './Icons';
import './components.css';

const TaskCard = ({ task, onComplete, onDelete, onEdit }) => {
  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'badge-high';
      case 'low':
        return 'badge-low';
      default:
        return 'badge-medium';
    }
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const isDueToday = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return today.toDateString() === dueDate.toDateString();
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
    } catch {
      return dateStr;
    }
  };

  const handleDelete = () => {
    onDelete(task);
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div 
        className="custom-checkbox-wrapper" 
        onClick={() => onComplete(task.id, !task.completed)}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        <div className={`custom-checkbox-box ${task.completed ? 'checked' : ''}`}>
          {task.completed && <IconCheck size={14} />}
        </div>
      </div>
      
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title" onClick={() => onComplete(task.id, !task.completed)} style={{ cursor: 'pointer' }}>
            {task.title}
          </h3>

          <div className="task-actions">
            {!task.completed && (
              <button 
                className="action-btn-circle" 
                onClick={() => onEdit(task)} 
                title="Edit task"
                aria-label="Edit task"
              >
                <IconEdit size={15} />
              </button>
            )}
            <button 
              className="action-btn-circle delete" 
              onClick={handleDelete} 
              title="Delete task"
              aria-label="Delete task"
            >
              <IconTrash size={15} />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
        
        <div className="task-meta">
          <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
            <span className="badge-dot"></span>
            {task.priority || 'Medium'}
          </span>
          
          {task.dueDate && (
            <span className="badge badge-date">
              <IconCalendar size={13} />
              {formatDueDate(task.dueDate)}
            </span>
          )}

          {isOverdue() && (
            <span className="badge badge-overdue">
              <IconAlertCircle size={13} />
              Overdue
            </span>
          )}

          {isDueToday() && (
            <span className="badge badge-today">
              Due Today
            </span>
          )}

          {task.completed && (
            <span className="badge badge-completed">
              <IconCheck size={12} />
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
