export function validateAssessmentPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return ['Request body must be a JSON object.'];
  }

  const {
    architecture,
    assessment,
    recommendations = [],
  } = payload;

  if (!architecture || typeof architecture !== 'object') {
    errors.push('architecture is required.');
  } else {
    if (
      typeof architecture.name !== 'string' ||
      architecture.name.trim().length === 0
    ) {
      errors.push('architecture.name is required.');
    }

    if (!Array.isArray(architecture.selectedServices)) {
      errors.push('architecture.selectedServices must be an array.');
    }

    if (
      !architecture.config ||
      typeof architecture.config !== 'object' ||
      Array.isArray(architecture.config)
    ) {
      errors.push('architecture.config must be an object.');
    }
  }

  if (!assessment || typeof assessment !== 'object') {
    errors.push('assessment is required.');
  } else {
    if (
      !Number.isInteger(assessment.overallScore) ||
      assessment.overallScore < 0 ||
      assessment.overallScore > 100
    ) {
      errors.push(
        'assessment.overallScore must be an integer between 0 and 100.'
      );
    }

    if (
      !assessment.categoryScores ||
      typeof assessment.categoryScores !== 'object' ||
      Array.isArray(assessment.categoryScores)
    ) {
      errors.push('assessment.categoryScores must be an object.');
    }

    if (!Array.isArray(assessment.appliedRules)) {
      errors.push('assessment.appliedRules must be an array.');
    }
  }

  if (!Array.isArray(recommendations)) {
    errors.push('recommendations must be an array.');
  }

  return errors;
}
