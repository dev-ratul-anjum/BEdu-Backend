/*
  Warnings:

  - You are about to drop the column `role` on the `teachers` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "phones" ADD COLUMN     "adminId" TEXT;

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "role";

-- DropEnum
DROP TYPE "TeacherRole";

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_user_id_key" ON "admins"("user_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phones" ADD CONSTRAINT "phones_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
