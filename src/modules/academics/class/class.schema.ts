import { z } from "zod";

export const create_class_schema = z.object({
  name: z
    .string()
    .regex(/^Class\s\d+$/, {
      message:
        "Name must follow the format 'Class <number>' (e.g. Class 6, Class 10)",
    })
    .min(6, { message: "Name must be at least 6 characters long" }),

  academic_year_id: z
    .string()
    .min(1, { message: "Academic year ID cannot be empty" }),

  class_teacher_id: z
    .string()
    .min(1, { message: "Class teacher ID cannot be empty" })
    .optional(),
});

export const update_class_schema = create_class_schema.partial();

export type TCreate_class_schema = z.infer<typeof create_class_schema>;
export type TUpdate_class_schema = z.infer<typeof update_class_schema>;
