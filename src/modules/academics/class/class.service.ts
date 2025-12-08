import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import { TCreate_class_schema, TUpdate_class_schema } from "./class.schema.js";

const create_class = async (data: TCreate_class_schema) => {
  const new_class = await db.class.create({
    data: data,
  });
  return new_class;
};

const all_class_list = async () => {
  const all_class = await db.class.findMany();
  return all_class;
};

const update_class = async (class_id: string, data: TUpdate_class_schema) => {
  const exist_class = await db.class.findUnique({
    where: { id: class_id },
  });
  if (!exist_class) {
    throw new Api_error("Requested class does not exist", 404);
  }

  const updated_class = await db.class.update({
    where: { id: class_id },
    data: data,
  });
  return updated_class;
};

const delete_class = async (class_id: string) => {
  const exist_class = await db.class.findUnique({
    where: { id: class_id },
  });
  if (!exist_class) {
    throw new Api_error("Requested class does not exist", 404);
  }

  const deleted_class = await db.class.delete({
    where: { id: class_id },
  });
  return deleted_class;
};

export const class_service = {
  create_class,
  all_class_list,
  update_class,
  delete_class,
};
