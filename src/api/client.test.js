import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from './client.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  window.APP_CONFIG = { API_BASE_URL: 'http://test-server' };
  localStorage.clear();
  mockFetch.mockReset();
});

describe('apiFetch', () => {
  it('sends request to correct URL with x-api-key header', async () => {
    localStorage.setItem('pulse_api_key', 'my-key');
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });

    await apiFetch('/api/compliment');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-server/api/compliment',
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-api-key': 'my-key',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('throws with status code on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Server Error'),
    });

    await expect(apiFetch('/api/test')).rejects.toThrow('HTTP 500: Server Error');
  });

  it('clears api key from localStorage on 401', async () => {
    localStorage.setItem('pulse_api_key', 'bad-key');
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    });
    window.location = { reload: vi.fn() };

    await expect(apiFetch('/api/test')).rejects.toThrow('Unauthorized');
    expect(localStorage.getItem('pulse_api_key')).toBeNull();
  });

  it('returns null on 204 No Content', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await apiFetch('/api/test', { method: 'DELETE' });
    expect(result).toBeNull();
  });
});
