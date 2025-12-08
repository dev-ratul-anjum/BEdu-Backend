import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { subject_service } from "./subject.service.js";

const create_subject = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_subject = await subject_service.create_subject(req.validatedBody);

    return api_response(res, 201, {
      success: true,
      message: "subject created successfully",
      data: new_subject,
    });
  }
);

const all_subject_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_subject = await subject_service.all_subject_list();

    return api_response(res, 201, {
      success: true,
      message: "subject List retrive successfully",
      data: all_subject,
    });
  }
);

const update_subject = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const subject_id = req.params.subject_id;
    const updated_subject = await subject_service.update_subject(
      subject_id,
      req.validatedBody
    );

    return api_response(res, 201, {
      success: true,
      message: "subject updated successfully",
      data: updated_subject,
    });
  }
);

const delete_subject = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const subject_id = req.params.subject_id;
    const deleted_subject = await subject_service.delete_subject(subject_id);
    return api_response(res, 200, {
      success: true,
      message: "subject deleted successfully",
      data: deleted_subject,
    });
  }
);

export const subject_controller = {
  create_subject,
  all_subject_list,
  update_subject,
  delete_subject,
};
