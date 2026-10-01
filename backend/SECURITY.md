# Security Policy and Architecture

## Authentication Approach
- **Strategy:** JSON Web Token (JWT) Bearer tokens.
- **Password Hashing:** `bcrypt` with a work factor of 12 for robust security against offline cracking while remaining reasonably fast for authentication.
- **Login Enumeration Protection:** The API always returns "Invalid email or password" to prevent an attacker from determining if an email is registered.
- **Token Claims:** The token only stores the `userId` and `role`. It never stores PII, hashes, or sensitive attributes.
- **Token Lifecycle:** The tokens expire in `1d`.

## Authorization / RBAC
- **Server-Side Enforcement:** Frontend checks are purely cosmetic. The backend strictly enforces authorization using the `requireAuth` and `requireRole` middlewares.
- **Roles:** The application currently supports `SUPER_ADMIN`, `CONTENT_ADMIN`, and `FINANCE_ADMIN`.
- **Protected Routes:** All routes under `/api/auth/me` and `/api/admin/*` enforce token verification and role checks where applicable.

## Secret Management
- **Environment Variables:** All secrets, such as database credentials and JWT signing keys, are strictly loaded from `.env`.
- **Validation:** In production (`NODE_ENV=production`), the application will instantly crash if critical secrets (like `JWT_ACCESS_SECRET`) are missing.
- **Seed Script:** The seed script refuses to create an admin with default credentials in production.

## Network Security & Headers
- **CORS Policy:** We strictly allow the origin configured in `FRONTEND_URL`. We never use `origin: "*"` for authenticated APIs. Allowed methods and headers are strictly defined.
- **Helmet:** The API uses Helmet to set standard HTTP security headers (e.g., hiding `X-Powered-By`, setting `X-Frame-Options`, `Content-Security-Policy`, etc.).

## Rate Limiting & Input Protection
- **Login Rate Limiting:** The `/api/auth/login` endpoint is protected by `express-rate-limit` (20 attempts per 15 minutes per IP) to slow down credential stuffing and brute force attacks.
- **Request Size:** Express body parsers are limited to `1mb` to prevent payload-based DoS attacks.
- **Validation:** Zod is used to strictly validate incoming requests, preventing unexpected fields and types from reaching business logic.
- **Mass Assignment:** The application destructures specific properties (e.g., `const { email, password } = parsed.data`) rather than passing raw `req.body` to Prisma, mitigating Mass Assignment vulnerabilities.

## Error Handling & Safe Logging
- **Sanitized Errors:** In production, stack traces and Prisma internals (e.g. SQL errors, unique constraint failures) are caught and returned as generic generic messages (`"Internal Server Error"`).
- **Safe Logging:** Morgan is configured with a custom token `safe-auth` to ensure `Authorization: Bearer <token>` headers are never written to server logs.

## Future Production Hardening Items
While this foundation is secure, a fully scaled multi-instance production environment should consider:
1. **Shared Rate Limiting:** Using a Redis store for `express-rate-limit` so limits apply across all nodes.
2. **Refresh Tokens / Sessions:** Migrating from long-lived access tokens to short-lived access tokens + HTTPOnly secure refresh token cookies if strict session revocation becomes necessary.
3. **Audit Trails:** Introducing an `AuditLog` table for critical administrative actions.
