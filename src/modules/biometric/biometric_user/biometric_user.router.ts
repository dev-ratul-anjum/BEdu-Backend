import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import {
  create_biometric_user_schema,
  update_biometric_user_schema,
} from "./biometric_user.schema.js";
import { biometric_user_controller } from "./biometric_user.controller.js";

const biometric_user_router = Router();

// Crate Academic Year
biometric_user_router.post(
  "/create",
  check_auth(),
  validate_data(create_biometric_user_schema),
  biometric_user_controller.create_biometric_user
);

// Get All Academic Years
biometric_user_router.get(
  "/all",
  check_auth(),
  biometric_user_controller.all_biometric_user_list
);

// Update Academic Year
biometric_user_router.patch(
  "/update/:biometric_user_id",
  check_auth(),
  validate_data(update_biometric_user_schema),
  biometric_user_controller.update_biometric_user
);

// Delete Academic Year
biometric_user_router.delete(
  "/delete/:biometric_user_id",
  check_auth(),
  biometric_user_controller.delete_biometric_user
);

export default biometric_user_router;
