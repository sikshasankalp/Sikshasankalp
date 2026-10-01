const fs = require('fs');
const path = require('path');

const bDir = path.join(__dirname, 'backend');

const write = (relPath, content) => {
  const fullPath = path.join(bDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

// 1. config/env.ts
write('src/config/env.ts', `
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    access: process.env.JWT_ACCESS_SECRET || 'fallback_secret',
    refresh: process.env.JWT_REFRESH_SECRET || 'fallback_secret',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
`);

// 2. config/database.ts
write('src/config/database.ts', `
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
`);

// 3. app.ts
write('src/app.ts', `
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling
app.use(errorHandler);

export default app;
`);

// 4. server.ts
write('src/server.ts', `
import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(config.port, () => {
      console.log(\`Server is running on port \${config.port} in \${config.nodeEnv} mode\`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
`);

// 5. middlewares/errorHandler.ts
write('src/middlewares/errorHandler.ts', `
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
`);

// 6. middlewares/auth.middleware.ts
write('src/middlewares/auth.middleware.ts', `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.access) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User not found or inactive' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};
`);

// 7. routes/health.routes.ts
write('src/routes/health.routes.ts', `
import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Quick DB check
    await prisma.$queryRaw\`SELECT 1\`;
    res.json({ success: true, message: 'API is running' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'API is running, but database connection failed' });
  }
});

export default router;
`);

// 8. controllers/auth.controller.ts
write('src/controllers/auth.controller.ts', `
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { config } from '../config/env';
import { loginSchema } from '../validators/auth.validator';
import { AuthRequest } from '../middlewares/auth.middleware';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: 'Invalid input data' });
      return;
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.access,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const { passwordHash, ...safeUser } = req.user;
  res.json({ success: true, data: { user: safeUser } });
};
`);

// 9. routes/auth.routes.ts
write('src/routes/auth.routes.ts', `
import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
`);

// 10. routes/dashboard.routes.ts
write('src/routes/dashboard.routes.ts', `
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { prisma } from '../config/database';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [donations, volunteers, messages, gallery, programs, team, partners] = await Promise.all([
      prisma.donation.count(),
      prisma.volunteer.count(),
      prisma.contactMessage.count(),
      prisma.galleryItem.count(),
      prisma.program.count(),
      prisma.teamMember.count(),
      prisma.partnerEnquiry.count(),
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          donations,
          volunteers,
          messages,
          gallery,
          programs,
          team,
          partners
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
`);

// 11. validators/auth.validator.ts
write('src/validators/auth.validator.ts', `
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
`);

// 12. validators/forms.validator.ts
write('src/validators/forms.validator.ts', `
import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  enquiryType: z.string(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const volunteerSchema = z.object({
  name: z.string().min(1),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
  skills: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
});

export const partnerEnquirySchema = z.object({
  organisationName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  mobile: z.string().min(10),
  organisationType: z.string().optional(),
  city: z.string().optional(),
  areaOfInterest: z.string().optional(),
  message: z.string().optional(),
});
`);

// 13. prisma/seed.ts
write('prisma/seed.ts', `
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        passwordHash,
        role: Role.SUPER_ADMIN,
      }
    });
    console.log(\`Admin user seeded with email: \${adminEmail}\`);
  } else {
    console.log('Admin user already exists.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`);

// 14. Update package.json scripts
const pkgPath = path.join(bDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "lint": "tsc --noEmit",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "prisma:seed": "ts-node prisma/seed.ts"
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

write('README.md', `
# Shiksha Sankalp Foundation Backend

## Technology Stack
- Node.js & Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (Validation)

## Setup
1. Clone and install dependencies: npm install
2. Setup PostgreSQL database and update .env with DATABASE_URL.
3. Generate Prisma client: npm run prisma:generate
4. Run migrations: npm run prisma:migrate -- --name init
5. Seed database: npm run prisma:seed
6. Start dev server: npm run dev

## Health Check
GET /api/health
`);

console.log('Backend Express foundation generated.');
