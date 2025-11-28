import { Role } from "$/db/generated/enums.ts";
import { Api_error } from "$/middleware/error.ts";
import { RequestHandler } from "express";

export const authorize_roles = (
  allowedRoles: Role | Role[]
): RequestHandler => {
  return (req, res, next) => {
    const user_role = req.user?.role;

    if (!user_role) {
      throw new Api_error("Unauthorized: No role found", 401);
    }

    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!allowed.includes(user_role)) {
      throw new Api_error("Forbidden: Role not allowed", 403);
    }

    next();
  };
};
