// UI-only concern (which Badge color a rating gets) — deliberately kept out of
// src/assessment/ (the pure engine never imports anything component-related).
export function ratingToBadgeTone(ratingKey) {
  switch (ratingKey) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'needsImprovement':
      return 'warning';
    case 'highRisk':
    default:
      return 'error';
  }
}
