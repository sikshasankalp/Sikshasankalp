import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'production' && !fallback) {
    throw new Error(`Environment variable ${key} is required in production.`);
  }
  return value || fallback || '';
};

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: getEnv('DATABASE_URL'),
  jwt: {
    access: getEnv('JWT_ACCESS_SECRET'),
    refresh: getEnv('JWT_REFRESH_SECRET'),
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  smtp: {
    host: getEnv('SMTP_HOST'),
    port: parseInt(getEnv('SMTP_PORT', '465'), 10),
    user: getEnv('SMTP_USER'),
    password: getEnv('SMTP_PASSWORD'),
  }
};
