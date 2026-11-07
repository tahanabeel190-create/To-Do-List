import React, { useState, useEffect } from 'react';
import { IconPlus, IconEdit, IconAlertCircle } from './Icons';
import './components.css';

const TaskForm = ({ onAddTask, editingTask, onUpdateTask, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'Medium');
      setDueDate(editingTask.dueDate || '');
    } else {
      resetForm();
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate
    };

    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
    
    resetForm();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setError('');
  };

  return (
    <div className={`task-form-card ${editingTask ? 'is-editing' : ''}`}>
      <div className="task-form-header">
        <h2 className="task-form-title">
          {editingTask ? (
            <>
              <IconEdit size={18} />
              Edit Task
            </>
          ) : (
            <>
              <IconPlus size={18} />
              New Task
            </>
          )}
        </h2>
        {editingTask && (
          <span className="editing-badge">Editing #{editingTask.id}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <div className="form-group">
          <label className="form-label">
            <span>Title <span style={{ color: 'var(--danger-color)' }}>*</span></span>
          </label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. Design homepage hero section"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            autoFocus={!!editingTask}
          />
          {error && (
            <div className="form-error">
              <IconAlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <span>Description</span>
            <span className="form-label-hint">Optional</span>
          </label>
          <textarea 
            className="form-input" 
            rows="3" 
            placeholder="Add context, subtasks, or links..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label className="form-label">Priority</label>
          <div className="priority-selector">
            {['Low', 'Medium', 'High'].map((p) => {
              const isSelected = priority === p;
              const selectedClass = isSelected ? `selected-${p.toLowerCase()}` : '';
              return (
                <button
                  type="button"
                  key={p}
                  className={`priority-option-btn ${selectedClass}`}
                  onClick={() => setPriority(p)}
                >
                  <span className="badge-dot" style={{
                    background: p === 'High' ? '#f43f5e' : p === 'Medium' ? '#f59e0b' : '#10b981'
                  }}></span>
                  {p}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <span>Due Date</span>
            <span className="form-label-hint">Optional</span>
          </label>
          <input 
            type="date" 
            className="form-input" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <div className="date-quick-chips">
            <button
              type="button"
              className={`date-chip-btn ${dueDate === new Date().toISOString().slice(0, 10) ? 'active' : ''}`}
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10);
                setDueDate(today);
              }}
            >
              Today
            </button>
            <button
              type="button"
              className="date-chip-btn"
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                setDueDate(tomorrow.toISOString().slice(0, 10));
              }}
            >
              Tomorrow
            </button>
            <button
              type="button"
              className="date-chip-btn"
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setDueDate(nextWeek.toISOString().slice(0, 10));
              }}
            >
              +1 Week
            </button>
            {dueDate && (
              <button
                type="button"
                className="date-chip-btn"
                style={{ color: 'var(--danger-color)' }}
                onClick={() => setDueDate('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {editingTask ? (
              <>
                <IconEdit size={16} />
                Update Task
              </>
            ) : (
              <>
                <IconPlus size={16} />
                Create Task
              </>
            )}
          </button>

          {editingTask && (
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={() => {
                resetForm();
                onCancelEdit();
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="form-footer-tip">
          <span>Press</span>
          <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">Enter</kbd>
          <span>to save</span>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
