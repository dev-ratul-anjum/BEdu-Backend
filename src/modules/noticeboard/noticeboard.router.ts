import require_auth from "$/middleware/auth.ts";
import { authorize_roles } from "$/utils/authorize_roles.ts";
import { file_uploader } from "$/utils/file_uploader.ts";
import { Router } from "express";
import noticeboard_controller from "./noticeboard.controller.ts";

const noticeboard_router = Router();

noticeboard_router.post(
  "/create",
  require_auth,
  authorize_roles("ADMIN"),
  file_uploader.upload.array("files"),
  noticeboard_controller.create
);

export default noticeboard_router;
