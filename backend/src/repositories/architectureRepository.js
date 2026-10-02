import { pool } from '../config/database.js';

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    selectedServices: row.selected_services,
    config: row.architecture_config,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createArchitecture(userId, payload) {
  const result = await pool.query(
    `
      INSERT INTO architectures (
        user_id,
        name,
        selected_services,
        architecture_config
      )
      VALUES ($1, $2, $3::jsonb, $4::jsonb)
      RETURNING
        id,
        name,
        selected_services,
        architecture_config,
        created_at,
        updated_at
    `,
    [
      userId,
      payload.name.trim(),
      JSON.stringify(payload.selectedServices),
      JSON.stringify(payload.config),
    ]
  );

  return mapRow(result.rows[0]);
}

export async function findArchitecturesByUser(userId) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        selected_services,
        architecture_config,
        created_at,
        updated_at
      FROM architectures
      WHERE user_id = $1
      ORDER BY updated_at DESC, id DESC
    `,
    [userId]
  );

  return result.rows.map(mapRow);
}

export async function findArchitectureByIdForUser(id, userId) {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        selected_services,
        architecture_config,
        created_at,
        updated_at
      FROM architectures
      WHERE id = $1
        AND user_id = $2
    `,
    [id, userId]
  );

  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function updateArchitectureForUser(id, userId, payload) {
  const result = await pool.query(
    `
      UPDATE architectures
      SET
        name = $1,
        selected_services = $2::jsonb,
        architecture_config = $3::jsonb,
        updated_at = NOW()
      WHERE id = $4
        AND user_id = $5
      RETURNING
        id,
        name,
        selected_services,
        architecture_config,
        created_at,
        updated_at
    `,
    [
      payload.name.trim(),
      JSON.stringify(payload.selectedServices),
      JSON.stringify(payload.config),
      id,
      userId,
    ]
  );

  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function deleteArchitectureForUser(id, userId) {
  const result = await pool.query(
    `
      DELETE FROM architectures
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [id, userId]
  );

  return result.rowCount > 0;
}
