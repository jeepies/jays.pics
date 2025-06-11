-- AlterTable
ALTER TABLE "UploaderPreferences" ADD COLUMN     "subdomains" JSONB NOT NULL DEFAULT '{}';
