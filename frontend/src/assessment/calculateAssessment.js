import { RULES } from './assessmentRules.js';
import { BASE_CATEGORY_SCORE, clamp, getActiveConfig, getRatingKey } from './scoreUtils.js';

export const CATEGORY_IDS = ['reliability', 'security', 'costEfficiency', 'performance', 'operations'];

// The one exported entry point. Deterministic: same input -> same output,
// every time (no Date.now(), no Math.random(), no I/O) — verified directly
// in scripts/verifyAssessment.mjs (Scenario C).
//
//   calculateAssessment({ selectedServices, architectureConfig })
//   -> {
//        overallScore, overallRating,
//        categoryScores: { reliability, security, costEfficiency, performance, operations },
//        categoryRatings: { ...same keys },
//        appliedRules: [{ ruleId, category, impact, severity, descriptionKey }],
//      }
export function calculateAssessment({ selectedServices, architectureConfig }) {
  const selectedSet = new Set(selectedServices);
  // Stale-config guard (Day 6 -> Day 7 contract): only configuration belonging
  // to a currently SELECTED service is ever visible to a rule.
  const activeConfig = getActiveConfig(selectedServices, architectureConfig);

  const ctx = {
    isSelected: (serviceId) => selectedSet.has(serviceId),
    get: (serviceId, fieldKey) => activeConfig[serviceId]?.[fieldKey],
  };

  const rawScores = {};
  CATEGORY_IDS.forEach((category) => {
    rawScores[category] = BASE_CATEGORY_SCORE;
  });

  const appliedRules = [];

  for (const rule of RULES) {
    if (rule.evaluate(ctx)) {
      rawScores[rule.category] += rule.impact;
      appliedRules.push({
        ruleId: rule.id,
        category: rule.category,
        impact: rule.impact,
        severity: rule.severity,
        descriptionKey: rule.descriptionKey,
      });
    }
  }

  const categoryScores = {};
  const categoryRatings = {};
  CATEGORY_IDS.forEach((category) => {
    categoryScores[category] = clamp(rawScores[category]);
    categoryRatings[category] = getRatingKey(categoryScores[category]);
  });

  // Equal weighting, as the spec prefers for Day 7: every category counts the
  // same toward the overall score. Simple average, rounded to a whole number,
  // then clamped (belt-and-braces — five values already in [0,100] average to
  // something in [0,100], but clamping keeps the guarantee explicit).
  const overallScoreRaw =
    CATEGORY_IDS.reduce((sum, category) => sum + categoryScores[category], 0) / CATEGORY_IDS.length;
  const overallScore = clamp(Math.round(overallScoreRaw));

  return {
    overallScore,
    overallRating: getRatingKey(overallScore),
    categoryScores,
    categoryRatings,
    appliedRules,
  };
}
