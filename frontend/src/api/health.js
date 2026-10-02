import { apiRequest } from './client.js';

export async function fetchApiHealth() {
  return apiRequest('/health');
}
