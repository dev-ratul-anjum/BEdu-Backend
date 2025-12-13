import { z } from "zod";

export const create_attendance_raw_schema = z.object({
  device_id: z.string().min(1, { message: "Device id can not be empty" }),
  device_user_id: z
    .string()
    .min(1, { message: "Device user id can not be empty" }),

  timestamp: z.coerce.date(),
  verify_type: z.enum(["FACE", "FINGER"], {
    message: "Verify type must be one of: FACE, FINGER",
  }),
});

export const update_attendance_raw_schema =
  create_attendance_raw_schema.partial();

export const create_attendance_daily_schema = z.object({
  user_id: z.string().min(1, { message: "User id can not be empty" }),

  date: z.coerce.date(),
  morning_status: z.enum(["PRESENT", "LATE", "ABSENT"], {
    message: "Morning status must be one of: PRESENT, LATE, ABSENT",
  }),

  noon_status: z.enum(["PRESENT", "LATE", "ABSENT"], {
    message: "Noon status must be one of: PRESENT, LATE, ABSENT",
  }),

  final_status: z.enum(["PRESENT", "ABSENT"], {
    message: "Final status must be one of: PRESENT, ABSENT",
  }),
});
export const update_attendance_daily_schema =
  create_attendance_daily_schema.partial();

export type TCreate_attendance_raw_schema = z.infer<
  typeof create_attendance_raw_schema
>;
export type TUpdate_attendance_raw_schema = z.infer<
  typeof update_attendance_raw_schema
>;

export type TCreate_attendance_daily_schema = z.infer<
  typeof create_attendance_daily_schema
>;
export type TUpdate_attendance_daily_schema = z.infer<
  typeof update_attendance_daily_schema
>;
