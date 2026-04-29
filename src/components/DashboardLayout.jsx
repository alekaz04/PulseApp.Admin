import { useState, useCallback } from 'react';
import { ToastContainer } from './Toast.jsx';
import { ComplimentsTab } from './ComplimentsTab.jsx';
import { ActionsTab } from './ActionsTab.jsx';
import { SubscriptionsTab } from './SubscriptionsTab.jsx';
import { HealthTab } from './HealthTab.jsx';
import './DashboardLayout.css';

const TABS = [
  { id: 'compliments', label: 'Комплименты' },
  { id: 'actions', label: 'Действия' },
  { id: 'subscriptions', label: 'Подписки' },
  { id: 'health', label: 'Здоровье' },
];

export function DashboardLayout({ onLogout }) {
  const [activeTab, setActiveTab] = useState('compliments');
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <span className="dashboard-title">PulseApp Admin</span>
        <button className="btn-logout" onClick={onLogout}>
          Выйти
        </button>
      </header>

      <nav className="dashboard-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="dashboard-content">
        {activeTab === 'compliments' && <ComplimentsTab addToast={addToast} />}
        {activeTab === 'actions' && <ActionsTab addToast={addToast} />}
        {activeTab === 'subscriptions' && <SubscriptionsTab addToast={addToast} />}
        {activeTab === 'health' && <HealthTab />}
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
