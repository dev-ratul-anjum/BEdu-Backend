import { Router } from "express";
import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { create_student_schema } from "./student.schema.js";
import student_controller from "./student.controller.js";

const student_router = Router();

// Register Any Student & Guardians
student_router.post(
  "/register",
  check_auth(["ADMIN"]),
  validate_data(create_student_schema),
  student_controller.create_student
);

// // Update User Info
// student_router.patch(
//   "/update",
//   check_auth(),
//   validate_data(update_user_schema),
//   student_controller.login_user
// );

// // Update User Info By Admin
// student_router.patch(
//   "/update/by-admin/:user_id",
//   check_auth(["ADMIN"]),
//   validate_data(update_user_schema),
//   student_controller.update_user_by_admin
// );

student_router.get(
  "/all/students",
  check_auth(["ADMIN"]),
  student_controller.all_students_list
);

// Delete Any User
student_router.delete(
  "/delete/:user_id",
  check_auth(["ADMIN"]),
  student_controller.delete_student
);

export default student_router;
