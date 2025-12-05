import { file_uploader } from "$/utils/file_uploader.js";
import { Router } from "express";
import noticeboard_controller from "./notice.controller.js";
import check_auth from "$/middleware/auth.js";

const notice_router = Router();

notice_router.post(
  "/create",
  check_auth(["ADMIN"]),
  file_uploader.upload.array("files"),
  noticeboard_controller.create_notice
);

export default notice_router;
