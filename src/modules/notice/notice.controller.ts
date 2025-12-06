// import { validate_data } from "$/lib/validate_data.js";
import api_response from "$/middleware/api_response.js";
import { Api_error } from "$/middleware/error_handler.js";
import { upload_multiple_to_cloudinary } from "$/utils/file_uploader.js";
import { NextFunction, Request, Response } from "express";
import { create_noticeboard_schema } from "./notice.schema.js";
import notice_service from "./notice.service.js";

const create_notice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new Api_error("No files uploaded", 400);
    }

    const resuljs = await upload_multiple_to_cloudinary(files);
    const urls = resuljs.map((r) => r.secure_url);

    const data = {
      ...req.body,
      target_roles: JSON.parse(req.body.target_roles),
      content: urls,
    };

    // const sanitize_data = validate_data(create_noticeboard_schema, data);

    // const new_noticeboard = await noticeboard_service.create(sanitize_data);
    // console.log(new_noticeboard);
    //
    return api_response(res, 201, {
      success: true,
      message: "noticeboard created successfully",
      // data: new_noticeboard,
    });
  } catch (error) {
    next(error);
  }
};
const notice_controller = {
  create_notice,
};

export default notice_controller;
