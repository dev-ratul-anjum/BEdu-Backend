import { ApiError } from "$/middleware/error.ts";
import { RequestHandler } from "express";

/**
 * Middleware to check if the logged-in user's role is allowed
 * @param allowedRoles - string or array of allowed roles
 */
export const authorizeRoles = (
  allowedRoles: string | string[]
): RequestHandler => {
  return (req, res, next) => {
    const userRole = req.user?.role; // assuming req.user is set by auth middleware (e.g., JWT)

    if (!userRole) {
      throw new ApiError("Unauthorized: No role found", 401);
    }

    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!allowed.includes(userRole)) {
      throw new ApiError("Forbidden: Role not allowed", 403);
    }

    next();
  };
};
