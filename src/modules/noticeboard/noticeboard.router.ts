import { requireAuth } from "$/middleware/auth.ts";
import { authorize_roles } from "$/utils/authorize_roles.ts";
import express from "express";
import noticeboard_controller from "./noticeboard.controller.ts";
import { fileUploader } from "$/utils/fileUploader.ts";

const noticeboard_router = express.Router();

noticeboard_router.post(
  "/create",
  requireAuth,
  authorize_roles("ADMIN"),
  fileUploader.upload.array("files"),
  noticeboard_controller.create
);

export default noticeboard_router;
