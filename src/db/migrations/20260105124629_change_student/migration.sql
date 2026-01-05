/*
  Warnings:

  - You are about to drop the column `student_id` on the `Guardian` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `phones` table. All the data in the column will be lost.
  - You are about to drop the column `super_admin_id` on the `phones` table. All the data in the column will be lost.
  - You are about to drop the `parents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `super-admins` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `relation` to the `Guardian` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GuardianRelation" AS ENUM ('FATHER', 'MOTHER', 'SISTER', 'BROTHER');

-- DropForeignKey
ALTER TABLE "Guardian" DROP CONSTRAINT "Guardian_student_id_fkey";

-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_super_admin_id_fkey";

-- AlterTable
ALTER TABLE "Guardian" DROP COLUMN "student_id",
ADD COLUMN     "relation" "GuardianRelation" NOT NULL;

-- AlterTable
ALTER TABLE "phones" DROP COLUMN "parent_id",
DROP COLUMN "super_admin_id";

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "guardians" TEXT[];

-- DropTable
DROP TABLE "parents";

-- DropTable
DROP TABLE "super-admins";
