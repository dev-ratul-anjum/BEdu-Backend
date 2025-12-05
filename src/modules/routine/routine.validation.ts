// import { db } from "$/db/index.js";
// import { Api_error } from "$/middleware/error.js";
// import type {
//   TCreate_soutine_schema,
//   TUpdate_routine_schema,
// } from "./routine.schema.js";

// type TRoutine_input = Partial<
//   TCreate_soutine_schema & TUpdate_routine_schema
// > & {
//   id?: string;
// };

// const to_date = (value?: string | Date): Date | undefined =>
//   value ? (value instanceof Date ? value : new Date(value)) : undefined;

// const validate_time_order = (start?: string | Date, end?: string | Date) => {
//   const s = to_date(start);
//   const e = to_date(end);
//   if (!s || !e) {
//     throw new Api_error("Both start_time and end_time must be provided", 400);
//   }
//   if (s >= e) {
//     throw new Api_error("start_time must be earlier than end_time", 400);
//   }
// };

// const routine_validation = {
//   to_date: to_date,
//   validate_time_order: validate_time_order,

//   check_all_availability: async (data: TRoutine_input, require_all = true) => {
//     // If requireAll, ensure fields are provided
//     const { academic_year_id, class_id, section_id, teacher_id, subject_id } =
//       data;

//     // Build list of queries for provided IDs (or for all if requireAll)
//     const queries: Array<Promise<any>> = [];

//     if (require_all && !academic_year_id)
//       throw new Api_error("academic_year_id is required", 400);
//     if (require_all && !class_id)
//       throw new Api_error("class_id is required", 400);
//     if (require_all && !section_id)
//       throw new Api_error("section_id is required", 400);
//     if (require_all && !teacher_id)
//       throw new Api_error("teacher_id is required", 400);
//     if (require_all && !subject_id)
//       throw new Api_error("subject_id is required", 400);

//     if (academic_year_id)
//       queries.push(
//         db.academicYear.findUnique({ where: { id: academic_year_id } })
//       );
//     if (class_id)
//       queries.push(db.class.findUnique({ where: { id: class_id } }));
//     if (section_id)
//       queries.push(db.section.findUnique({ where: { id: section_id } }));
//     if (teacher_id)
//       queries.push(db.teacher.findUnique({ where: { id: teacher_id } }));
//     if (subject_id)
//       queries.push(db.subject.findUnique({ where: { id: subject_id } }));

//     if (queries.length === 0) return true;

//     const resuljs = await Promise.all(queries);

//     // Map back: simpler to check existence by presence of each provided id
//     let idx = 0;
//     if (academic_year_id) {
//       if (!resuljs[idx++]) throw new Api_error("Academic year not found", 404);
//     }
//     if (class_id) {
//       if (!resuljs[idx++]) throw new Api_error("Class not found", 404);
//     }
//     if (section_id) {
//       if (!resuljs[idx++]) throw new Api_error("Section not found", 404);
//     }
//     if (teacher_id) {
//       if (!resuljs[idx++]) throw new Api_error("Teacher not found", 404);
//     }
//     if (subject_id) {
//       if (!resuljs[idx++]) throw new Api_error("Subject not found", 404);
//     }

//     return true;
//   },

//   check_teacher_availability: async (data: TRoutine_input) => {
//     const { day, teacher_id, id } = data;
//     const start_time = to_date(data.start_time);
//     const end_time = to_date(data.end_time);

//     if (!day)
//       throw new Api_error("Day is required to check teacher availability", 400);
//     if (!teacher_id)
//       throw new Api_error(
//         "Teacher is required to check teacher availability",
//         400
//       );
//     if (!start_time || !end_time)
//       throw new Api_error(
//         "start_time and end_time are required to check teacher availability",
//         400
//       );

//     // time ordering validated earlier by caller (or we can validate here again)
//     if (start_time >= end_time)
//       throw new Api_error("start_time must be earlier than end_time", 400);

//     const where: any = {
//       day,
//       teacher_id,
//       start_time: { lte: end_time },
//       end_time: { gte: start_time },
//     };

//     if (id) {
//       where.id = { not: id };
//     }

//     const existing = await db.routine.findFirst({ where });

//     if (existing) {
//       throw new Api_error("Teacher is not available in this time slot", 409);
//     }

//     return true;
//   },

//   validate_for_create: async (data: TCreate_soutine_schema) => {
//     await routine_validation.check_all_availability(data, true);
//     validate_time_order(data.start_time, data.end_time);
//     await routine_validation.check_teacher_availability(data);
//     return true;
//   },

//   validate_for_update: async (mergedData: TRoutine_input) => {
//     await routine_validation.check_all_availability(mergedData, true);
//     validate_time_order(mergedData.start_time, mergedData.end_time);
//     await routine_validation.check_teacher_availability(mergedData);
//     return true;
//   },
// };

// export default routine_validation;
