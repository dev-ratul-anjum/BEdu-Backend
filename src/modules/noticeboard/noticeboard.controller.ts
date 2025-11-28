import { validate_data } from "$/lib/validate_data.ts";
import api_response from "$/middleware/api_response.ts";
import { Api_error } from "$/middleware/error.ts";
import { upload_multiple_to_cloudinary } from "$/utils/file_uploader.ts";
import { RequestHandler } from "express";
import { create_noticeboard_schema } from "./noticeboard.schema.ts";
import noticeboard_service from "./noticeboard.service.ts";

const noticeboard_controller = {
  create: async (req, res, next) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new Api_error("No files uploaded", 400);
      }

      const results = await upload_multiple_to_cloudinary(files);
      const urls = results.map((r) => r.secure_url);

      const data = {
        ...req.body,
        target_roles: JSON.parse(req.body.target_roles),
        content: urls,
      };

      const sanitize_data = validate_data(create_noticeboard_schema, data);

      const new_noticeboard = await noticeboard_service.create(sanitize_data);
      console.log(new_noticeboard);

      return api_response(res, 201, {
        success: true,
        message: "noticeboard created successfully",
        data: new_noticeboard,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res) => {},

  delete: async (req, res) => {},
} satisfies Record<string, RequestHandler>;

export default noticeboard_controller;
