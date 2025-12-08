import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { routine_entry_service } from "./routine_entry.service.js";

const create_routine_entry = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_routine_entry = await routine_entry_service.create_routine_entry(
      req.validatedBody
    );

    return api_response(res, 201, {
      success: true,
      message: "Routine entry created successfully",
      data: new_routine_entry,
    });
  }
);

const all_routine_entry_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_routine_entry =
      await routine_entry_service.all_routine_entry_list();

    return api_response(res, 201, {
      success: true,
      message: "Routine entry List retrive successfully",
      data: all_routine_entry,
    });
  }
);

const update_routine_entry = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const routine_entry_id = req.params.routine_entry_id;
    const updated_routine_entry =
      await routine_entry_service.update_routine_entry(
        routine_entry_id,
        req.validatedBody
      );

    return api_response(res, 201, {
      success: true,
      message: "Routine entry updated successfully",
      data: updated_routine_entry,
    });
  }
);

const delete_routine_entry = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const routine_entry_id = req.params.routine_entry_id;
    const deleted_routine_entry =
      await routine_entry_service.delete_routine_entry(routine_entry_id);
    return api_response(res, 200, {
      success: true,
      message: "Routine entry deleted successfully",
      data: deleted_routine_entry,
    });
  }
);

export const routine_entry_controller = {
  create_routine_entry,
  all_routine_entry_list,
  update_routine_entry,
  delete_routine_entry,
};
