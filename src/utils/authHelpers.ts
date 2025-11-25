import { type Response } from "express";
import { toMilliseconds, toSeconds } from "./timeConverter.ts";
import jwt from "jsonwebtoken";

export const createJwtToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: toSeconds(process.env.ACCESS_TOKEN_EXPIRES_IN),
  });
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(process.env.ACCESS_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    signed: true,
    maxAge: toMilliseconds(process.env.ACCESS_TOKEN_EXPIRES_IN),
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(process.env.ACCESS_TOKEN_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    signed: true,
  });
};
