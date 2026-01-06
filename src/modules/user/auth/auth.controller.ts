import api_response from "$/middleware/api_response.js";
import { NextFunction, Request, Response } from "express";

import auth_service from "./auth.service.js";
import catch_async from "$/utils/catch_async.js";
import {
  clear_auth_cookie,
  create_jwt_token,
  set_auth_cookie,
} from "$/utils/auth_helpers.js";

// Login User
const login_user = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.validatedBody;

    const user = await auth_service.login_user(data);

    const token = create_jwt_token(user.id);
    set_auth_cookie(res, token);

    return api_response(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: {
        username: user.username,
        role: user.role,
      },
    });
  }
);

// Login Guardian
const login_guardian = catch_async(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.validatedBody;

    const guardian = await auth_service.login_guardian(data);

    const token = create_jwt_token(guardian.id);
    set_auth_cookie(res, token);

    return api_response(res, 200, {
      success: true,
      message: "Guardian logged in successfully",
      data: {
        name: guardian.name,
        phone: guardian.phone,
      },
    });
  }
);

// Get Current User
// const get_current_user = catch_async(
//   async (req: Request, res: Response, next: NextFunction) => {

//     const user = await auth_service.get_current_user(
//       req.user!.id,
//       req.user!.role
//     );
//     return api_response(res, 200, {
//       success: true,
//       message: "User retrieved successfully",
//       data: user,
//     });
//   }
// );

// Logout User
const logout_user = (req: Request, res: Response) => {
  clear_auth_cookie(res);
  return api_response(res, 200, {
    success: true,
    message: "Logout successfully",
    data: req.user,
  });
};

const auth_controller = {
  login_user,
  login_guardian,
  logout_user,
  // get_current_user,
};

export default auth_controller;
