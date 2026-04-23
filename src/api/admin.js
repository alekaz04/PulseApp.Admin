import { apiFetch } from './client.js';

/**
 * @param {{ title: string, body: string }} request
 * @returns {Promise<{ totalSubscriptions: number, message: string }>}
 */
export const sendPushToAll = (request) =>
  apiFetch('/api/admin/push/all', {
    method: 'POST',
    body: JSON.stringify(request),
  });
