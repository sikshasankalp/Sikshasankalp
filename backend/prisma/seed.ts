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
  console.log(`Admin user seeded/updated with email: ${adminEmail}`);

  const transparencyDocs = [
    {
      title: '80G Tax Exemption Certificate',
      documentType: 'TAX_EXEMPTION_80G',
      documentNumber: 'ABOTS8425NE20261',
      documentUrl: '/documents/80G_Certificate.pdf',
      description: 'Income Tax 80G Approval Certificate. Donations made to Siksha Sankalp Foundation are eligible for 50% tax deduction under Section 80G of the Income Tax Act, 1961.',
      issuedDate: new Date('2026-06-03'),
      isPublished: true
    },
    {
      title: '12A / 12AB Registration Certificate',
      documentType: 'REGISTRATION_12A',
      documentNumber: 'ABOTS8425NE20261',
      documentUrl: '/documents/12A_Certificate.pdf',
      description: 'Income Tax Department registration under Section 12A / 12AB recognizing Siksha Sankalp Foundation as a non-profit charitable trust.',
      issuedDate: new Date('2026-06-03'),
      isPublished: true
    },
    {
      title: 'GST Registration Certificate',
      documentType: 'GST_CERTIFICATE',
      documentNumber: '09AAETS8425N1Z8',
      documentUrl: '/documents/GST_Registration.pdf',
      description: 'Official Goods and Services Tax (GST) Registration Certificate issued by the Government of India.',
      issuedDate: new Date('2026-06-03'),
      isPublished: true
    },
    {
      title: 'Trust Permanent Account Number (PAN Card)',
      documentType: 'PAN_CARD',
      documentNumber: 'AAETS8425N',
      documentUrl: '/documents/PAN_Card.pdf',
      description: 'Official Permanent Account Number (PAN) Card of Siksha Sankalp Foundation issued by the Income Tax Department.',
      issuedDate: new Date('2026-06-03'),
      isPublished: true
    },
    {
      title: 'Registered Trust Deed',
      documentType: 'TRUST_DEED',
      documentNumber: 'IN-UP97748090951454Y',
      documentUrl: '/documents/Trust_Deed.pdf',
      description: 'Official registered Trust Deed of Siksha Sankalp Foundation registered under the Indian Trusts Act with the Sub-Registrar.',
      issuedDate: new Date('2026-06-03'),
      isPublished: true
    }
  ];

  for (const doc of transparencyDocs) {
    const existing = await prisma.transparencyDocument.findFirst({
      where: { title: doc.title }
    });
    if (!existing) {
      await prisma.transparencyDocument.create({ data: doc });
    }
  }
  console.log('Transparency documents verified in database.');

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
