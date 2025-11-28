import { validate_data } from "$/lib/validate_data.ts";
import api_response from "$/middleware/api_response.ts";
import { create_jwt_token, set_auth_cookie } from "$/utils/auth_helpers.ts";
import { RequestHandler } from "express";
import { create_user_schema, login_user_schema } from "./user.schema.ts";
import user_service from "./user.service.ts";

const user_controller = {
  register: async (req, res, next) => {
    try {
      const data = validate_data(create_user_schema, req.body);

      const new_user = await user_service.register(data);

      return api_response(res, 200, {
        success: true,
        message: "User created successfully",
        data: new_user,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const data = validate_data(login_user_schema, req.body);

      const { user } = await user_service.login(data);

      const token = create_jwt_token(user.id);
      set_auth_cookie(res, token);

      return api_response(res, 200, {
        success: true,
        message: "User logged in successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res) => {},

  delete: async (req, res) => {},
} satisfies Record<string, RequestHandler>;

export default user_controller;
