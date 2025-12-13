import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_biometric_user_schema,
  TUpdate_biometric_user_schema,
} from "./biometric_user.schema.js";

const create_biometric_user = async (data: TCreate_biometric_user_schema) => {
  const new_biometric_user = await db.biometricUser.create({
    data: data,
  });
  return new_biometric_user;
};

const all_biometric_user_list = async () => {
  const all_biometric_user = await db.biometricUser.findMany();
  return all_biometric_user;
};

const update_biometric_user = async (
  biometric_user_id: string,
  data: TUpdate_biometric_user_schema
) => {
  const exist_biometric_user = await db.biometricUser.findUnique({
    where: { id: biometric_user_id },
  });
  if (!exist_biometric_user) {
    throw new Api_error("Requested biometric user does not exist", 404);
  }

  const updated_biometric_user = await db.biometricUser.update({
    where: { id: biometric_user_id },
    data: data,
  });
  return updated_biometric_user;
};

const delete_biometric_user = async (biometric_user_id: string) => {
  const exist_biometric_user = await db.biometricUser.findUnique({
    where: { id: biometric_user_id },
  });
  if (!exist_biometric_user) {
    throw new Api_error("Requested biometric user does not exist", 404);
  }

  const deleted_biometric_user = await db.biometricUser.delete({
    where: { id: biometric_user_id },
  });
  return deleted_biometric_user;
};

export const biometric_user_service = {
  create_biometric_user,
  all_biometric_user_list,
  update_biometric_user,
  delete_biometric_user,
};
