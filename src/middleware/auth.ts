import { db } from "$/db/index.ts";
import ApiError from "$/utils/ApiError.ts";
import {RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET as string;

export const auth : RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const token = req.signedCookies?.token;

    if (!token) {
      throw new ApiError("Token is required", 401)
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Fetch fresh user data from Prisma (exclude password)
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        username: true,
        password: false,
      },
    });

    if (!user) {
      throw new ApiError("Invalid token", 401)
    }

    // Attach sanitized user object
    (req as any).user = user;


    return next();
  } catch (error) {
   next(error)
  }
};
