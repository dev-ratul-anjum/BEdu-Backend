import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { biometric_user_service } from "./biometric_user.service.js";

const create_biometric_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_biometric_user =
      await biometric_user_service.create_biometric_user(req.validatedBody);

    return api_response(res, 201, {
      success: true,
      message: "Biometric user created successfully",
      data: new_biometric_user,
    });
  }
);

const all_biometric_user_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_biometric_user =
      await biometric_user_service.all_biometric_user_list();

    return api_response(res, 201, {
      success: true,
      message: "Biometric user List retrive successfully",
      data: all_biometric_user,
    });
  }
);

const update_biometric_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const biometric_user_id = req.params.biometric_user_id;
    const updated_biometric_user =
      await biometric_user_service.update_biometric_user(
        biometric_user_id,
        req.validatedBody
      );

    return api_response(res, 201, {
      success: true,
      message: "Biometric user updated successfully",
      data: updated_biometric_user,
    });
  }
);

const delete_biometric_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const biometric_user_id = req.params.biometric_user_id;
    const deleted_biometric_user =
      await biometric_user_service.delete_biometric_user(biometric_user_id);
    return api_response(res, 200, {
      success: true,
      message: "Biometric user deleted successfully",
      data: deleted_biometric_user,
    });
  }
);

export const biometric_user_controller = {
  create_biometric_user,
  all_biometric_user_list,
  update_biometric_user,
  delete_biometric_user,
};
