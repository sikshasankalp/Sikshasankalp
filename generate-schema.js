const fs = require('fs');
const path = require('path');

const bDir = path.join(__dirname, 'backend');

// Helper to write files
const write = (relPath, content) => {
  const fullPath = path.join(bDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
}

// 1. .env and .env.example
const envContent = `
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shiksha_sankalp"

JWT_ACCESS_SECRET="change_me"
JWT_REFRESH_SECRET="change_me"

FRONTEND_URL="http://localhost:5173"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
`;
write('.env', envContent);
write('.env.example', envContent);

// 2. .gitignore
write('.gitignore', `
node_modules
dist
.env
`);

// 3. schema.prisma
const schemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  SUPER_ADMIN
  CONTENT_ADMIN
  FINANCE_ADMIN
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(CONTENT_ADMIN)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model GalleryItem {
  id                 String   @id @default(uuid())
  title              String?
  description        String?
  imageUrl           String
  cloudinaryPublicId String?
  category           String?
  eventDate          DateTime?
  isFeatured         Boolean  @default(false)
  isPublished        Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Program {
  id               String   @id @default(uuid())
  title            String
  slug             String   @unique
  shortDescription String?
  description      String?
  imageUrl         String?
  isPublished      Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model TeamMember {
  id           String   @id @default(uuid())
  name         String
  role         String
  bio          String?
  imageUrl     String?
  displayOrder Int      @default(0)
  isPublished  Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model MediaCoverage {
  id               String   @id @default(uuid())
  publicationName  String
  title            String
  description      String?
  thumbnailUrl     String?
  articleUrl       String
  publishedAt      DateTime?
  isPublished      Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model DigitalLibrary {
  id                 String   @id @default(uuid())
  title              String
  description        String?
  category           String?
  resourceUrl        String
  thumbnailUrl       String?
  cloudinaryPublicId String?
  isPublished        Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model TransparencyDocument {
  id                 String   @id @default(uuid())
  title              String
  documentType       String
  documentUrl        String
  cloudinaryPublicId String?
  description        String?
  isPublished        Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

enum VolunteerStatus {
  NEW
  CONTACTED
  APPROVED
  REJECTED
}

model Volunteer {
  id        String          @id @default(uuid())
  name      String
  mobile    String
  email     String?
  city      String?
  skills    String?
  interest  String?
  message   String?
  status    VolunteerStatus @default(NEW)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
}

enum PartnerStatus {
  NEW
  CONTACTED
  APPROVED
  REJECTED
}

model PartnerEnquiry {
  id               String        @id @default(uuid())
  organisationName String
  contactPerson    String
  email            String
  mobile           String
  organisationType String?
  city             String?
  areaOfInterest   String?
  message          String?
  status           PartnerStatus @default(NEW)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

enum ContactStatus {
  NEW
  READ
  RESOLVED
}

model ContactMessage {
  id          String        @id @default(uuid())
  name        String
  mobile      String
  email       String?
  enquiryType String
  subject     String?
  message     String
  status      ContactStatus @default(NEW)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum DonationStatus {
  CREATED
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

model Donation {
  id                String         @id @default(uuid())
  donorName         String
  email             String?
  mobile            String
  pan               String?
  address           String?
  amount            Float
  currency          String         @default("INR")
  status            DonationStatus @default(CREATED)
  razorpayOrderId   String?
  razorpayPaymentId String?
  razorpaySignature String?
  receiptNumber     String?        @unique
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
}
`;
write('prisma/schema.prisma', schemaContent);

console.log('Schema and env files generated.');
