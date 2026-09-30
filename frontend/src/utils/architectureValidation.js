import { COMPUTE_SERVICE_IDS, getServiceById } from '../data/awsServices.js';

// Pure function, no React/i18n dependency, so it's easy to unit test later and
// easy to reason about in an interview: given the current selection + config,
// what (if anything) is wrong, keyed by translation-ready error codes.
//
// Returns:
//   {
//     computeServiceSelected: boolean,
//     fieldErrors: { [serviceId]: { [fieldKey]: 'numberInvalid' | 'numberTooLow' | 'numberTooHigh' } },
//     isValid: boolean,
//   }
export function validateArchitecture(selectedServices, architectureConfig) {
  const computeServiceSelected = selectedServices.some((id) => COMPUTE_SERVICE_IDS.includes(id));
  const fieldErrors = {};

  for (const serviceId of selectedServices) {
    const service = getServiceById(serviceId);
    if (!service) continue;

    const numberFields = service.configSchema.filter((f) => f.type === 'number');
    if (numberFields.length === 0) continue;

    const config = architectureConfig[serviceId] || {};
    for (const field of numberFields) {
      const raw = config[field.key];
      const value = Number(raw);
      let error = null;

      if (raw === '' || raw === null || raw === undefined || Number.isNaN(value)) {
        error = 'numberInvalid';
      } else if (field.min !== undefined && value < field.min) {
        error = 'numberTooLow';
      } else if (field.max !== undefined && value > field.max) {
        error = 'numberTooHigh';
      }

      if (error) {
        fieldErrors[serviceId] = fieldErrors[serviceId] || {};
        fieldErrors[serviceId][field.key] = error;
      }
    }
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return {
    computeServiceSelected,
    fieldErrors,
    isValid: computeServiceSelected && !hasFieldErrors,
  };
}

export function countServiceErrors(fieldErrors) {
  return Object.values(fieldErrors).reduce((sum, fields) => sum + Object.keys(fields).length, 0);
}
