import assert from 'node:assert/strict';
import {
  validateLoginPayload,
  validateRegisterPayload,
} from '../src/validators/authValidator.js';

assert.deepEqual(
  validateRegisterPayload({
    name: 'Naiem',
    email: 'naiem@example.com',
    password: 'password123',
  }),
  []
);

assert.ok(
  validateRegisterPayload({
    name: 'N',
    email: 'invalid',
    password: '123',
  }).length >= 3
);

assert.deepEqual(
  validateLoginPayload({
    email: 'naiem@example.com',
    password: 'password123',
  }),
  []
);

assert.ok(
  validateLoginPayload({}).length === 2
);

console.log(
  'PASS valid registration accepted'
);

console.log(
  'PASS invalid registration rejected'
);

console.log(
  'PASS valid login accepted'
);

console.log(
  'PASS incomplete login rejected'
);

console.log('\nALL CHECKS PASSED');
