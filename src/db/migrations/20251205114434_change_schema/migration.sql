-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parents" DROP CONSTRAINT "parents_user_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_user_id_fkey";

-- DropForeignKey
ALTER TABLE "super-admins" DROP CONSTRAINT "super-admins_user_id_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_user_id_fkey";

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parents" ADD CONSTRAINT "parents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super-admins" ADD CONSTRAINT "super-admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
