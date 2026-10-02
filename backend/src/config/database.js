import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

export async function checkDatabaseConnection() {
  const result = await pool.query(
    'SELECT NOW() AS server_time, current_database() AS database_name'
  );

  return result.rows[0];
}
