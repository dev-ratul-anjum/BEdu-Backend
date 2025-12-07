import { UserRole } from "$/db/generated/enums.js";
import { z } from "zod";

export const create_notice_schema = z.object({
  title: z.string().min(1, "Title is required"),
  // content: z
  //   .array(z.string())
  //   .nonempty("Content must contain at least 1 file link"),
  target_roles: z
    .array(z.custom<UserRole>())
    .nonempty("At least one role is required"),
  is_archived: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

export type TCreate_notice_schema = z.infer<typeof create_notice_schema>;
