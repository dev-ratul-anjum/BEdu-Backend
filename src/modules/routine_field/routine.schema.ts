import { DayOfWeek } from "$/db/generated/enums.ts";
import { z } from "zod";

// -------------------------------
// CREATE ROUTINE SCHEMA
// -------------------------------
export const create_routine_schema = z.object({
  day: z.custom<DayOfWeek>(),

  // ISO datetime strings
  start_time: z.date(),
  end_time: z.date(),

  // Foreign keys
  academic_year_id: z.uuid(),
  class_id: z.uuid().nullable(),
  section_id: z.uuid(),
  teacher_id: z.uuid(),
  subject_id: z.uuid(), // FIXED: single UUID (NOT array)
});

export type TCreate_soutine_schema = z.infer<typeof create_routine_schema>;

// -------------------------------
// UPDATE ROUTINE SCHEMA
// (Same as create but all fields OPTIONAL)
// -------------------------------
export const update_routine_schema = create_routine_schema.partial();
export type TUpdate_routine_schema = z.infer<typeof update_routine_schema>;

// -------------------------------
// RESPONSE SCHEMA
// -------------------------------
export const routine_response_schema = z.object({
  id: z.uuid(),
  day: z.custom<DayOfWeek>(),

  // ISO datetime strings
  start_time: z.date(),
  end_time: z.date(),

  // Foreign keys
  academic_year_id: z.uuid(),
  class_id: z.uuid(),
  section_id: z.uuid(),
  teacher_id: z.uuid(),

  // FIXED: one subject, not array
  subject: z.object({
    id: z.uuid(),
    name: z.string().optional(),
    code: z.string().optional(),
  }),
});

export type TRoutine_response_schema = z.infer<typeof routine_response_schema>;

// -------------------------------
// QUERY (LIST ROUTINES)
// -------------------------------
export const list_routines_query_schema = z.object({
  academic_year_id: z.uuid().optional(),
  class_id: z.uuid().optional(),
  section_id: z.uuid().optional(),
  teacher_id: z.uuid().optional(),
  day: z.custom<DayOfWeek>().optional(),

  // Pagination
  limit: z.number().int().positive().default(20).optional(),
  offset: z.number().int().nonnegative().default(0).optional(),
});

export const getBy_class_academic_year_schema = routine_response_schema.pick({
  academic_year_id: true,
  class_id: true,
});

export const getBy_teacher_academic_year = routine_response_schema.pick({
  academic_year_id: true,
  teacher_id: true,
});

export type TList_routines_query_schema = z.infer<
  typeof list_routines_query_schema
>;
