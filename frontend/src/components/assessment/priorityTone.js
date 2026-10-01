// UI-only: which Badge tone a recommendation priority gets.
export function priorityToBadgeTone(priority) {
  switch (priority) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'recommended':
      return 'info';
    case 'consider':
    default:
      return 'neutral';
  }
}
