
-- This migration adds firstname, lastname, and school columns to the User table,
-- and populates firstname and lastname with the existing name value.
ALTER TABLE "User"
ADD COLUMN "firstname" TEXT,
ADD COLUMN "lastname" TEXT,
ADD COLUMN "email" TEXT UNIQUE,
ADD COLUMN "school" TEXT;

UPDATE "User"
SET "firstname" = "name",
    "lastname" = "name";

ALTER TABLE "User"
ALTER COLUMN "firstname" SET NOT NULL,
ALTER COLUMN "lastname" SET NOT NULL;

ALTER TABLE "User" DROP COLUMN "name";