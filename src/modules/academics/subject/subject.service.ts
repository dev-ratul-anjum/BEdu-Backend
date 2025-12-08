import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_subject_schema,
  TUpdate_subject_schema,
} from "./subject.schema.js";

const create_subject = async (data: TCreate_subject_schema) => {
  const new_subject = await db.subject.create({
    data: data,
  });
  return new_subject;
};

const all_subject_list = async () => {
  const all_subject = await db.subject.findMany();
  return all_subject;
};

const update_subject = async (
  subject_id: string,
  data: TUpdate_subject_schema
) => {
  const exist_subject = await db.subject.findUnique({
    where: { id: subject_id },
  });
  if (!exist_subject) {
    throw new Api_error("Requested subject does not exist", 404);
  }

  const updated_subject = await db.subject.update({
    where: { id: subject_id },
    data: data,
  });
  return updated_subject;
};

const delete_subject = async (subject_id: string) => {
  const exist_subject = await db.subject.findUnique({
    where: { id: subject_id },
  });
  if (!exist_subject) {
    throw new Api_error("Requested subject does not exist", 404);
  }

  const deleted_subject = await db.subject.delete({
    where: { id: subject_id },
  });
  return deleted_subject;
};

export const subject_service = {
  create_subject,
  all_subject_list,
  update_subject,
  delete_subject,
};
