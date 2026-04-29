const getBaseUrl = () => window.APP_CONFIG?.API_BASE_URL ?? '';

/**
 * Checks backend health. Public endpoint — no API key needed.
 * Never throws: returns { status: 'error', db: 'unavailable' } on network failure.
 * @returns {Promise<{ status: 'ok'|'degraded'|'error', db: 'ok'|'unavailable' }>}
 */
export async function getHealth() {
  try {
    const response = await fetch(`${getBaseUrl()}/health`);
    return await response.json();
  } catch {
    return { status: 'error', db: 'unavailable' };
  }
}
