import assert from 'node:assert/strict';
import { validateAssessmentPayload } from '../src/validators/assessmentValidator.js';

const validPayload = {
  architecture: {
    name: 'Day 15 Demo Architecture',
    selectedServices: ['ec2', 'rdsPostgres', 'cloudwatch'],
    config: {
      ec2: {
        instanceCount: 2,
        autoScaling: true,
        multiAZ: true,
      },
      rdsPostgres: {
        multiAZ: true,
        backups: true,
        encryption: true,
        publiclyAccessible: false,
      },
    },
  },
  assessment: {
    overallScore: 88,
    categoryScores: {
      reliability: 90,
      security: 90,
      costEfficiency: 80,
      performance: 85,
      operations: 95,
    },
    appliedRules: [
      {
        id: 'demo-rule',
        impact: 10,
      },
    ],
  },
  recommendations: [
    {
      id: 'demo-recommendation',
      priority: 'consider',
    },
  ],
};

assert.deepEqual(
  validateAssessmentPayload(validPayload),
  []
);

const invalidScore = structuredClone(validPayload);
invalidScore.assessment.overallScore = 101;

assert.ok(
  validateAssessmentPayload(invalidScore).some((error) =>
    error.includes('overallScore')
  )
);

const invalidServices = structuredClone(validPayload);
invalidServices.architecture.selectedServices = 'ec2';

assert.ok(
  validateAssessmentPayload(invalidServices).some((error) =>
    error.includes('selectedServices')
  )
);

assert.ok(
  validateAssessmentPayload({}).length > 0
);

console.log('PASS valid assessment payload accepted');
console.log('PASS invalid overall score rejected');
console.log('PASS invalid selectedServices rejected');
console.log('PASS incomplete payload rejected');
console.log('\nALL CHECKS PASSED');
