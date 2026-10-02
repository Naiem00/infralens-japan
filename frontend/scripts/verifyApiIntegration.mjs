import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const client = await fs.readFile(
  new URL(
    '../src/api/client.js',
    import.meta.url
  ),
  'utf8'
);

const assessments = await fs.readFile(
  new URL(
    '../src/api/assessments.js',
    import.meta.url
  ),
  'utf8'
);

const persistence = await fs.readFile(
  new URL(
    '../src/components/integration/AssessmentPersistence.jsx',
    import.meta.url
  ),
  'utf8'
);

assert.match(
  client,
  /VITE_API_BASE_URL/
);

assert.match(
  client,
  /Authorization/
);

assert.match(
  assessments,
  /\/assessments/
);

assert.match(
  persistence,
  /saveAssessment/
);

console.log(
  'PASS configurable API base URL exists'
);

console.log(
  'PASS API client supports bearer authentication'
);

console.log(
  'PASS assessment API integration exists'
);

console.log(
  'PASS analyzer persistence component exists'
);

console.log(
  '\nALL CHECKS PASSED'
);
