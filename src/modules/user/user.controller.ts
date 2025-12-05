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

const update_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    return api_response(res, 200, {
      success: true,
      message: "User deleted successfully!",
    });
  }
);

const update_user_role = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    return api_response(res, 200, {
      success: true,
      message: "User deleted successfully!",
    });
  }
);

// Delete User
const delete_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.body;
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
const get_current_user = (req: Request, res: Response) => {
  return api_response(res, 200, {
    success: true,
    message: "User retrieved successfully",
    data: req.user,
  });
};

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
  update_user_role,
  delete_user,
  login_user,
  get_current_user,
  logout_user,
};

export default user_controller;
