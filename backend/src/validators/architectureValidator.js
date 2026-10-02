export function validateArchitecturePayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Request body must be a JSON object.'];
  }

  if (
    typeof payload.name !== 'string' ||
    payload.name.trim().length === 0
  ) {
    errors.push('name is required.');
  }

  if (!Array.isArray(payload.selectedServices)) {
    errors.push('selectedServices must be an array.');
  }

  if (
    !payload.config ||
    typeof payload.config !== 'object' ||
    Array.isArray(payload.config)
  ) {
    errors.push('config must be an object.');
  }

  return errors;
}
