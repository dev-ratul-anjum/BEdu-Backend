/*
  Warnings:

  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'SUPER_ADMIN';

-- DropIndex
DROP INDEX "users_phone_key";

-- AlterTable
ALTER TABLE "phones" ADD COLUMN     "superAdminId" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "super-admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "super-admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "super-admins_email_key" ON "super-admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "super-admins_user_id_key" ON "super-admins"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "phones" ADD CONSTRAINT "phones_superAdminId_fkey" FOREIGN KEY ("superAdminId") REFERENCES "super-admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super-admins" ADD CONSTRAINT "super-admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
