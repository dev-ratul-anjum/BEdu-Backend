import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import { section_controller } from "./section.controller.js";
import {
  create_section_schema,
  update_section_schema,
} from "./section.schema.js";

const section_router = Router();

// Crate Academic Year
section_router.post(
  "/create",
  check_auth(["ADMIN"]),
  validate_data(create_section_schema),
  section_controller.create_section
);

// Get All Academic Years
section_router.get(
  "/all",
  check_auth(["ADMIN"]),
  section_controller.all_section_list
);

// Update Academic Year
section_router.patch(
  "/update/:section_id",
  check_auth(["ADMIN"]),
  validate_data(update_section_schema),
  section_controller.update_section
);

// Delete Academic Year
section_router.delete(
  "/delete/:section_id",
  check_auth(["ADMIN"]),
  section_controller.delete_section
);

export default section_router;
