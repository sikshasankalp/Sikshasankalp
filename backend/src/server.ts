import http from 'node:http';

import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';

let server: http.Server | undefined;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

    console.log('Database connected successfully');

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