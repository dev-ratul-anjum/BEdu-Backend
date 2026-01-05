import check_auth from "$/middleware/auth.js";
import validate_data from "$/middleware/validate_data.js";
import { Router } from "express";
import {
  create_academic_year_schema,
  update_academic_year_schema,
} from "./academic_year.schema.js";
import { academic_year_controller } from "./academic_year.controller.js";

const academic_year_router = Router();

// Crate Academic Year
academic_year_router.post(
  "/create",
  check_auth(["ADMIN", "ADMIN"]),
  validate_data(create_academic_year_schema),
  academic_year_controller.create_academic_year
);

// Get All Academic Years
academic_year_router.get(
  "/all",
  check_auth(["ADMIN"]),
  academic_year_controller.all_academic_years_list
);

// Update Academic Year
academic_year_router.patch(
  "/update/:academic_year_id",
  check_auth(["ADMIN"]),
  validate_data(update_academic_year_schema),
  academic_year_controller.update_academic_year
);

// Delete Academic Year
academic_year_router.delete(
  "/delete/:academic_year_id",
  check_auth(["ADMIN"]),
  academic_year_controller.delete_academic_year
);

export default academic_year_router;
