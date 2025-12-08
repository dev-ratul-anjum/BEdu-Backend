import { z } from "zod";

export const create_subject_schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),
  code: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" })
    .optional(),
  class_id: z.string().min(1, { message: "Class ID cannot be empty" }),
});

export const update_subject_schema = create_subject_schema.partial();

export type TCreate_subject_schema = z.infer<typeof create_subject_schema>;
export type TUpdate_subject_schema = z.infer<typeof update_subject_schema>;
