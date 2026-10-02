import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/infralens',
  frontendOrigin:
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
};
