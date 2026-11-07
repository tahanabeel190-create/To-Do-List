import React, { useEffect } from 'react';
import { IconAlertCircle, IconTrash } from './Icons';
import './components.css';

const ConfirmModal = ({ isOpen, title, message, confirmText = "Confirm", confirmVariant = "danger", onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className={`modal-icon-badge ${confirmVariant}`}>
            {confirmVariant === 'danger' ? <IconTrash size={20} /> : <IconAlertCircle size={20} />}
          </div>
          <div>
            <h3 className="modal-title">{title}</h3>
            <p className="modal-desc">{message}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button 
            type="button" 
            className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

