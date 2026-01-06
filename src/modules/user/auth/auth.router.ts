import { Router } from "express";
import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { guardian_login_schema, login_schema } from "./auth.schema.js";
import auth_controller from "./auth.controller.js";

const auth_router = Router();

// Login User
auth_router.post(
  "/login",
  validate_data(login_schema),
  auth_controller.login_user
);

// Login Guardian
auth_router.post(
  "/login/guardian",
  validate_data(guardian_login_schema),
  auth_controller.login_guardian
);

// Logout User
auth_router.post("/logout", check_auth(), auth_controller.logout_user);

// Get Current User
// auth_router.get("/me", check_auth(), auth_controller.get_current_user);

export default auth_router;
