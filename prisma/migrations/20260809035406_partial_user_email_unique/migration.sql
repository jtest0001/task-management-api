-- DropIndex
DROP INDEX "User_email_key";

-- Create partial unique index on email where email is not null
CREATE UNIQUE INDEX "User_email_active_key"
ON "User" ("email")
WHERE "deletedAt" IS NULL;
