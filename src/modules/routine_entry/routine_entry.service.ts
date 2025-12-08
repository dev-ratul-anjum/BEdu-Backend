import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_routine_entry_schema,
  TUpdate_routine_entry_schema,
} from "./routine_entry.schema.js";

const create_routine_entry = async (data: TCreate_routine_entry_schema) => {
  const new_routine_entry = await db.routineEntry.create({
    data: data,
  });
  return new_routine_entry;
};

const all_routine_entry_list = async () => {
  const all_routine_entry = await db.routineEntry.findMany();
  return all_routine_entry;
};

const update_routine_entry = async (
  routine_entry_id: string,
  data: TUpdate_routine_entry_schema
) => {
  const exist_routine_entry = await db.routineEntry.findUnique({
    where: { id: routine_entry_id },
  });
  if (!exist_routine_entry) {
    throw new Api_error("Requested routine entry does not exist", 404);
  }

  const updated_routine_entry = await db.routineEntry.update({
    where: { id: routine_entry_id },
    data: data,
  });
  return updated_routine_entry;
};

const delete_routine_entry = async (routine_entry_id: string) => {
  const exist_routine_entry = await db.routineEntry.findUnique({
    where: { id: routine_entry_id },
  });
  if (!exist_routine_entry) {
    throw new Api_error("Requested routine entry does not exist", 404);
  }

  const deleted_routine_entry = await db.routineEntry.delete({
    where: { id: routine_entry_id },
  });
  return deleted_routine_entry;
};

export const routine_entry_service = {
  create_routine_entry,
  all_routine_entry_list,
  update_routine_entry,
  delete_routine_entry,
};
