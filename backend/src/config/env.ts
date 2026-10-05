import dotenv from 'dotenv';

dotenv.config();

type NodeEnv = 'development' | 'test' | 'production';

const cleanEnvValue = (val: string | undefined): string => {
  if (!val) return '';
  let cleaned = val.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
};

const getRequiredEnv = (key: string): string => {
  const value = cleanEnvValue(process.env[key]);

  if (!value) {
    throw new Error(`Environment variable ${key} is required.`);
  }

  return value;
};

const getOptionalEnv = (
  key: string,
  fallback: string
): string => {
  const value = cleanEnvValue(process.env[key]);

  return value || fallback;
};

const getNodeEnv = (): NodeEnv => {
  const value = cleanEnvValue(process.env.NODE_ENV) || 'development';

  if (
    value !== 'development' &&
    value !== 'test' &&
    value !== 'production'
  ) {
    throw new Error(
      'NODE_ENV must be development, test, or production.'
    );
  }

  return value as NodeEnv;
};

const nodeEnv = getNodeEnv();

const getEnv = (
  key: string,
  fallback?: string
): string => {
  const value = cleanEnvValue(process.env[key]);

  if (value) {
    return value;
  }

  if (fallback !== undefined && nodeEnv !== 'production') {
    return fallback;
  }

  throw new Error(
    `Environment variable ${key} is required${
      nodeEnv === 'production' ? ' in production' : ''
    }.`
  );
};

const getPort = (): number => {
  const rawPort = getEnv('PORT', '5000');
  const port = Number(rawPort);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error(
      'PORT must be a valid number between 1 and 65535.'
    );
  }

  return port;
};

const getPositiveNumber = (
  key: string,
  fallback: string
): number => {
  const rawValue = getEnv(key, fallback);
  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `${key} must be a positive integer.`
    );
  }

  return value;
};

const getSecret = (
  key: string,
  minLength = 16
): string => {
  const value = getRequiredEnv(key);

  if (value.length < minLength) {
    throw new Error(
      `${key} must be at least ${minLength} characters long.`
    );
  }

  return value;
};

const normalizeUrl = (value: string): string => {
  return value.replace(/\/+$/, '');
};

const databaseUrl = getRequiredEnv('DATABASE_URL');

const frontendUrl = normalizeUrl(
  getEnv('FRONTEND_URL', 'http://localhost:5173')
);

const googleCallbackUrl = normalizeUrl(
  getEnv(
    'GOOGLE_CALLBACK_URL',
    'http://localhost:5000/api/auth/google/callback'
  )
);

if (nodeEnv === 'production') {
  const productionLocalhostValues = [
    ['FRONTEND_URL', frontendUrl],
    ['GOOGLE_CALLBACK_URL', googleCallbackUrl],
    ['DATABASE_URL', databaseUrl]
  ] as const;

  for (const [key, value] of productionLocalhostValues) {
    if (
      value.includes('localhost') ||
      value.includes('127.0.0.1') ||
      value.includes('0.0.0.0')
    ) {
      throw new Error(
        `${key} cannot use a local address in production.`
      );
    }
  }
}

const getEmailUser = (): string => {
  const value = cleanEnvValue(process.env.EMAIL_USER) || cleanEnvValue(process.env.SMTP_USER);

  if (!value) {
    throw new Error('Environment variable EMAIL_USER is required.');
  }

  return value;
};

const getEmailPass = (): string => {
  const value = cleanEnvValue(process.env.EMAIL_PASS) || cleanEnvValue(process.env.SMTP_PASSWORD);

  if (!value) {
    throw new Error('Environment variable EMAIL_PASS is required.');
  }

  return value;
};

export const config = {
  port: getPort(),

  nodeEnv,

  databaseUrl,

  jwt: {
    access: getSecret('JWT_ACCESS_SECRET', 32),
    refresh: getSecret('JWT_REFRESH_SECRET', 32)
  },

  frontendUrl,

  email: {
    user: cleanEnvValue(process.env.EMAIL_USER) || cleanEnvValue(process.env.SMTP_USER) || 'sikshasankalpfoundation@gmail.com',
    pass: cleanEnvValue(process.env.EMAIL_PASS) || cleanEnvValue(process.env.SMTP_PASSWORD),
  },

  googleAuth: {
    clientId: getRequiredEnv('GOOGLE_CLIENT_ID'),
    clientSecret: getSecret('GOOGLE_CLIENT_SECRET', 16),
    callbackUrl: googleCallbackUrl
  },

  cloudinary: {
    cloudName: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: getRequiredEnv('CLOUDINARY_API_KEY'),
    apiSecret: getSecret('CLOUDINARY_API_SECRET', 16)
  },

  razorpay: {
    keyId: getRequiredEnv('RAZORPAY_KEY_ID'),
    keySecret: getSecret('RAZORPAY_KEY_SECRET', 16),
    webhookSecret: getSecret('RAZORPAY_WEBHOOK_SECRET', 16)
  },

  brevoApiKey: cleanEnvValue(process.env.BREVO_API_KEY)
};