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

/**
 * @returns {Promise<Array<{ id: string, endpoint: string, isActive: boolean, createdAt: string, userAgent: string|null }>>}
 */
export const getSubscriptions = () =>
  apiFetch('/api/admin/all');

/**
 * @returns {Promise<number>} count of compliments whose IsBeenPushed was reset to false
 */
export const resetComplimentPool = () =>
  apiFetch('/api/admin/compliments/reset-pool', { method: 'POST' });
