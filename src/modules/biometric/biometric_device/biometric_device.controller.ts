import api_response from "$/middleware/api_response.js";
import catch_async from "$/utils/catch_async.js";
import { NextFunction, Request, Response } from "express";
import { biometric_device_service } from "./biometric_device.service.js";

const create_biometric_device = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const new_biometric_device =
      await biometric_device_service.create_biometric_device(req.validatedBody);

    return api_response(res, 201, {
      success: true,
      message: "Biometric device created successfully",
      data: new_biometric_device,
    });
  }
);

const all_biometric_device_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_biometric_device =
      await biometric_device_service.all_biometric_device_list();

    return api_response(res, 201, {
      success: true,
      message: "Biometric device List retrive successfully",
      data: all_biometric_device,
    });
  }
);

const update_biometric_device = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const biometric_device_id = req.params.biometric_device_id;
    const updated_biometric_device =
      await biometric_device_service.update_biometric_device(
        biometric_device_id,
        req.validatedBody
      );

    return api_response(res, 201, {
      success: true,
      message: "Biometric device updated successfully",
      data: updated_biometric_device,
    });
  }
);

const delete_biometric_device = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const biometric_device_id = req.params.biometric_device_id;
    const deleted_biometric_device =
      await biometric_device_service.delete_biometric_device(
        biometric_device_id
      );
    return api_response(res, 200, {
      success: true,
      message: "Biometric device deleted successfully",
      data: deleted_biometric_device,
    });
  }
);

export const biometric_device_controller = {
  create_biometric_device,
  all_biometric_device_list,
  update_biometric_device,
  delete_biometric_device,
};
