import { CATEGORY_IDS } from '../assessment/calculateAssessment.js';
import { getActiveConfig } from '../assessment/scoreUtils.js';
import { PRIORITY_RANK, RECOMMENDATION_RULES } from './recommendationRules.js';

// Pure, deterministic: same input -> same output. No Date.now(), Math.random(),
// React, i18next, or I/O. Stale deselected-service config is ignored via
// getActiveConfig — the same Day 6 -> Day 7 contract.

export function generateRecommendations({ selectedServices, architectureConfig }) {
  const selectedSet = new Set(selectedServices);
  const activeConfig = getActiveConfig(selectedServices, architectureConfig);

  const ctx = {
    isSelected: (serviceId) => selectedSet.has(serviceId),
    get: (serviceId, fieldKey) => activeConfig[serviceId]?.[fieldKey],
  };

  const recommendations = [];

  for (const rule of RECOMMENDATION_RULES) {
    if (rule.evaluate(ctx)) {
      recommendations.push({
        id: rule.id,
        priority: rule.priority,
        category: rule.category,
        titleKey: rule.titleKey,
        explanationKey: rule.explanationKey,
        conceptKey: rule.conceptKey,
        relatedRuleId: rule.relatedRuleId ?? null,
      });
    }
  }

  recommendations.sort((a, b) => {
    const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (byPriority !== 0) return byPriority;
    const byCategory = CATEGORY_IDS.indexOf(a.category) - CATEGORY_IDS.indexOf(b.category);
    if (byCategory !== 0) return byCategory;
    return a.id.localeCompare(b.id);
  });

  return { recommendations };
}
