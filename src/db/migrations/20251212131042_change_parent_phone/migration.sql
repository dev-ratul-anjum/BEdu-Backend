/*
  Warnings:

  - You are about to drop the column `father_phone` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `guardian_phone` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `mother_phone` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `phones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "parents" DROP COLUMN "father_phone",
DROP COLUMN "guardian_phone",
DROP COLUMN "mother_phone";

-- AlterTable
ALTER TABLE "phones" DROP COLUMN "name",
ADD COLUMN     "aditional_info" TEXT;
