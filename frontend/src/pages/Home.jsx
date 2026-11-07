import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';
import ConfirmModal from '../components/ConfirmModal';
import { 
  IconLayers, 
  IconClock, 
  IconCheckCircle, 
  IconSparkles, 
  IconDownload, 
  IconTrash,
  IconSort,
  IconCheck
} from '../components/Icons';

const API_URL = '/tasks';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Added');
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: () => {}
  });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      showNotification('Could not connect to the backend server.', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
        showNotification('Task created successfully!');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      showNotification('Failed to save task.', 'error');
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
        setEditingTask(null);
        showNotification('Task updated successfully!');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showNotification('Failed to update task.', 'error');
    }
  };

  const confirmDeleteTask = (task) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      confirmText: 'Delete Task',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        await executeDeleteTask(task.id);
      }
    });
  };

  const executeDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        showNotification('Task deleted.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Failed to delete task.', 'error');
    }
  };

  const handleCompleteToggle = async (taskId, isCompleted) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      handleUpdateTask(taskId, { ...taskToUpdate, completed: isCompleted });
    }
  };

  const handleClearCompleted = () => {
    const completedList = tasks.filter(t => t.completed);
    if (completedList.length === 0) return;

    setConfirmModal({
      isOpen: true,
      title: 'Clear Completed Tasks',
      message: `Delete all ${completedList.length} completed task(s)? This cannot be undone.`,
      confirmText: `Clear ${completedList.length} Task${completedList.length > 1 ? 's' : ''}`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        for (const t of completedList) {
          await executeDeleteTask(t.id);
        }
      }
    });
  };

  const handleLoadSamples = async () => {
    const sampleTasks = [
      {
        title: 'Review system architecture & API design',
        description: 'Ensure endpoints follow REST guidelines and data contracts are validated.',
        priority: 'High',
        dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10)
      },
      {
        title: 'Implement Dark & Light mode toggle',
        description: 'Provide persistent user theme preferences using CSS variables.',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 172800000).toISOString().slice(0, 10)
      },
      {
        title: 'Deploy production service to Render',
        description: 'Configure build.sh and gunicorn web worker for seamless hosting.',
        priority: 'Low',
        dueDate: ''
      }
    ];

    for (const sample of sampleTasks) {
      await handleAddTask(sample);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `tasks-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification('Tasks exported to JSON');
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Filtering
  let filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true; // All
  });

  // Sorting
  filteredTasks.sort((a, b) => {
    if (sortBy === 'Due Date') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'Priority') {
      const pValues = { High: 3, Medium: 2, Low: 1 };
      const valA = pValues[a.priority] || 0;
      const valB = pValues[b.priority] || 0;
      return valB - valA;
    }
    // Recently Added (descending by id)
    return b.id - a.id;
  });

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        {/* Modern Stats Overview */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Total Tasks</span>
              <div className="stat-icon-wrapper primary">
                <IconLayers size={18} />
              </div>
            </div>
            <div className="stat-value">{totalTasks}</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Active / Pending</span>
              <div className="stat-icon-wrapper warning">
                <IconClock size={18} />
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--warning-color)' }}>
              {pendingTasks}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Completed</span>
              <div className="stat-icon-wrapper success">
                <IconCheckCircle size={18} />
              </div>
            </div>
            <div className="stat-value" style={{ color: 'var(--success-color)' }}>
              {completedTasks}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-label">Productivity</span>
              <div className="stat-icon-wrapper primary">
                <IconSparkles size={18} />
              </div>
            </div>
            <div className="stat-value">
              {completionPercentage}%
            </div>
            <div className="stat-progress-bar-bg">
              <div 
                className="stat-progress-bar-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Home Layout */}
        <div className="home-layout">
          {/* Left Column: Form */}
          <aside>
            <TaskForm 
              onAddTask={handleAddTask} 
              editingTask={editingTask}
              onUpdateTask={handleUpdateTask}
              onCancelEdit={() => setEditingTask(null)}
            />
          </aside>
          
          {/* Right Column: Controls, Actions & Task List */}
          <section>
            <div className="controls-container">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              
              <div className="filter-and-sort">
                <FilterButtons 
                  filter={filter} 
                  onFilterChange={setFilter} 
                  counts={{
                    all: totalTasks,
                    pending: pendingTasks,
                    completed: completedTasks
                  }}
                />
                
                <div className="sort-dropdown">
                  <IconSort size={15} style={{ color: 'var(--text-faint)' }} />
                  <span className="sort-label">Sort:</span>
                  <select 
                    className="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Recently Added">Recent</option>
                    <option value="Due Date">Due Date</option>
                    <option value="Priority">Priority</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="actions-toolbar">
              <div className="task-list-count">
                Showing <strong>{filteredTasks.length}</strong> of {totalTasks} task{totalTasks === 1 ? '' : 's'}
              </div>

              <div className="actions-buttons-group">
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={handleExportJSON}
                  title="Export tasks as JSON file"
                >
                  <IconDownload size={14} />
                  Export JSON
                </button>
                {completedTasks > 0 && (
                  <button 
                    className="btn btn-danger-outline btn-sm" 
                    onClick={handleClearCompleted}
                    title="Delete all completed tasks"
                  >
                    <IconTrash size={14} />
                    Clear Completed
                  </button>
                )}
              </div>
            </div>

            <TaskList 
              tasks={filteredTasks} 
              onComplete={handleCompleteToggle}
              onDelete={confirmDeleteTask}
              onEdit={setEditingTask}
              isSearching={searchTerm.trim().length > 0}
              onClearSearch={() => setSearchTerm('')}
              onLoadSamples={handleLoadSamples}
            />
          </section>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="toast-container">
          <div className="toast" style={{
            borderLeftColor: notification.type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'
          }}>
            <IconCheck size={16} style={{ color: notification.type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)' }} />
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
