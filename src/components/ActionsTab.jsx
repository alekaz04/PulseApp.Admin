import { useState } from 'react';
import { sendPushToAll, resetComplimentPool } from '../api/admin.js';
import './ActionsTab.css';

export function ActionsTab({ addToast }) {
  const [form, setForm] = useState({ title: '', body: '' });
  const [pushLoading, setPushLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPushLoading(true);
    try {
      const result = await sendPushToAll({ title: form.title, body: form.body });
      addToast(
        `Отправлено: ${result.totalSubscriptions} подписчик(ов)`,
        'success'
      );
      setForm({ title: '', body: '' });
    } catch (err) {
      addToast(`Ошибка отправки: ${err.message}`, 'error');
    } finally {
      setPushLoading(false);
    }
  };

  const handleResetPool = async () => {
    if (!confirm('Сбросить пул? Все комплименты снова станут доступны для отправки.')) return;
    setResetLoading(true);
    try {
      const count = await resetComplimentPool();
      addToast(`Пул сброшен: ${count} комплимент(ов) снова доступно`, 'success');
    } catch (err) {
      addToast(`Ошибка сброса пула: ${err.message}`, 'error');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="actions-tab">
      <h2>Ручная рассылка</h2>
      <form className="push-form" onSubmit={handleSubmit}>
        <label htmlFor="push-title">Заголовок уведомления</label>
        <input
          id="push-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Например: Привет!"
          required
        />
        <label htmlFor="push-body">Текст уведомления</label>
        <textarea
          id="push-body"
          rows={4}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="Текст push-уведомления..."
          required
        />
        <button type="submit" className="push-submit-btn" disabled={pushLoading}>
          {pushLoading ? 'Отправка...' : 'Отправить всем'}
        </button>
      </form>

      <div className="reset-pool-card">
        <div className="reset-pool-info">
          <strong>Сбросить пул комплиментов</strong>
          <p>Снимает флаг «уже отправлен» со всех комплиментов — они снова войдут в ротацию.</p>
        </div>
        <button
          className="reset-pool-btn"
          onClick={handleResetPool}
          disabled={resetLoading}
        >
          {resetLoading ? 'Сброс...' : 'Сбросить пул'}
        </button>
      </div>
    </div>
  );
}
