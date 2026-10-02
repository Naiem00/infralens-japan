import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createApp } from '../src/app.js';

assert.equal(typeof createApp, 'function');

const sql = await fs.readFile(
  new URL('../migrations/001_initial_schema.sql', import.meta.url),
  'utf8'
);

assert.match(sql, /CREATE TABLE IF NOT EXISTS architectures/);
assert.match(sql, /CREATE TABLE IF NOT EXISTS assessments/);
assert.match(sql, /JSONB/);
assert.match(sql, /REFERENCES architectures/);

console.log('PASS Express app factory loads');
console.log('PASS architectures table migration exists');
console.log('PASS assessments table migration exists');
console.log('PASS JSONB architecture data model exists');
console.log('PASS assessment foreign key exists');
console.log('\nALL CHECKS PASSED');
