-- DropIndex
DROP INDEX "Project_name_ownerId_key";

-- Create partial unique index on name and ownerId where deletedAt is not null
CREATE UNIQUE INDEX "Project_name_ownerId_key"
ON "Project" ("name", "ownerId")
WHERE "deletedAt" IS NULL;