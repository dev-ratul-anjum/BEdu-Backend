import { Router } from "express";
import check_auth from "$/middleware/auth.js";
import validate_data from "$/lib/validate_data.js";
import {
  create_user_schema,
  login_user_schema,
  update_user_schema,
} from "./user.schema.js";
import user_controller from "./user.controller.js";

const user_router = Router();

// Register Any User
user_router.post(
  "/register",
  check_auth(["SUPER_ADMIN"]),
  validate_data(create_user_schema),
  user_controller.create_user
);

// Update User Info
user_router.patch(
  "/update",
  check_auth(),
  validate_data(login_user_schema),
  user_controller.login_user
);

// Update User Info By Admin
user_router.patch(
  "/update/by-admin",
  check_auth(["SUPER_ADMIN"]),
  validate_data(update_user_schema),
  user_controller.update_user_by_admin
);

// List of Users
user_router.get(
  "/all/students",
  check_auth(["SUPER_ADMIN"]),
  user_controller.all_students_list
);
user_router.get(
  "/all/teachers",
  check_auth(["SUPER_ADMIN"]),
  user_controller.all_teachers_list
);
user_router.get(
  "/all/parents",
  check_auth(["SUPER_ADMIN"]),
  user_controller.all_parents_list
);
user_router.get(
  "/all/admins",
  check_auth(["SUPER_ADMIN"]),
  user_controller.all_admins_list
);
user_router.get(
  "/all/super-admins",
  check_auth(["SUPER_ADMIN"]),
  user_controller.all_super_admins_list
);

// Delete Any User
user_router.delete(
  "/delete",
  check_auth(["SUPER_ADMIN"]),
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
