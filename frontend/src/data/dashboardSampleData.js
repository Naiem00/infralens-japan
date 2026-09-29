// Fictional sample data for the Dashboard (Day 5). Nothing here is a real user,
// a real AWS account, or a real cost/usage figure — see the on-page sample-data
// notice and project rule §17. `id`s below map to i18next keys in
// locales/*/common.json (e.g. STAT_CARDS[0].id -> dashboard.stats.architecturesCreated),
// so labels stay translated instead of hardcoded here.

export const STAT_CARDS = [
  { id: 'architecturesCreated', value: '12' },
  { id: 'assessmentsCompleted', value: '7' },
  { id: 'savedDesigns', value: '3' },
  { id: 'averageScore', value: '68%' },
];

// Matches the worked example in the project spec (§5.3): overall 72,
// Reliability 65 / Security 80 / Cost Efficiency 70 / Performance 75 / Operations 60.
export const OVERALL_SCORE = 72;

export const CATEGORY_SCORES = [
  { id: 'reliability', score: 65 },
  { id: 'security', score: 80 },
  { id: 'costEfficiency', score: 70 },
  { id: 'performance', score: 75 },
  { id: 'operations', score: 60 },
];

// One fictional architecture's score over its last 6 assessments.
export const ASSESSMENT_HISTORY = [
  { id: 'a1', date: '2026-04-02', score: 58 },
  { id: 'a2', date: '2026-05-14', score: 63 },
  { id: 'a3', date: '2026-06-20', score: 66 },
  { id: 'a4', date: '2026-07-18', score: 70 },
  { id: 'a5', date: '2026-08-25', score: 69 },
  { id: 'a6', date: '2026-09-15', score: 72 },
];

export const SERVICE_USAGE = [
  { id: 'ec2', count: 5 },
  { id: 'ecsFargate', count: 8 },
  { id: 'rdsPostgres', count: 6 },
  { id: 's3', count: 10 },
  { id: 'cloudfront', count: 7 },
  { id: 'lambda', count: 4 },
];

// nameKey points into dashboard.recentAssessments.items.* — fictional project
// names only (project rule §17: no real company/customer names).
export const RECENT_ASSESSMENTS = [
  { id: 'r1', nameKey: 'dashboard.recentAssessments.items.sampleWebApp', score: 72, date: '2026-09-15' },
  { id: 'r2', nameKey: 'dashboard.recentAssessments.items.sampleApiPlatform', score: 65, date: '2026-08-25' },
  { id: 'r3', nameKey: 'dashboard.recentAssessments.items.sampleInternalTool', score: 80, date: '2026-07-18' },
];

// Readiness summary shown on the dashboard is a plain sample number; the real
// checklist/scoring logic behind /readiness is not implemented until a later day.
export const READINESS_SCORE = 62;
