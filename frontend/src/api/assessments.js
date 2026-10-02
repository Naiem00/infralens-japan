import { apiRequest } from './client.js';

export async function saveAssessment(payload) {
  const response = await apiRequest(
    '/assessments',
    {
      method: 'POST',
      body: payload,
    }
  );

  return response.data;
}

export async function fetchAssessments() {
  const response = await apiRequest(
    '/assessments'
  );

  return response.data;
}
