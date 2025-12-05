/*
  Warnings:

  - The `target_roles` column on the `notices` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `accountant_id` on the `phones` table. All the data in the column will be lost.
  - You are about to drop the column `admin_id` on the `phones` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staffs` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TEACHER', 'STUDENT', 'PARENT');

-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'NORMAL');

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_accountant_id_fkey";

-- DropForeignKey
ALTER TABLE "phones" DROP CONSTRAINT "phones_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "staffs" DROP CONSTRAINT "staffs_user_id_fkey";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "notices" DROP COLUMN "target_roles",
ADD COLUMN     "target_roles" "UserRole"[];

-- AlterTable
ALTER TABLE "phones" DROP COLUMN "accountant_id",
DROP COLUMN "admin_id";

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "role" "TeacherRole" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "username",
ADD COLUMN     "phone" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "staffs";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
