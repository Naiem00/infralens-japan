import fs from 'node:fs/promises';
import { pool } from '../src/config/database.js';

const migrationUrl = new URL(
  '../migrations/001_initial_schema.sql',
  import.meta.url
);

try {
  const sql = await fs.readFile(migrationUrl, 'utf8');

  await pool.query(sql);

  console.log('PASS PostgreSQL migration completed');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
