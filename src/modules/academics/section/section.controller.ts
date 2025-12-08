import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { section_service } from "./section.service.js";

const create_section = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_section = await section_service.create_section(req.validatedBody);

    return api_response(res, 201, {
      success: true,
      message: "section created successfully",
      data: new_section,
    });
  }
);

const all_section_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_section = await section_service.all_section_list();

    return api_response(res, 201, {
      success: true,
      message: "section List retrive successfully",
      data: all_section,
    });
  }
);

const update_section = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const section_id = req.params.section_id;
    const updated_section = await section_service.update_section(
      section_id,
      req.validatedBody
    );

    return api_response(res, 201, {
      success: true,
      message: "section updated successfully",
      data: updated_section,
    });
  }
);

const delete_section = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const section_id = req.params.section_id;
    const deleted_section = await section_service.delete_section(section_id);
    return api_response(res, 200, {
      success: true,
      message: "section deleted successfully",
      data: deleted_section,
    });
  }
);

export const section_controller = {
  create_section,
  all_section_list,
  update_section,
  delete_section,
};
