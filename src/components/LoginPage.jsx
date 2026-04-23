import { useState } from 'react';
import './LoginPage.css';

const getBaseUrl = () => window.APP_CONFIG?.API_BASE_URL ?? '';

export function LoginPage({ onLogin }) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${getBaseUrl()}/api/compliment`, {
        headers: { 'x-api-key': apiKey },
      });
      if (response.status === 401) {
        setError('Неверный API-ключ');
        return;
      }
      if (!response.ok) {
        setError(`Ошибка сервера: ${response.status}`);
        return;
      }
      localStorage.setItem('pulse_api_key', apiKey);
      onLogin();
    } catch {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>PulseApp Admin</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="api-key">API-ключ</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Введите API-ключ"
            required
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-submit" disabled={loading || !apiKey}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
