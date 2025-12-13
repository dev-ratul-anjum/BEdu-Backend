import { z } from "zod";

export const create_biometric_device_schema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" }),

  is_active: z.boolean().default(true),
});

export const update_biometric_device_schema =
  create_biometric_device_schema.partial();

export type TCreate_biometric_device_schema = z.infer<
  typeof create_biometric_device_schema
>;
export type TUpdate_biometric_device_schema = z.infer<
  typeof update_biometric_device_schema
>;
