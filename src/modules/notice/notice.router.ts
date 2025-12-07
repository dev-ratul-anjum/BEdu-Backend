import { file_uploader } from "$/utils/file_uploader.js";
import { Router } from "express";
import check_auth from "$/middleware/auth.js";
import { notice_controller } from "./notice.controller.js";
import validate_data from "$/middleware/validate_data.js";
import { create_notice_schema } from "./notice.schema.js";

const notice_router = Router();

// Crate Notice
notice_router.post(
  "/create",
  check_auth(["SUPER_ADMIN", "ADMIN"]),
  validate_data(create_notice_schema),
  file_uploader.upload.array("files"),
  notice_controller.create_notice
);

// Get All Notices
notice_router.get("/all", notice_controller.all_notices_list);
// Mark As Delete
notice_router.patch(
  "/archive/:notice_id",
  check_auth(["SUPER_ADMIN"]),
  notice_controller.archive_notice
);

export default notice_router;
