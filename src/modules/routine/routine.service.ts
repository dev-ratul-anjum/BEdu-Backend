// import { db } from "$/db/index.js";
// import { Api_error } from "$/middleware/error.js";
// import {
//   TCreate_soutine_schema,
//   TList_routines_query_schema,
//   TUpdate_routine_schema,
// } from "./routine.schema.js";
// import routine_validation from "./routine.validation.js";

// const routine_service = {
//   create: async (data: TCreate_soutine_schema) => {
//     await routine_validation.validate_for_create(data);

//     const create_payload = {
//       ...data,
//       start_time: routine_validation.to_date(data.start_time)!,
//       end_time: routine_validation.to_date(data.end_time)!,
//     };

//     const routine = await db.routine.create({
//       data: {
//         day: data.day,
//         start_time: new Date(data.start_time),
//         end_time: new Date(data.end_time),
//         academic_year_id: data.academic_year_id,
//         class_id: data.class_id,
//         section_id: data.section_id,
//         teacher_id: data.teacher_id,
//         subject_id: data.subject_id,
//       },
//       include: {
//         subject: {
//           select: { id: true, name: true, code: true },
//         },
//       },
//     });

//     return routine;
//   },

//   list: async (query: TList_routines_query_schema) => {
//     const where: any = {};

//     if (query.academic_year_id) where.academic_year_id = query.academic_year_id;
//     if (query.class_id) where.class_id = query.class_id;
//     if (query.section_id) where.section_id = query.section_id;
//     if (query.day) where.day = query.day;

//     const [routines, total] = await Promise.all([
//       db.routine.findMany({
//         where,
//         include: {
//           subject: {
//             select: { id: true, name: true, code: true },
//           },
//         },
//         take: query.limit,
//         skip: query.offset,
//         orderBy: { start_time: "asc" },
//       }),
//       db.routine.count({ where }),
//     ]);

//     return {
//       data: routines,
//       total,
//       limit: query.limit,
//       offset: query.offset,
//     };
//   },

//   update: async (id: string, data: TUpdate_routine_schema) => {
//     const existing_routine = await db.routine.findUnique({ where: { id } });
//     if (!existing_routine) throw new Api_error("Routine not found", 404);

//     const merged = {
//       id,
//       day: data.day ?? existing_routine.day,
//       start_time:
//         data.start_time !== undefined
//           ? routine_validation.to_date(data.start_time)
//           : existing_routine.start_time
//           ? existing_routine.start_time
//           : undefined,
//       end_time:
//         data.end_time !== undefined
//           ? routine_validation.to_date(data.end_time)
//           : existing_routine.end_time
//           ? existing_routine.end_time
//           : undefined,
//       academic_year_id:
//         data.academic_year_id ?? existing_routine.academic_year_id,
//       class_id: data.class_id ?? existing_routine.class_id,
//       section_id: data.section_id ?? existing_routine.section_id,
//       teacher_id: data.teacher_id ?? existing_routine.teacher_id,
//       subject_id: data.subject_id ?? existing_routine.subject_id,
//     };

//     await routine_validation.validate_for_update(merged);

//     const update_data = {
//       ...(data.day !== undefined && { day: data.day }),
//       ...(data.start_time !== undefined && {
//         start_time: new Date(data.start_time),
//       }),
//       ...(data.end_time !== undefined && { end_time: new Date(data.end_time) }),
//       ...(data.academic_year_id !== undefined && {
//         academic_year_id: data.academic_year_id,
//       }),
//       ...(data.class_id !== undefined && { class_id: data.class_id }),
//       ...(data.section_id !== undefined && { section_id: data.section_id }),
//       ...(data.teacher_id !== undefined && { teacher_id: data.teacher_id }),
//       ...(data.subject_id !== undefined && { subject_id: data.subject_id }),
//     };

//     const updated_routine = await db.routine.update({
//       where: { id },
//       data: update_data,
//       include: {
//         subject: {
//           select: { id: true, name: true, code: true },
//         },
//       },
//     });

//     return updated_routine;
//   },

//   delete: async (id: string) => {
//     const routine = await db.routine.findUnique({ where: { id } });
//     if (!routine) throw new Api_error("Routine not found", 404);

//     await db.routine.delete({ where: { id } });
//     return { message: "Routine deleted successfully" };
//   },

//   /**
//    * Get routines by class + academic year
//    */
//   get_class_academic_year: async (
//     class_id: string,
//     academic_year_id: string
//   ) => {
//     return await db.routine.findMany({
//       where: { class_id, academic_year_id },
//       include: {
//         subject: { select: { id: true, name: true, code: true } },
//         teacher: {
//           select: {
//             id: true,
//             user: { select: { id: true } },
//           },
//         },
//       },
//       orderBy: { start_time: "asc" },
//     });
//   },

//   /**
//    * Get routines by teacher + academic year
//    */
//   getBy_teacher_academic_year: async (
//     teacher_id: string,
//     academic_year_id: string
//   ) => {
//     return await db.routine.findMany({
//       where: { teacher_id, academic_year_id },
//       include: {
//         subject: { select: { id: true, name: true, code: true } },
//         class: { select: { id: true, name: true } },
//         section: { select: { id: true, name: true } },
//       },
//       orderBy: { start_time: "asc" },
//     });
//   },
// };

// export default routine_service;
