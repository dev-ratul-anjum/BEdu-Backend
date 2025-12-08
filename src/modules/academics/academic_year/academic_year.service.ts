import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_academic_year_schema,
  TUpdate_academic_year_schema,
} from "./academic_year.schema.js";

const create_academic_year = async (data: TCreate_academic_year_schema) => {
  const new_academic_year = await db.academicYear.create({
    data: data,
  });
  return new_academic_year;
};

const all_academic_years_list = async () => {
  const all_academic_years = await db.academicYear.findMany();
  return all_academic_years;
};

const update_academic_year = async (
  academic_year_id: string,
  data: TUpdate_academic_year_schema
) => {
  const academic_year = await db.academicYear.findUnique({
    where: { id: academic_year_id },
  });
  if (!academic_year) {
    throw new Api_error("Requested academic year does not exist", 404);
  }

  const updated_academic_year = await db.academicYear.update({
    where: { id: academic_year_id },
    data: data,
  });
  return updated_academic_year;
};

const delete_academic_year = async (academic_year_id: string) => {
  const academic_year = await db.academicYear.findUnique({
    where: { id: academic_year_id },
  });
  if (!academic_year) {
    throw new Api_error("Requested academic year does not exist", 404);
  }

  const deleted_academic_year = await db.academicYear.delete({
    where: { id: academic_year_id },
  });
  return deleted_academic_year;
};

export const academic_year_service = {
  create_academic_year,
  all_academic_years_list,
  update_academic_year,
  delete_academic_year,
};
