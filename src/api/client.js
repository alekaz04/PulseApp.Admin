const getBaseUrl = () => window.APP_CONFIG?.API_BASE_URL ?? '';
const getApiKey = () => localStorage.getItem('pulse_api_key') ?? '';

const handleUnauthorized = () => {
  localStorage.removeItem('pulse_api_key');
  window.location.reload();
};

/**
 * Base fetch client. Automatically adds x-api-key and Content-Type headers.
 * On 401 — clears the key and reloads the page.
 * @param {string} path — path relative to API_BASE_URL
 * @param {RequestInit} options — fetch options
 * @returns {Promise<any>} — parsed JSON or null on 204
 */
export async function apiFetch(path, options = {}) {
  const url = `${getBaseUrl()}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': getApiKey(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
