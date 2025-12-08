-- AlterTable
ALTER TABLE "notices" ADD COLUMN     "attachments" TEXT[],
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;
