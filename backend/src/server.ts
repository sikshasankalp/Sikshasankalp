import http from 'node:http';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';

let server: http.Server | undefined;
let isShuttingDown = false;

const bootstrapAdminUser = async (): Promise<void> => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'sikshasankalpfoundation@gmail.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Siksha@2026!';
    const adminName = process.env.ADMIN_NAME || 'Shiksha Sankalp Admin';

    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          passwordHash,
          role: Role.SUPER_ADMIN,
          isVerified: true,
          isActive: true
        }
      });
      console.log(`[BOOTSTRAP] Admin account created: ${adminEmail}`);
    } else {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          passwordHash,
          role: Role.SUPER_ADMIN,
          isVerified: true,
          isActive: true
        }
      });
      console.log(`[BOOTSTRAP] Admin account synced & verified: ${adminEmail}`);
    }
  } catch (error) {
    console.error('[BOOTSTRAP] Warning: Failed to bootstrap admin account:', error);
  }
};

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

    console.log('Database connected successfully');

    await bootstrapAdminUser();

    server = app.listen(config.port, () => {
      console.log(
        `Server is running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      console.error('HTTP server error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);

    await prisma.$disconnect().catch(() => undefined);

    process.exit(1);
  }
};

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();

    console.log('Server shut down successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);

    await prisma.$disconnect().catch(() => undefined);

    process.exit(1);
  }
};

process.once('SIGINT', () => {
  void shutdown('SIGINT');
});

process.once('SIGTERM', () => {
  void shutdown('SIGTERM');
});

void startServer();