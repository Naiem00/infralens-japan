import { checkDatabaseConnection } from '../config/database.js';

export function getHealth(_req, res) {
  res.json({
    status: 'ok',
    service: 'infralens-japan-api',
  });
}

export async function getDatabaseHealth(_req, res, next) {
  try {
    const database = await checkDatabaseConnection();

    res.json({
      status: 'ok',
      database,
    });
  } catch (error) {
    error.statusCode = 503;
    next(error);
  }
}
