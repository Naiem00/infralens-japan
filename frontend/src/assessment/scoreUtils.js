// Pure helpers for the scoring engine. No React, no i18next, no DOM — this file
// (and the rest of src/assessment/) must be runnable under plain `node`, which
// is exactly how scripts/verifyAssessment.mjs exercises it.

// Every category starts here. 70 (not 0, not 100) is chosen deliberately: it
// represents a "selected the service but configured nothing well or badly yet"
// baseline, so a category with zero applied rules reads as a middling, "you
// haven't told us much" score rather than a failing or a perfect one. Rules
// then move it up (good choices) or down (risky choices) from that midpoint.
// Documented again in docs/assessment-scoring.md.
export const BASE_CATEGORY_SCORE = 70;

export function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

// Centralized, deterministic rating thresholds — the ONLY place score ranges
// are defined. Checked highest-first; the first threshold a score meets wins.
export const RATING_THRESHOLDS = [
  { min: 85, key: 'excellent' },
  { min: 70, key: 'good' },
  { min: 50, key: 'needsImprovement' },
  { min: 0, key: 'highRisk' },
];

export function getRatingKey(score) {
  const match = RATING_THRESHOLDS.find((t) => score >= t.min);
  return match ? match.key : 'highRisk';
}

// Day 6 deliberately keeps a deselected service's configuration in React state
// (so re-selecting it restores prior values). The scoring engine must NOT let
// that stale config influence the score. Building activeConfig from
// selectedServices (never trusting architectureConfig's own keys) is what
// enforces that: a deselected service's leftover entry is simply never copied.
export function getActiveConfig(selectedServices, architectureConfig) {
  const active = {};
  for (const id of selectedServices) {
    if (architectureConfig[id]) {
      active[id] = architectureConfig[id];
    }
  }
  return active;
}
