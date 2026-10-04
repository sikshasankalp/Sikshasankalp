-- AlterTable
ALTER TABLE "Donation" ADD COLUMN "receiptEmailSentAt" TIMESTAMP(3),
ADD COLUMN "receiptGeneratedAt" TIMESTAMP(3),
ADD COLUMN "receiptToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Donation_receiptToken_key" ON "Donation"("receiptToken");
