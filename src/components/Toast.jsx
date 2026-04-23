import { useEffect } from 'react';
import './Toast.css';

export function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Закрыть">
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() => onRemove(t.id)}
        />
      ))}
    </div>
  );
}
