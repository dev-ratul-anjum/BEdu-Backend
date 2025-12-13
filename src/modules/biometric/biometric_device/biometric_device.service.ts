import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_biometric_device_schema,
  TUpdate_biometric_device_schema,
} from "./biometric_device.schema.js";

const create_biometric_device = async (
  data: TCreate_biometric_device_schema
) => {
  const new_biometric_device = await db.biometricDevice.create({
    data: data,
  });
  return new_biometric_device;
};

const all_biometric_device_list = async () => {
  const all_biometric_device = await db.biometricDevice.findMany();
  return all_biometric_device;
};

const update_biometric_device = async (
  biometric_device_id: string,
  data: TUpdate_biometric_device_schema
) => {
  const exist_biometric_device = await db.biometricDevice.findUnique({
    where: { id: biometric_device_id },
  });
  if (!exist_biometric_device) {
    throw new Api_error("Requested biometric device does not exist", 404);
  }

  const updated_biometric_device = await db.biometricDevice.update({
    where: { id: biometric_device_id },
    data: data,
  });
  return updated_biometric_device;
};

const delete_biometric_device = async (biometric_device_id: string) => {
  const exist_biometric_device = await db.biometricDevice.findUnique({
    where: { id: biometric_device_id },
  });
  if (!exist_biometric_device) {
    throw new Api_error("Requested biometric device does not exist", 404);
  }

  const deleted_biometric_device = await db.biometricDevice.delete({
    where: { id: biometric_device_id },
  });
  return deleted_biometric_device;
};

export const biometric_device_service = {
  create_biometric_device,
  all_biometric_device_list,
  update_biometric_device,
  delete_biometric_device,
};
