import api_response from "$/middleware/api_response.js";
import { NextFunction, Request, Response } from "express";

import user_service from "./student.service.js";
import catch_async from "$/utils/catch_async.js";
import student_service from "./student.service.js";

// Create Student
const create_student = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.validatedBody;

    const new_user = await student_service.create_student(data);

    return api_response(res, 200, {
      success: true,
      message: "Student created successfully",
      data: new_user,
    });
  }
);

// Update User Info
const update_student = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    return api_response(res, 200, {
      success: true,
      message: "User updated successfully!",
    });
  }
);

// Update User Info By Admin
// const update_student_by_admin = catch_async(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user_id = req.params.user_id;
//     const update_user = await user_service.update_user_by_admin(
//       user_id,
//       req.validatedBody
//     );
//     return api_response(res, 200, {
//       success: true,
//       message: "User updated successfully!",
//       data: update_user,
//     });
//   }
// );

const all_students_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_students = await user_service.all_students_list();

    return api_response(res, 200, {
      success: true,
      message: "Student List retrive successfully.",
      data: all_students,
    });
  }
);

// Delete User
const delete_student = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;
    const deleted_user = await user_service.delete_student(user_id);

    return api_response(res, 200, {
      success: true,
      message: "User deleted successfully!",
      data: deleted_user,
    });
  }
);

const student_controller = {
  create_student,
  update_student,
  // update_student_by_admin,
  all_students_list,
  delete_student,
};

export default student_controller;
