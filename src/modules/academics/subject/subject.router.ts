import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import { subject_controller } from "./subject.controller.js";
import {
  create_subject_schema,
  update_subject_schema,
} from "./subject.schema.js";

const subject_router = Router();

// Crate Academic Year
subject_router.post(
  "/create",
  check_auth(["ADMIN"]),
  validate_data(create_subject_schema),
  subject_controller.create_subject
);

// Get All Academic Years
subject_router.get(
  "/all",
  check_auth(["ADMIN"]),
  subject_controller.all_subject_list
);

// Update Academic Year
subject_router.patch(
  "/update/:subject_id",
  check_auth(["ADMIN"]),
  validate_data(update_subject_schema),
  subject_controller.update_subject
);

// Delete Academic Year
subject_router.delete(
  "/delete/:subject_id",
  check_auth(["ADMIN"]),
  subject_controller.delete_subject
);

export default subject_router;
