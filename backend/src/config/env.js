import 'dotenv/config';

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const {
    DB_HOST,
    DB_PORT = '5432',
    DB_NAME = 'infralens',
    DB_USER,
    DB_PASSWORD,
  } = process.env;

  if (DB_HOST && DB_USER && DB_PASSWORD) {
    return `postgresql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(
      DB_PASSWORD
    )}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }

  return 'postgresql://localhost:5432/infralens';
}

export const env = {
  port: Number(process.env.PORT || 3000),

  databaseUrl: getDatabaseUrl(),

  frontendOrigin:
    process.env.FRONTEND_ORIGIN ||
    'http://localhost:5173',

  jwtSecret:
    process.env.JWT_SECRET ||
    'development-only-secret',

  jwtExpiresIn:
    process.env.JWT_EXPIRES_IN ||
    '1h',
};
