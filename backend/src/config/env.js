import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3000),

  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://localhost:5432/infralens',

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
