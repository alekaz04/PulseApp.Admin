import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockStorage = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(() => {
    Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  }),
};
vi.stubGlobal('localStorage', mockLocalStorage);

beforeEach(() => {
  window.APP_CONFIG = { API_BASE_URL: 'http://test-server' };
  mockStorage['pulse_api_key'] = 'test-key';
  mockFetch.mockReset();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.setItem.mockClear();
});

describe('getSubscriptions', () => {
  it('calls GET /api/admin/all with api key', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    });

    const { getSubscriptions } = await import('./admin.js');
    await getSubscriptions();

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-server/api/admin/all',
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
      })
    );
  });
});

describe('resetComplimentPool', () => {
  it('calls POST /api/admin/compliments/reset-pool and returns count', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(42),
    });

    const { resetComplimentPool } = await import('./admin.js');
    const result = await resetComplimentPool();

    expect(mockFetch).toHaveBeenCalledWith(
      'http://test-server/api/admin/compliments/reset-pool',
      expect.objectContaining({ method: 'POST' })
    );
    expect(result).toBe(42);
  });
});
