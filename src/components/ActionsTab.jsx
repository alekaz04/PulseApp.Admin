import { useState } from 'react';
import { sendPushToAll } from '../api/admin.js';
import './ActionsTab.css';

export function ActionsTab({ addToast }) {
  const [form, setForm] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
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
        <button type="submit" className="push-submit-btn" disabled={loading}>
          {loading ? 'Отправка...' : 'Отправить всем'}
        </button>
      </form>
    </div>
  );
}
