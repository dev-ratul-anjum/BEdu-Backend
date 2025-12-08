import { z } from "zod";

export const create_academic_year_schema = z
  .object({
    session: z.string().regex(/^\d{4}-\d{4}$/, {
      message: "Session must follow the format YYYY-YYYY (e.g. 2024-2025)",
    }),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    is_current: z.boolean().default(false),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: "Start date must be earlier than end date",
    path: ["end_date"],
  });

export const update_academic_year_schema = create_academic_year_schema
  .partial()
  .refine(
    (data) =>
      data.start_date && data.end_date ? data.start_date < data.end_date : true,
    {
      message: "Start date must be earlier than end date",
      path: ["end_date"],
    }
  );

export type TCreate_academic_year_schema = z.infer<
  typeof create_academic_year_schema
>;
export type TUpdate_academic_year_schema = z.infer<
  typeof update_academic_year_schema
>;
