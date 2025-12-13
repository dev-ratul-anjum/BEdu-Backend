import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import {
  create_biometric_device_schema,
  update_biometric_device_schema,
} from "./biometric_device.schema.js";
import { biometric_device_controller } from "./biometric_device.controller.js";

const biometric_device_router = Router();

// Crate Academic Year
biometric_device_router.post(
  "/create",
  check_auth(["SUPER_ADMIN"]),
  validate_data(create_biometric_device_schema),
  biometric_device_controller.create_biometric_device
);

// Get All Academic Years
biometric_device_router.get(
  "/all",
  check_auth(["SUPER_ADMIN"]),
  biometric_device_controller.all_biometric_device_list
);

// Update Academic Year
biometric_device_router.patch(
  "/update/:biometric_device_id",
  check_auth(["SUPER_ADMIN"]),
  validate_data(update_biometric_device_schema),
  biometric_device_controller.update_biometric_device
);

// Delete Academic Year
biometric_device_router.delete(
  "/delete/:biometric_device_id",
  check_auth(["SUPER_ADMIN"]),
  biometric_device_controller.delete_biometric_device
);

export default biometric_device_router;
