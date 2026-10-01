import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
    
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
