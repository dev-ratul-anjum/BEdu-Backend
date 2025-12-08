import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { class_service } from "./class.service.js";

const create_class = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_class = await class_service.create_class(req.validatedBody);

    return api_response(res, 201, {
      success: true,
      message: "Class created successfully",
      data: new_class,
    });
  }
);

const all_class_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_class = await class_service.all_class_list();

    return api_response(res, 201, {
      success: true,
      message: "Class List retrive successfully",
      data: all_class,
    });
  }
);

const update_class = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const class_id = req.params.class_id;
    const updated_class = await class_service.update_class(
      class_id,
      req.validatedBody
    );

    return api_response(res, 201, {
      success: true,
      message: "Class updated successfully",
      data: updated_class,
    });
  }
);

const delete_class = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const class_id = req.params.class_id;
    const deleted_class = await class_service.delete_class(class_id);
    return api_response(res, 200, {
      success: true,
      message: "Class deleted successfully",
      data: deleted_class,
    });
  }
);

export const class_controller = {
  create_class,
  all_class_list,
  update_class,
  delete_class,
};
