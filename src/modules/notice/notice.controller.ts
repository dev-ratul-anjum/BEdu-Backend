import api_response from "$/middleware/api_response.js";
import { Api_error } from "$/middleware/error_handler.js";
import catch_async from "$/utils/catch_async.js";
import { upload_multiple_to_cloudinary } from "$/utils/file_uploader.js";
import { NextFunction, Request, Response } from "express";
import { notice_service } from "./notice.service.js";

const create_notice = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new Api_error(
        "No files uploaded. Content must contain at least 1 file.",
        400,
        "files"
      );
    }

    const resuljs = await upload_multiple_to_cloudinary(files);
    const urls = resuljs.map((r) => r.secure_url);

    const data = {
      ...req.validatedBody,
      target_roles: JSON.parse(req.validatedBody.target_roles),
      content: urls,
    };

    const new_notice = await notice_service.create_notice(data);

    return api_response(res, 201, {
      success: true,
      message: "Notice created successfully",
      data: new_notice,
    });
  }
);

const all_notices_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const notices = await notice_service.all_notices_list();

    return api_response(res, 201, {
      success: true,
      message: "Notice List retrive successfully",
      data: notices,
    });
  }
);

const archive_notice = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const notice_id = req.params.notice_id;
    const archive_notice = await notice_service.archive_notice(notice_id);

    return api_response(res, 201, {
      success: true,
      message: "Notice archived successfully",
      data: archive_notice,
    });
  }
);

export const notice_controller = {
  create_notice,
  all_notices_list,
  archive_notice,
};
