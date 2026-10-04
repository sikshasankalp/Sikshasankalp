import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const isProd = process.env.NODE_ENV === 'production';
  const adminEmail = process.env.ADMIN_EMAIL || (isProd ? null : 'admin@example.com');
  const adminName = process.env.ADMIN_NAME || 'Admin';
  const adminPassword = process.env.ADMIN_PASSWORD || (isProd ? null : 'admin123');

  if (!adminEmail || !adminPassword) {
    if (isProd) {
      console.error('FATAL: ADMIN_EMAIL and ADMIN_PASSWORD must be explicitly set in production.');
      process.exit(1);
    }
  }

  const passwordHash = await bcrypt.hash(adminPassword!, 12);

  await prisma.user.upsert({
    where: { email: adminEmail! },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      name: adminName,
    },
    create: {
      email: adminEmail!,
      name: adminName,
      passwordHash,
      role: Role.SUPER_ADMIN,
      isVerified: true,
    }
  });
  console.log(`Admin user seeded/updated with email: ${adminEmail}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
