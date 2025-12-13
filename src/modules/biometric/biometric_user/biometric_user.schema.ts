import { z } from "zod";

export const create_biometric_user_schema = z.object({
  id: z.string().min(1, { message: "Id can not be empty" }),

  user_id: z.string().min(1, { message: "User id can not be empty" }),
});

export const update_biometric_user_schema = z.object({
  cumulative_count: z
    .number()
    .min(0, { message: "Cumulative count can not be negative" }),
});

export type TCreate_biometric_user_schema = z.infer<
  typeof create_biometric_user_schema
>;
export type TUpdate_biometric_user_schema = z.infer<
  typeof update_biometric_user_schema
>;
