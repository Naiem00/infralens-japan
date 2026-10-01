# Assessment Scoring Model

> **This is an educational portfolio assessment model.** It is not an official
> AWS Well-Architected Framework review, not affiliated with AWS, and should
> not be used as a substitute for one. It exists to demonstrate deterministic,
> explainable scoring logic for a portfolio project.

## Overview

The scoring engine (`frontend/src/assessment/`) takes the services and
configuration selected in the Architecture Analyzer (Day 6) and produces five
category scores, an overall score, and a complete trace of exactly which
named rule produced every point gained or lost.

**The engine is pure JavaScript** — no React, no i18next, no DOM access, no
network calls, no `Date.now()`, no `Math.random()`. Given the same input, it
always returns the same output. It can be run directly under Node with no
bundler or browser (see `frontend/scripts/verifyAssessment.mjs`).

```
{ selectedServices, architectureConfig }
        │
        ▼
  calculateAssessment()
        │
        ▼
{ overallScore, overallRating,
  categoryScores, categoryRatings,
  appliedRules }
```

## Starting score

Each of the five categories (Reliability, Security, Cost Efficiency,
Performance, Operations) starts at **70**, not 0 and not 100.

**Why 70:** a category with zero applicable rules (e.g. no database selected,
so none of the RDS security rules can fire) should read as a neutral,
"nothing specific detected" result — not a failing score (which would
unfairly penalize an architecture for not using a service it doesn't need)
and not a perfect score (which would make the baseline meaningless). 70 sits
inside the "Good" rating band on its own, which reads correctly as "fine,
but we don't know much about this category yet."

## Category structure

The five categories match the project's master spec exactly:

- Reliability
- Security
- Cost Efficiency
- Performance
- Operations

## Rule model

Every rule has this shape (`frontend/src/assessment/assessmentRules.js`):

```js
{
  id: 'security-rds-public',               // stable, language-independent
  category: 'security',
  descriptionKey: 'assessment.rules.security.rdsPublic', // i18next key — FACTUAL text only
  impact: -15,                              // whole number, never fractional
  severity: 'critical',                     // UI styling only; scoring uses `impact`
  evaluate: (ctx) => ctx.isSelected('rdsPostgres') && ctx.get('rdsPostgres', 'publiclyAccessible') === true,
}
```

`descriptionKey` always points to a **factual, neutral statement** ("Database
publicly accessible"), never prescriptive advice ("You should..."). Advice
belongs to the Day 8 recommendation engine (`frontend/src/recommendations/`,
documented in `docs/recommendations.md`), not Day 7 scoring.

Impact values are kept simple and explainable: `+5`, `+10`, `-5`, `-10`,
`-15`. No fractional values like `+3.7`.

## Rule impacts (35 rules)

Only fields that already exist in Day 6's `data/awsServices.js` config
schemas are scored. Nothing here invents a new configuration field.

### Reliability (base 70)
| Rule | Impact |
|---|---|
| EC2 Multi-AZ enabled | +10 |
| ECS Fargate Multi-AZ enabled | +10 |
| More than one EC2 instance | +5 |
| More than one ECS task | +5 |
| RDS Multi-AZ enabled | +10 |
| RDS backups enabled | +10 |
| S3 versioning enabled | +5 |
| Single compute instance/task with no Auto Scaling | -10 |

### Security (base 70)
| Rule | Impact |
|---|---|
| Database publicly accessible | **-15** (critical) |
| RDS private subnet placement | +10 |
| RDS encryption enabled | +10 |
| S3 encryption enabled | +10 |
| S3 public access blocked | +10 |
| CloudFront HTTPS enabled | +5 |
| ALB HTTPS enabled | +5 |
| Secrets Manager enabled | +5 |
| WAF selected | +5 |
| KMS selected | +5 |

### Cost Efficiency (base 70)
| Rule | Impact |
|---|---|
| EC2 Auto Scaling enabled | +10 |
| ECS Fargate Auto Scaling enabled | +10 |
| Lambda selected (pay-per-use) | +5 |
| EC2 and ECS Fargate both selected (possible duplicate compute) | -5 |
| More than 5 fixed EC2 instances with no Auto Scaling | -10 |

*Judgment calls, documented here rather than hidden in code:* the
"duplicate compute" rule only fires for EC2 + ECS Fargate together — Lambda
paired with either is treated as a common, valid hybrid pattern, not a
duplicate. The "5 instances" threshold is a reasonable, explainable cutoff
for likely over-provisioning, not an AWS-defined limit.

### Performance (base 70)
| Rule | Impact |
|---|---|
| CloudFront selected | +10 |
| ALB distributing traffic across multiple compute targets | +10 |
| EC2 Auto Scaling enabled | +5 |
| ECS Fargate Auto Scaling enabled | +5 |
| API Gateway + Lambda combination | +10 |
| Single fixed compute resource with no scaling | -10 |

### Operations (base 70)
| Rule | Impact |
|---|---|
| CloudWatch logs enabled | +10 |
| CloudWatch alarms enabled | +10 |
| CloudWatch metrics enabled | +5 |
| Secrets Manager selected | +5 |
| RDS backups enabled | +5 |
| No monitoring service selected (CloudWatch) | -10 |

(RDS backups enabled contributes to both Reliability *and* Operations —
intentional: the same fact is a genuinely relevant signal for both pillars,
the same way AWS's own Well-Architected pillars overlap.)

## Score clamping

After rules are applied, every category score is clamped to **[0, 100]**
with a single reusable helper (`clamp()` in `scoreUtils.js`). This is
necessary because category scores are unbounded sums (`70 + rule impacts`)
— without clamping, a category with many positive rules could mathematically
exceed 100, or one with many negative rules could go below 0.

## Overall score

Equal-weighted average of the five (already-clamped) category scores,
rounded to the nearest whole number, then clamped again for an explicit
guarantee:

```
overall = round( (reliability + security + costEfficiency + performance + operations) / 5 )
```

Equal weighting was chosen because the spec prefers it for Day 7 and because
there's no principled basis yet (no user research, no stated business
priority) for weighting one pillar over another — introducing unequal
weights without a documented reason would itself be a form of the "arbitrary
numbers" this model explicitly avoids.

## Rating thresholds

Centralized in one place (`RATING_THRESHOLDS` in `scoreUtils.js`) and
applied identically to the overall score and every category score:

| Score range | Rating |
|---|---|
| 85–100 | Excellent |
| 70–84 | Good |
| 50–69 | Needs Improvement |
| 0–49 | High Risk |

## Deterministic behavior

- No `Math.random()`, no `Date.now()`, no network or browser API calls
  anywhere in `src/assessment/`.
- The same `{ selectedServices, architectureConfig }` input always produces
  byte-identical output — verified directly in
  `frontend/scripts/verifyAssessment.mjs` (Scenario C).
- **Stale, deselected-service configuration is never scored.** The Day 6 UI
  deliberately keeps a deselected service's configuration in React state (so
  re-selecting it restores prior values). The engine builds its working
  config (`getActiveConfig`) strictly from the `selectedServices` list, so a
  service that isn't currently selected can never influence the score, no
  matter what is still sitting in `architectureConfig` for it — verified in
  `verifyAssessment.mjs` (Scenario D).

## Running the verification script

```bash
cd frontend
node scripts/verifyAssessment.mjs
```

This runs four scenarios against the real engine (no mocks): a weak
architecture, a stronger architecture, the same strong architecture run
twice (determinism), and the weak architecture with stale leftover config
for deselected services (stale-config guard), asserting the properties
above and exiting non-zero on any failure.
