/*
  Warnings:

  - The `urls` column on the `UploaderPreferences` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UploaderPreferences" ALTER COLUMN "embed_colour" SET DEFAULT '#e05cd9',
DROP COLUMN "urls",
ADD COLUMN     "urls" TEXT[] DEFAULT ARRAY['jays.pics']::TEXT[];
