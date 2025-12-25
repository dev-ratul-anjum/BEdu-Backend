import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_section_schema,
  TUpdate_section_schema,
} from "./section.schema.js";

const create_section = async (data: TCreate_section_schema) => {
  const new_section = await db.section.create({
    data: data,
  });
  return new_section;
};

const all_section_list = async (query: { class_id?: string }) => {
  const { class_id } = query;
  const section_where: any = {};
  if (class_id) section_where.class_id = class_id;

  const all_section = await db.section.findMany({
    where: {
      ...section_where,
    },
  });
  return all_section;
};

const update_section = async (
  section_id: string,
  data: TUpdate_section_schema
) => {
  const exist_section = await db.section.findUnique({
    where: { id: section_id },
  });
  if (!exist_section) {
    throw new Api_error("Requested section does not exist", 404);
  }

  const updated_section = await db.section.update({
    where: { id: section_id },
    data: data,
  });
  return updated_section;
};

const delete_section = async (section_id: string) => {
  const exist_section = await db.section.findUnique({
    where: { id: section_id },
  });
  if (!exist_section) {
    throw new Api_error("Requested section does not exist", 404);
  }

  const deleted_section = await db.section.delete({
    where: { id: section_id },
  });
  return deleted_section;
};

export const section_service = {
  create_section,
  all_section_list,
  update_section,
  delete_section,
};
