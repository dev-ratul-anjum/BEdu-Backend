-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('PRESENT', 'LATE', 'ABSENT');

-- CreateEnum
CREATE TYPE "DayStatus" AS ENUM ('PRESENT', 'ABSENT');

-- CreateEnum
CREATE TYPE "VerifyType" AS ENUM ('FACE', 'FINGER');

-- CreateTable
CREATE TABLE "AttendanceDaily" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "morning_status" "SlotStatus" NOT NULL DEFAULT 'ABSENT',
    "noon_status" "SlotStatus" NOT NULL DEFAULT 'ABSENT',
    "final_status" "DayStatus" NOT NULL DEFAULT 'ABSENT',

    CONSTRAINT "AttendanceDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRaw" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "verify_type" "VerifyType" NOT NULL,

    CONSTRAINT "AttendanceRaw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiometricDevice" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiometricUser" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cumulative_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceDaily_user_id_date_key" ON "AttendanceDaily"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "BiometricUser_user_id_key" ON "BiometricUser"("user_id");

-- AddForeignKey
ALTER TABLE "AttendanceDaily" ADD CONSTRAINT "AttendanceDaily_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRaw" ADD CONSTRAINT "AttendanceRaw_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "BiometricDevice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRaw" ADD CONSTRAINT "AttendanceRaw_device_user_id_fkey" FOREIGN KEY ("device_user_id") REFERENCES "BiometricUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricUser" ADD CONSTRAINT "BiometricUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
