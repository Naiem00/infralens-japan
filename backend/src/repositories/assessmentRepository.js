import { pool } from '../config/database.js';

function mapAssessmentRow(row) {
  return {
    id: row.id,
    architecture: {
      id: row.architecture_id,
      name: row.architecture_name,
      selectedServices: row.selected_services,
      config: row.architecture_config,
    },
    assessment: {
      overallScore: row.overall_score,
      categoryScores: row.category_scores,
      appliedRules: row.applied_rules,
    },
    recommendations: row.recommendations,
    createdAt: row.created_at,
  };
}

const assessmentSelect = `
  SELECT
    a.id,
    a.architecture_id,
    ar.name AS architecture_name,
    ar.selected_services,
    ar.architecture_config,
    a.overall_score,
    a.category_scores,
    a.applied_rules,
    a.recommendations,
    a.created_at
  FROM assessments a
  JOIN architectures ar
    ON ar.id = a.architecture_id
`;

export async function createAssessmentRecord(payload) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const architectureResult = await client.query(
      `
        INSERT INTO architectures (
          name,
          selected_services,
          architecture_config
        )
        VALUES ($1, $2::jsonb, $3::jsonb)
        RETURNING id
      `,
      [
        payload.architecture.name.trim(),
        JSON.stringify(payload.architecture.selectedServices),
        JSON.stringify(payload.architecture.config),
      ]
    );

    const architectureId = architectureResult.rows[0].id;

    const assessmentResult = await client.query(
      `
        INSERT INTO assessments (
          architecture_id,
          overall_score,
          category_scores,
          applied_rules,
          recommendations
        )
        VALUES (
          $1,
          $2,
          $3::jsonb,
          $4::jsonb,
          $5::jsonb
        )
        RETURNING id
      `,
      [
        architectureId,
        payload.assessment.overallScore,
        JSON.stringify(payload.assessment.categoryScores),
        JSON.stringify(payload.assessment.appliedRules),
        JSON.stringify(payload.recommendations || []),
      ]
    );

    const assessmentId = assessmentResult.rows[0].id;

    await client.query('COMMIT');

    return findAssessmentById(assessmentId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function findAllAssessments() {
  const result = await pool.query(`
    ${assessmentSelect}
    ORDER BY a.created_at DESC, a.id DESC
  `);

  return result.rows.map(mapAssessmentRow);
}

export async function findAssessmentById(id) {
  const result = await pool.query(
    `
      ${assessmentSelect}
      WHERE a.id = $1
    `,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapAssessmentRow(result.rows[0]);
}
