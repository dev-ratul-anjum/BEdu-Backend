import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import {
  create_routine_entry_schema,
  update_routine_entry_schema,
} from "./routine_entry.schema.js";
import { routine_entry_controller } from "./routine_entry.controller.js";

const routine_entry_router = Router();

// Crate Academic Year
routine_entry_router.post(
  "/create",
  check_auth(["SUPER_ADMIN"]),
  validate_data(create_routine_entry_schema),
  routine_entry_controller.create_routine_entry
);

// Get All Academic Years
routine_entry_router.get(
  "/all",
  check_auth(["SUPER_ADMIN"]),
  routine_entry_controller.all_routine_entry_list
);

// Update Academic Year
routine_entry_router.patch(
  "/update/:routine_entry_id",
  check_auth(["SUPER_ADMIN"]),
  validate_data(update_routine_entry_schema),
  routine_entry_controller.update_routine_entry
);

// Delete Academic Year
routine_entry_router.delete(
  "/delete/:routine_entry_id",
  check_auth(["SUPER_ADMIN"]),
  routine_entry_controller.delete_routine_entry
);

export default routine_entry_router;
