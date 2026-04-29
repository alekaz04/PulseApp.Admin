import { useState, useEffect, useCallback } from 'react';
import { getSubscriptions } from '../api/admin.js';
import './SubscriptionsTab.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const truncate = (str, n = 50) =>
  str.length > n ? str.slice(0, n) + '…' : str;

export function SubscriptionsTab({ addToast }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      addToast(`Ошибка загрузки подписок: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div className="tab-loading">Загрузка...</div>;

  return (
    <div className="subscriptions-tab">
      <div className="subscriptions-header">
        <h2>Push-подписки</h2>
        <button className="refresh-btn" onClick={load} disabled={loading}>
          Обновить
        </button>
        <span className="subscriptions-count">{subscriptions.length} шт.</span>
      </div>

      <table className="subscriptions-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Endpoint</th>
            <th>P256dh</th>
            <th>Auth</th>
            <th>User Agent</th>
            <th>Создана</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.length === 0 && (
            <tr className="empty-state-row">
              <td colSpan={7}>Подписок нет</td>
            </tr>
          )}
          {subscriptions.map((s) => (
            <tr key={s.id}>
              <td className="key-cell" title={s.id}>
                {truncate(s.id, 8)}…
              </td>
              <td className="endpoint-cell" title={s.endpoint}>
                {truncate(s.endpoint)}
              </td>
              <td className="key-cell" title={s.p256dh}>
                {truncate(s.p256dh, 20)}
              </td>
              <td className="key-cell" title={s.auth}>
                {truncate(s.auth, 20)}
              </td>
              <td>{s.userAgent ?? '—'}</td>
              <td>{formatDate(s.createdAt)}</td>
              <td>
                <span className={`badge ${s.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {s.isActive ? 'Активна' : 'Неактивна'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
