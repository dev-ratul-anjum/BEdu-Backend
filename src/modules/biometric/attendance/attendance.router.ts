import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import { attendance_controller } from "./attendance.controller.js";
import {
  create_attendance_raw_schema,
  update_attendance_daily_schema,
} from "./attendance.schema.js";

const attendance_router = Router();

// Crate Attendance
attendance_router.post(
  "/create",
  check_auth(["SUPER_ADMIN"]),
  validate_data(create_attendance_raw_schema),
  attendance_controller.create_attendance
);

// Get All Attendance
attendance_router.get(
  "/all",
  check_auth(["SUPER_ADMIN"]),
  attendance_controller.all_attendance_list
);
// Get All Raw Attendance
attendance_router.get(
  "/all/raw",
  check_auth(["SUPER_ADMIN"]),
  attendance_controller.all_raw_attendance_list
);

// Update Attendance
attendance_router.patch(
  "/update/:attendance_id",
  check_auth(["SUPER_ADMIN"]),
  validate_data(update_attendance_daily_schema),
  attendance_controller.update_attendance
);

// Delete Attendance
attendance_router.delete(
  "/delete/:attendance_id",
  check_auth(["SUPER_ADMIN"]),
  attendance_controller.delete_attendance
);

export default attendance_router;
