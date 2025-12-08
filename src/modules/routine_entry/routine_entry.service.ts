import { db } from "$/db/index.js";
import { Api_error } from "$/middleware/error_handler.js";
import {
  TCreate_routine_entry_schema,
  TUpdate_routine_entry_schema,
} from "./routine_entry.schema.js";

const create_routine_entry = async (data: TCreate_routine_entry_schema) => {
  const conflict = await db.routineEntry.findFirst({
    where: {
      teacher_id: data.teacher_id,
      day: data.day,
      AND: [
        { start_time: { lt: data.end_time } },
        { end_time: { gt: data.start_time } },
      ],
    },
  });
  if (conflict) {
    throw new Api_error(
      "This teacher is already assigned to another routine during the selected time on this day.",
      409
    );
  }
  const new_routine_entry = await db.routineEntry.create({
    data: data,
  });
  return new_routine_entry;
};

const get_section_routine_entries = async (section_id: string) => {
  const section_routine_entries = await db.section.findUnique({
    where: { id: section_id },
    include: {
      routine_entries: true,
    },
  });
  return section_routine_entries;
};

const get_teacher_routine_entries = async (teacher_id: string) => {
  const teacher_routine_entries = await db.teacher.findUnique({
    where: { id: teacher_id },
    include: { routine_entries: true },
  });
  return teacher_routine_entries;
};
const all_routine_entry_list = async () => {
  const all_routine_entry = await db.routineEntry.findMany();
  return all_routine_entry;
};

const update_routine_entry = async (
  routine_entry_id: string,
  data: TUpdate_routine_entry_schema
) => {
  const routine_entry = await db.routineEntry.findUnique({
    where: { id: routine_entry_id },
  });
  if (!routine_entry) {
    throw new Api_error("Requested routine entry does not exist", 404);
  }

  const startTime = data.start_time
    ? data.start_time
    : routine_entry.start_time;
  const endTime = data.end_time ? data.end_time : routine_entry.end_time;

  // Validate logical time order
  if (startTime >= endTime) {
    throw new Api_error("Start time must be earlier than end time.", 409);
  }

  // Resolve other optional fields
  const teacherId = data.teacher_id ?? routine_entry.teacher_id;
  const day = data.day ?? routine_entry.day;

  // Conflict check
  const conflict = await db.routineEntry.findFirst({
    where: {
      teacher_id: teacherId,
      day: day,
      id: { not: routine_entry_id },
      AND: [{ start_time: { lt: endTime } }, { end_time: { gt: startTime } }],
    },
  });

  if (conflict) {
    throw new Error(
      "This teacher is already assigned to another routine during the selected time on this day."
    );
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
  get_section_routine_entries,
  get_teacher_routine_entries,
  all_routine_entry_list,
  update_routine_entry,
  delete_routine_entry,
};
