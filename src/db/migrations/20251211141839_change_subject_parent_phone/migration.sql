/*
  Warnings:

  - You are about to drop the column `email` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `parents` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `phones` table. All the data in the column will be lost.
  - You are about to drop the column `superAdminId` on the `phones` table. All the data in the column will be lost.
  - You are about to drop the column `routine_id` on the `subjects` table. All the data in the column will be lost.
  - Made the column `class_id` on table `routines` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_adminId_fkey";

-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "routines" DROP CONSTRAINT "routines_class_id_fkey";

-- DropIndex
DROP INDEX "routines_academic_year_id_key";

-- DropIndex
DROP INDEX "routines_section_id_key";

-- DropIndex
DROP INDEX "routines_subject_id_key";

-- DropIndex
DROP INDEX "routines_teacher_id_key";

-- AlterTable
ALTER TABLE "parents" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "father_name" TEXT,
ADD COLUMN     "father_occupation" TEXT,
ADD COLUMN     "father_phone" TEXT,
ADD COLUMN     "father_photo" TEXT,
ADD COLUMN     "guardian_address" TEXT,
ADD COLUMN     "guardian_email" TEXT,
ADD COLUMN     "guardian_name" TEXT,
ADD COLUMN     "guardian_occupation" TEXT,
ADD COLUMN     "guardian_phone" TEXT,
ADD COLUMN     "guardian_photo" TEXT,
ADD COLUMN     "guardian_relation" TEXT,
ADD COLUMN     "mother_name" TEXT,
ADD COLUMN     "mother_occupation" TEXT,
ADD COLUMN     "mother_phone" TEXT,
ADD COLUMN     "mother_photo" TEXT;

-- AlterTable
ALTER TABLE "phones" DROP COLUMN "adminId",
DROP COLUMN "superAdminId",
ADD COLUMN     "admin_id" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "super_admin_id" TEXT;

-- AlterTable
ALTER TABLE "routines" ALTER COLUMN "class_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "routine_id";

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phones" ADD CONSTRAINT "phones_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phones" ADD CONSTRAINT "phones_super_admin_id_fkey" FOREIGN KEY ("super_admin_id") REFERENCES "super-admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
