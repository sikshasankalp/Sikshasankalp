-- CreateTable
CREATE TABLE "ImpactMetric" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImpactMetric_pkey" PRIMARY KEY ("id")
);

INSERT INTO "ImpactMetric" ("id", "value", "label", "description", "displayOrder", "isPublished", "updatedAt") VALUES
('seed-metric-1', 42, 'Children Supported', 'Guided and supported toward school admission and mainstream education.', 1, true, CURRENT_TIMESTAMP),
('seed-metric-2', 35, 'Families Supported', 'Provided with portable bath tents, helping improve privacy, hygiene, and dignity.', 2, true, CURRENT_TIMESTAMP);
