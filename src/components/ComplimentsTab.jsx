import { useState, useEffect, useCallback } from 'react';
import {
  getCompliments,
  createCompliment,
  createBatchCompliments,
  updateCompliment,
  deleteCompliment,
} from '../api/compliments.js';
import './ComplimentsTab.css';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' });

const truncate = (str, n = 60) =>
  str.length > n ? str.slice(0, n) + '…' : str;

export function ComplimentsTab({ addToast }) {
  const [compliments, setCompliments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', text: '', isBeenPushed: false });
  const [createForm, setCreateForm] = useState({ title: '', text: '' });
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchJson, setBatchJson] = useState('');

  const loadCompliments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompliments();
      setCompliments(data);
    } catch (err) {
      addToast(`Ошибка загрузки: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCompliments();
  }, [loadCompliments]);

  const startEdit = (c) => {
    setEditingId(c.id);
    setEditForm({ title: c.title, text: c.text, isBeenPushed: c.isBeenPushed });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (id) => {
    try {
      await updateCompliment(id, editForm);
      setCompliments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...editForm } : c))
      );
      setEditingId(null);
      addToast('Комплимент обновлён', 'success');
    } catch (err) {
      addToast(`Ошибка обновления: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить комплимент?')) return;
    try {
      await deleteCompliment(id);
      setCompliments((prev) => prev.filter((c) => c.id !== id));
      addToast('Комплимент удалён', 'success');
    } catch (err) {
      addToast(`Ошибка удаления: ${err.message}`, 'error');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCompliment({ title: createForm.title, text: createForm.text });
      setCreateForm({ title: '', text: '' });
      addToast('Комплимент добавлен', 'success');
      await loadCompliments();
    } catch (err) {
      addToast(`Ошибка создания: ${err.message}`, 'error');
    }
  };

  const handleBatchImport = async () => {
    let parsed;
    try {
      parsed = JSON.parse(batchJson);
    } catch {
      addToast('Невалидный JSON', 'error');
      return;
    }
    if (!Array.isArray(parsed)) {
      addToast('Ожидается массив JSON: [{"title":"...","text":"..."}]', 'error');
      return;
    }
    try {
      await createBatchCompliments(parsed);
      setBatchJson('');
      setBatchOpen(false);
      addToast(`Импортировано ${parsed.length} комплиментов`, 'success');
      await loadCompliments();
    } catch (err) {
      addToast(`Ошибка импорта: ${err.message}`, 'error');
    }
  };

  return (
    <div className="compliments-tab">
      <div className="compliments-header">
        <h2>Комплименты</h2>
        <button className="refresh-btn" onClick={loadCompliments} disabled={loading}>
          Обновить
        </button>
        <span className="compliments-count">{compliments.length} шт.</span>
      </div>

      {loading && <div className="tab-loading">Загрузка...</div>}

      {!loading && <table className="compliments-table">
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Текст</th>
            <th>Отправлен</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {compliments.length === 0 && (
            <tr>
              <td colSpan={5} className="empty-state">
                Комплиментов нет. Добавьте первый ниже.
              </td>
            </tr>
          )}
          {compliments.map((c) =>
            editingId === c.id ? (
              <tr key={c.id} className="editing">
                <td>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, title: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <textarea
                    value={editForm.text}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, text: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={editForm.isBeenPushed}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, isBeenPushed: e.target.checked }))
                    }
                  />
                </td>
                <td>{formatDate(c.createdAt)}</td>
                <td>
                  <button className="save-btn" onClick={() => saveEdit(c.id)}>
                    Сохранить
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>
                    Отмена
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td className="text-cell" title={c.text}>
                  {truncate(c.text)}
                </td>
                <td>{c.isBeenPushed ? '✅' : '❌'}</td>
                <td>{formatDate(c.createdAt)}</td>
                <td>
                  <button className="action-btn" onClick={() => startEdit(c)} title="Редактировать">
                    ✏️
                  </button>
                  <button className="action-btn" onClick={() => handleDelete(c.id)} title="Удалить">
                    🗑
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>}

      <section className="create-form">
        <h3>Добавить комплимент</h3>
        <form onSubmit={handleCreate}>
          <input
            placeholder="Заголовок"
            value={createForm.title}
            onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Текст комплимента"
            value={createForm.text}
            onChange={(e) => setCreateForm((f) => ({ ...f, text: e.target.value }))}
            required
          />
          <button type="submit" className="create-submit-btn">
            Добавить
          </button>
        </form>
      </section>

      <section className="batch-section">
        <button
          className="batch-toggle-btn"
          onClick={() => setBatchOpen((v) => !v)}
        >
          {batchOpen ? '▲ Скрыть batch-импорт' : '▼ Batch-импорт (JSON)'}
        </button>
        {batchOpen && (
          <div className="batch-body">
            <textarea
              rows={6}
              placeholder={'[\n  {"title": "Заголовок", "text": "Текст"},\n  ...\n]'}
              value={batchJson}
              onChange={(e) => setBatchJson(e.target.value)}
            />
            <button className="batch-import-btn" onClick={handleBatchImport}>
              Импортировать
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
