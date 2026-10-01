# Recommendation Engine

> **This is educational, rules-based advice for the InfraLens Japan demo.**
> It is not an official AWS Well-Architected Framework review and is not a
> complete security audit.

## Overview

Day 7 scores an architecture with **factual** findings
("Database publicly accessible"). Day 8 turns matching gaps into
**prescriptive** recommendations ("Disable public access on RDS because…").

The engine lives in `frontend/src/recommendations/` and does **not** change
Day 7 scoring values, thresholds, rules, or math.

```
{ selectedServices, architectureConfig }
        │
        ▼
  generateRecommendations()
        │
        ▼
{ recommendations: [{ id, priority, category,
                      titleKey, explanationKey, conceptKey,
                      relatedRuleId }] }
```

It is pure JavaScript: no React, no i18next, no `Date.now()`, no
`Math.random()`. The same input always returns the same output.

Stale configuration for **deselected** services is ignored. The engine uses
the same `getActiveConfig()` helper as Day 7.

## Priorities

| Priority | When it fires (examples) |
|---|---|
| Critical | RDS publicly accessible |
| High Priority | No CloudWatch; single compute with no Auto Scaling; RDS not private / not encrypted; S3 public access not blocked; large fixed EC2 fleet |
| Recommended | Missing backups, Multi-AZ, encryption, HTTPS, logs/alarms, etc. on **already selected** services |
| Consider | Extra services only when the current architecture gives a reason (WAF if ALB or CloudFront exists; Secrets Manager if RDS exists; ALB if multiple EC2/ECS targets exist) |

Missing-service suggestions are **gated**. The engine does not recommend
unrelated catalog items (Lambda, DynamoDB, KMS, SQS, …) just because they
are unused.

## UI

`AssessmentResult` is unchanged above the fold. The recommendation list is
**appended** below the five category score cards. Copy is translated via
i18next keys under `recommendations` in `locales/en/common.json` and
`locales/ja/common.json`.

## Running the verification script

```bash
cd frontend
node scripts/verifyRecommendations.mjs
```
