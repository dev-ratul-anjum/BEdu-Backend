import api_response from "$/middleware/api_response.js";
import {
  clear_auth_cookie,
  create_jwt_token,
  set_auth_cookie,
} from "$/utils/auth_helpers.js";
import { NextFunction, Request, Response } from "express";

import user_service from "./user.service.js";
import catch_async from "$/utils/catch_async.js";

// Create User
const create_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.validatedBody;

    const new_user = await user_service.create_user(data);

    const token = create_jwt_token(new_user.id);
    set_auth_cookie(res, token);

    return api_response(res, 200, {
      success: true,
      message: "User created successfully",
      data: new_user,
    });
  }
);

// Update User Info
const update_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    return api_response(res, 200, {
      success: true,
      message: "User updated successfully!",
    });
  }
);

// Update User Info By Admin
const update_user_by_admin = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;
    const update_user = await user_service.update_user_by_admin(
      user_id,
      req.validatedBody
    );
    return api_response(res, 200, {
      success: true,
      message: "User updated successfully!",
      data: update_user,
    });
  }
);

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
const all_teachers_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_teachers = await user_service.all_teachers_list();

    return api_response(res, 200, {
      success: true,
      message: "Teacher List retrive successfully.",
      data: all_teachers,
    });
  }
);
const all_parents_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_parents = await user_service.all_parents_list();

    return api_response(res, 200, {
      success: true,
      message: "Parent List retrive successfully.",
      data: all_parents,
    });
  }
);
const all_admins_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_admins = await user_service.all_admins_list();

    return api_response(res, 200, {
      success: true,
      message: "Admin List retrive successfully.",
      data: all_admins,
    });
  }
);
const all_super_admins_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_super_admins = await user_service.all_super_admins_list();

    return api_response(res, 200, {
      success: true,
      message: "Super admin List retrive successfully.",
      data: all_super_admins,
    });
  }
);

const all_users_list = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const all_users = await user_service.all_users_list(req.query);

    return api_response(res, 200, {
      success: true,
      message: "User List retrive successfully.",
      data: all_users,
    });
  }
);

// Delete User
const delete_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const user_id = req.params.user_id;
    const deleted_user = await user_service.delete_user(user_id);

    return api_response(res, 200, {
      success: true,
      message: "User deleted successfully!",
      data: deleted_user,
    });
  }
);

// Login User
const login_user = catch_async(async (req, res, next) => {
  const data = req.validatedBody;

  const user = await user_service.login_user(data);

  const token = create_jwt_token(user.id);
  set_auth_cookie(res, token);

  return api_response(res, 200, {
    success: true,
    message: "User logged in successfully",
    data: {
      phone: user.username,
      role: user.role,
    },
  });
});

// Get Current User
const get_current_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("c");
    const user = await user_service.get_current_user(
      req.user!.id,
      req.user!.role
    );
    return api_response(res, 200, {
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  }
);

// Logout User
const logout_user = (req: Request, res: Response) => {
  clear_auth_cookie(res);
  return api_response(res, 200, {
    success: true,
    message: "User logout successfully",
    data: req.user,
  });
};

const user_controller = {
  create_user,
  update_user,
  update_user_by_admin,
  all_users_list,
  all_students_list,
  all_teachers_list,
  all_parents_list,
  all_admins_list,
  all_super_admins_list,
  delete_user,
  login_user,
  get_current_user,
  logout_user,
};

export default user_controller;
