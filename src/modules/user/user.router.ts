import { Router } from "express";
import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import {
  create_student_schema,
  login_user_schema,
  update_user_schema,
} from "./user.schema.js";
import user_controller from "./user.controller.js";

const user_router = Router();

// Register Any User
// user_router.post(
//   "/register",
//   check_auth(["ADMIN"]),
//   validate_data(create_user_schema),
//   user_controller.create_user
// );

// Register Any Student & Guardians
user_router.post(
  "/student/register",
  check_auth(["ADMIN"]),
  validate_data(create_student_schema),
  user_controller.create_student
);

// Update User Info
user_router.patch(
  "/update",
  check_auth(),
  validate_data(update_user_schema),
  user_controller.login_user
);

// Update User Info By Admin
user_router.patch(
  "/update/by-admin/:user_id",
  check_auth(["ADMIN"]),
  validate_data(update_user_schema),
  user_controller.update_user_by_admin
);

// List of Users
user_router.get("/all", check_auth(["ADMIN"]), user_controller.all_users_list);
user_router.get(
  "/all/students",
  check_auth(["ADMIN"]),
  user_controller.all_students_list
);
user_router.get(
  "/all/teachers",
  check_auth(["ADMIN"]),
  user_controller.all_teachers_list
);
// user_router.get(
//   "/all/parents",
//   check_auth(["ADMIN"]),
//   user_controller.all_parents_list
// );
user_router.get(
  "/all/admins",
  check_auth(["ADMIN"]),
  user_controller.all_admins_list
);
user_router.get(
  "/all/super-admins",
  check_auth(["ADMIN"]),
  user_controller.all_admins_list
);

// Delete Any User
user_router.delete(
  "/delete/:user_id",
  check_auth(["ADMIN"]),
  user_controller.delete_user
);

// Login User
user_router.post(
  "/login",
  validate_data(login_user_schema),
  user_controller.login_user
);

// Logout User
user_router.post("/logout", check_auth(), user_controller.logout_user);
// Get Current User
user_router.get("/me", check_auth(), user_controller.get_current_user);

export default user_router;
