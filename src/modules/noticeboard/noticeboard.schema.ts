import { Role } from "$/db/generated/enums.ts";
import { z } from "zod";

const RoleArray = Object.values(Role) as Role[]; // TypeScript type = Role[]

export const RoleEnum = z.enum(RoleArray as [Role, ...Role[]]);

export const create_noticeboard_schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z
    .array(z.string())
    .nonempty("Content must contain at least 1 file link"),
  target_roles: z.array(RoleEnum).nonempty("At least one role is required"),
  is_archived: z.boolean().default(false),
});

export type TCreate_noticeboard_schema = z.infer<
  typeof create_noticeboard_schema
>;
