import { apiFetch } from './client.js';

/** @returns {Promise<ComplimentDto[]>} */
export const getCompliments = () =>
  apiFetch('/api/compliment');

/**
 * @param {{ title: string, text: string }} dto
 * @returns {Promise<string>} created id
 */
export const createCompliment = (dto) =>
  apiFetch('/api/compliment', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

/**
 * @param {Array<{ title: string, text: string }>} dtos
 * @returns {Promise<string[]>} created ids
 */
export const createBatchCompliments = (dtos) =>
  apiFetch('/api/compliment/batch', {
    method: 'POST',
    body: JSON.stringify(dtos),
  });

/**
 * @param {string} id
 * @param {{ title?: string, text?: string, isBeenPushed?: boolean }} dto
 */
export const updateCompliment = (id, dto) =>
  apiFetch(`/api/compliment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });

/** @param {string} id */
export const deleteCompliment = (id) =>
  apiFetch(`/api/compliment/${id}`, { method: 'DELETE' });
