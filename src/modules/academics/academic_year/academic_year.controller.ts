import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { academic_year_service } from "./academic_year.service.js";

const create_academic_year = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_academic_year = await academic_year_service.create_academic_year(
      req.validatedBody
    );

    return api_response(res, 201, {
      success: true,
      message: "Academic year created successfully",
      data: new_academic_year,
    });
  }
);

const all_academic_years_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const academic_years =
      await academic_year_service.all_academic_years_list();

    return api_response(res, 201, {
      success: true,
      message: "Academic year List retrive successfully",
      data: academic_years,
    });
  }
);

const update_academic_year = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const academic_year_id = req.params.academic_year_id;
    const updated_academic_year =
      await academic_year_service.update_academic_year(
        academic_year_id,
        req.validatedBody
      );

    return api_response(res, 201, {
      success: true,
      message: "Academic year updated successfully",
      data: updated_academic_year,
    });
  }
);

const delete_academic_year = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const academic_year_id = req.params.academic_year_id;
    const deleted_academic_year =
      await academic_year_service.delete_academic_year(academic_year_id);
    return api_response(res, 200, {
      success: true,
      message: "Academic year deleted successfully",
      data: deleted_academic_year,
    });
  }
);

export const academic_year_controller = {
  create_academic_year,
  all_academic_years_list,
  update_academic_year,
  delete_academic_year,
};
