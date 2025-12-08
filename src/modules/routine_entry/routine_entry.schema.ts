import { z } from "zod";

export const create_routine_entry_schema = z.object({
  day: z.enum(
    [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ],
    {
      message:
        "Role must be one of: SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY",
    }
  ),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  academic_year_id: z
    .string()
    .min(1, { message: "Academic year ID cannot be empty" }),
  section_id: z.string().min(1, { message: "Section ID cannot be empty" }),
  class_id: z.string().min(1, { message: "Class ID cannot be empty" }),
  teacher_id: z.string().min(1, { message: "Teacher ID cannot be empty" }),
  subject_id: z.string().min(1, { message: "Subject ID cannot be empty" }),
});

export const update_routine_entry_schema =
  create_routine_entry_schema.partial();

export type TCreate_routine_entry_schema = z.infer<
  typeof create_routine_entry_schema
>;
export type TUpdate_routine_entry_schema = z.infer<
  typeof update_routine_entry_schema
>;
