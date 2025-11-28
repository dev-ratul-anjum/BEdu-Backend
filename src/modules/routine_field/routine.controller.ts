import { validate_data } from "$/lib/validate_data.ts";
import api_response from "$/middleware/api_response.ts";
import { RequestHandler } from "express";
import {
  create_routine_schema,
  getBy_class_academic_year_schema,
  getBy_teacher_academic_year,
  list_routines_query_schema,
  update_routine_schema,
} from "./routine.schema.ts";
import routine_service from "./routine.service.ts";

const routine_controller = {
  create: async (req, res, next) => {
    try {
      const data = validate_data(create_routine_schema, req.body);
      const routine = await routine_service.create(data);
      return api_response(res, 201, {
        success: true,
        message: "Routine created successfully",
        data: routine,
      });
    } catch (error) {
      next(error);
    }
  },

  list: async (req, res, next) => {
    try {
      const query = validate_data(list_routines_query_schema, req.query);
      const result = await routine_service.list(query);
      return api_response(res, 200, {
        success: true,
        message: "Routines fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = req.params.id;
      const data = validate_data(update_routine_schema, req.body);
      const routine = await routine_service.update(id, data);
      return api_response(res, 200, {
        success: true,
        message: "Routine updated successfully",
        data: routine,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await routine_service.delete(id);
      return api_response(res, 200, {
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  getBy_class_academic_year: async (req, res, next) => {
    try {
      const { class_id, academic_year_id } = validate_data(
        getBy_class_academic_year_schema,
        req.query as any
      );

      const routines = await routine_service.get_class_academic_year(
        class_id,
        academic_year_id
      );

      return api_response(res, 200, {
        success: true,
        message: "Routines fetched successfully",
        data: routines,
      });
    } catch (error) {
      next(error);
    }
  },

  getBy_teacher_academic_year: async (req, res, next) => {
    try {
      const { teacher_id, academic_year_id } = validate_data(
        getBy_teacher_academic_year,
        req.query as any
      );

      if (!teacher_id || !academic_year_id) {
        return api_response(res, 400, {
          success: false,
          message: "teacher_id and academic_year_id are required",
        });
      }

      const routines = await routine_service.getBy_teacher_academic_year(
        teacher_id,
        academic_year_id
      );

      return api_response(res, 200, {
        success: true,
        message: "Routines fetched successfully",
        data: routines,
      });
    } catch (error) {
      next(error);
    }
  },
} satisfies Record<string, RequestHandler>;

export default routine_controller;
