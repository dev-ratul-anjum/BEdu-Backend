import { Router } from "express";
import check_auth from "$/middleware/auth.js";
import validate_data from "$/lib/validate_data.js";
import { create_user_schema, login_user_schema } from "./user.schema.js";
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

// Update User Role
user_router.patch(
  "/update",
  check_auth(["SUPER_ADMIN"]),
  validate_data(login_user_schema),
  user_controller.login_user
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
