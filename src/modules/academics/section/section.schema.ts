import { z } from "zod";

export const create_section_schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),

  class_id: z.string().min(1, { message: "Class ID cannot be empty" }),
});

export const update_section_schema = create_section_schema.partial();

export type TCreate_section_schema = z.infer<typeof create_section_schema>;
export type TUpdate_section_schema = z.infer<typeof update_section_schema>;
