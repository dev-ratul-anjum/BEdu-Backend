import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Api_error } from "./error.js";
import { db } from "../db/index.js";
import { UserRole } from "$/db/generated/enums.js";

const JWT_SECRET = process.env.JWT_SECRET;

const check_auth =
  (authorize_roles?: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.signedCookies[process.env.ACCESS_TOKEN_NAME];

      if (!token) {
        throw new Api_error("Please login to continue", 401);
      }

      const decodedUser = jwt.verify(token, JWT_SECRET) as JwtPayload;

      // Fetch fresh user data from Prisma (exclude password)
      const user = await db.user.findUnique({
        where: { id: decodedUser.userId },
        select: {
          id: true,
          role: true,
          username: true,
        },
      });

      if (!user) {
        throw new Api_error(
          "Your session is invalid or has expired. Please login again.",
          401
        );
      }

      if (authorize_roles && !authorize_roles.includes(user.role)) {
        throw new Api_error(
          "You do not have permission to access this resource.",
          403
        );
      }

      // Attach sanitized user object
      (req as any).user = user;

      return next();
    } catch (error) {
      next(error);
    }
  };

export default check_auth;
