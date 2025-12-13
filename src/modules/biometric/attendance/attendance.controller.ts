import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { attendance_service } from "./attendance.service.js";

const create_attendance = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_attendance = await attendance_service.create_attendance(
      req.validatedBody
    );

    return api_response(res, 201, {
      success: true,
      message: "Attendance created successfully",
      data: new_attendance,
    });
  }
);

const all_attendance_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_attendance = await attendance_service.all_attendance_list();

    return api_response(res, 201, {
      success: true,
      message: "All attendance list retrive successfully",
      data: all_attendance,
    });
  }
);

const all_raw_attendance_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_raw_attendance =
      await attendance_service.all_raw_attendance_list();

    return api_response(res, 201, {
      success: true,
      message: "All raw attendance list retrive successfully",
      data: all_raw_attendance,
    });
  }
);

const update_attendance = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const attendance_id = req.params.attendance_id;
    const updated_attendance = await attendance_service.update_attendance(
      attendance_id,
      req.validatedBody
    );

    return api_response(res, 200, {
      success: true,
      message: "Attendance updated successfully",
      data: updated_attendance,
    });
  }
);

const delete_attendance = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const attendance_id = req.params.attendance_id;
    const deleted_attendance = await attendance_service.delete_attendance(
      attendance_id
    );
    return api_response(res, 200, {
      success: true,
      message: "Attendance deleted successfully",
      data: deleted_attendance,
    });
  }
);

export const attendance_controller = {
  create_attendance,
  all_attendance_list,
  all_raw_attendance_list,
  update_attendance,
  delete_attendance,
};
