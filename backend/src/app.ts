import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import type { IncomingMessage } from 'http';

import { config } from './config/env';
import routes from './routes';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './errors/errorHandler';
import { apiLimiter } from './middleware/rateLimit.middleware';

type RawBodyRequest = IncomingMessage & {
  rawBody?: Buffer;
};

const app = express();

/**
 * Disable Express technology fingerprinting.
 */
app.disable('x-powered-by');

/**
 * Trust reverse proxy in production/hosted environments (Render, Cloudflare).
 *
 * This allows Express and express-rate-limit to correctly resolve the true client
 * IP from X-Forwarded-For rather than grouping all visitors into the proxy IP.
 */
app.set('trust proxy', true);

/**
 * Security headers.
 *
 * This backend is an API server and does not serve HTML,
 * so the browser Content Security Policy is intentionally
 * disabled here.
 *
 * Helmet still provides the other relevant security headers.
 */
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

/**
 * CORS
 *
 * Only the configured frontend origin is allowed.
 * Credentials are enabled because authentication uses
 * HttpOnly cookies.
 */
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: [
      'GET',
      'POST',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],
    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);

/**
 * Cookie parser
 */
app.use(cookieParser());

/**
 * JSON body parser.
 *
 * Razorpay webhook signature verification requires the
 * exact raw request body received from Razorpay.
 */
app.use(
  express.json({
    limit: '1mb',

    verify: (req, _res, buf) => {
      const request =
        req as RawBodyRequest;

      const requestPath =
        request.url?.split('?')[0];

      if (
        requestPath ===
        '/api/donations/webhook'
      ) {
        request.rawBody =
          Buffer.from(buf);
      }
    }
  })
);

/**
 * URL-encoded body parser
 */
app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb'
  })
);

/**
 * Safe request logging.
 *
 * Never log:
 * - Authorization tokens
 * - cookies
 * - request bodies
 * - passwords
 * - payment secrets
 */
morgan.token(
  'safe-auth',
  (req: express.Request) => {
    return req.headers.authorization
      ? 'Bearer [HIDDEN]'
      : 'None';
  }
);

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms - Auth: :safe-auth'
  )
);

/**
 * Global API rate limiter.
 *
 * Authentication-specific rate limiters are applied
 * inside auth.routes.ts.
 *
 * Razorpay webhook is excluded inside apiLimiter because
 * webhook authenticity is verified using its HMAC signature.
 */
app.use(
  '/api',
  apiLimiter,
  routes
);

/**
 * 404 handler
 */
app.use(notFoundHandler);

/**
 * Centralized error handler
 */
app.use(errorHandler);

export default app;