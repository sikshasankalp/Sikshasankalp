import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import routes from './routes';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './errors/errorHandler';
import { apiLimiter } from './middleware/rateLimit.middleware';

const app = express();

// Trust proxy required for express-rate-limit and cookies when deployed behind a reverse proxy (e.g. Render, NGINX)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Security Middlewares
// Disable CSP for now since this is an API; CSP can sometimes cause fragile blockages if misconfigured for REST APIs
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS Configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie Parser
app.use(cookieParser());

// Limit request body size
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Safe logging: don't log Authorization header, cookies, or request bodies
morgan.token('safe-auth', (req: express.Request) => {
  return req.headers.authorization ? 'Bearer [HIDDEN]' : 'None';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - Auth: :safe-auth'));

// Global API Rate Limiter
// authLimiter and strictAuthLimiter should be attached in auth.routes.ts directly.
app.use('/api', apiLimiter, routes);

// 404
app.use(notFoundHandler);

// Error handling
app.use(errorHandler);

export default app;
