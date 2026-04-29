import { useState, useEffect, useCallback, useRef } from 'react';
import { getHealth } from '../api/health.js';
import './HealthTab.css';

const STATUS_CLASS = {
  ok: 'badge-ok',
  degraded: 'badge-degraded',
  error: 'badge-error',
};

const STATUS_LABEL = {
  ok: 'OK',
  degraded: 'Деградация',
  error: 'Недоступен',
};

const DB_LABEL = {
  ok: 'OK',
  unavailable: 'Недоступна',
};

export function HealthTab() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const intervalRef = useRef(null);

  const check = useCallback(async () => {
    setLoading(true);
    const data = await getHealth();
    setHealth(data);
    setLastChecked(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    check();
    intervalRef.current = setInterval(check, 30_000);
    return () => clearInterval(intervalRef.current);
  }, [check]);

  const statusClass = health ? (STATUS_CLASS[health.status] ?? 'badge-error') : 'badge-error';
  const statusLabel = health ? (STATUS_LABEL[health.status] ?? health.status) : '—';
  const dbLabel = health ? (DB_LABEL[health.db] ?? health.db) : '—';
  const dbClass = health?.db === 'ok' ? 'badge-ok' : 'badge-error';

  return (
    <div className="health-tab">
      <div className="health-header">
        <h2>Состояние системы</h2>
        <button className="health-refresh-btn" onClick={check} disabled={loading}>
          {loading ? 'Проверка...' : 'Проверить'}
        </button>
      </div>

      <div className="health-card">
        <div className="health-row">
          <span className="health-label">Backend</span>
          <span className={`health-badge ${statusClass}`}>{statusLabel}</span>
        </div>
        <div className="health-row">
          <span className="health-label">База данных</span>
          <span className={`health-badge ${dbClass}`}>{dbLabel}</span>
        </div>
      </div>

      {lastChecked && (
        <div className="health-last-check">
          Последняя проверка: {lastChecked.toLocaleTimeString('ru-RU')}
        </div>
      )}
    </div>
  );
}
