import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import { create_class_schema, update_class_schema } from "./class.schema.js";
import { class_controller } from "./class.controller.js";

const class_router = Router();

// Crate Academic Year
class_router.post(
  "/create",
  check_auth(["SUPER_ADMIN"]),
  validate_data(create_class_schema),
  class_controller.create_class
);

// Get All Academic Years
class_router.get(
  "/all",
  check_auth(["SUPER_ADMIN"]),
  class_controller.all_class_list
);

// Update Academic Year
class_router.patch(
  "/update/:class_id",
  check_auth(["SUPER_ADMIN"]),
  validate_data(update_class_schema),
  class_controller.update_class
);

// Delete Academic Year
class_router.delete(
  "/delete/:class_id",
  check_auth(["SUPER_ADMIN"]),
  class_controller.delete_class
);

export default class_router;
