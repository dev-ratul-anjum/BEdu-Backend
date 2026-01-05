/*
  Warnings:

  - The values [PARENT,SUPER_ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `address` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `students` table. All the data in the column will be lost.
  - The `blood_group` column on the `students` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `attendances` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `first_name` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'HINDUISM');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
ALTER TABLE "notices" ALTER COLUMN "target_roles" TYPE "UserRole_new"[] USING ("target_roles"::text::"UserRole_new"[]);
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_student_id_fkey";

-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_user_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "super-admins" DROP CONSTRAINT "super-admins_user_id_fkey";

-- AlterTable
ALTER TABLE "parents" ADD COLUMN     "father_phone" TEXT,
ADD COLUMN     "guardian_phone" TEXT,
ADD COLUMN     "mother_phone" TEXT;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "address",
DROP COLUMN "name",
DROP COLUMN "parent_id",
ADD COLUMN     "addmission_date" TIMESTAMP(3),
ADD COLUMN     "current_address" TEXT,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "permanent_address" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "religion" "Religion",
ALTER COLUMN "roll_no" DROP NOT NULL,
DROP COLUMN "blood_group",
ADD COLUMN     "blood_group" "BloodGroup";

-- DropTable
DROP TABLE "attendances";

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "occupation" TEXT,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_phone_key" ON "Guardian"("phone");

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
