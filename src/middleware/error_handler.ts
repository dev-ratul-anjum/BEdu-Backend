import e, { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import api_response from "./api_response.js";
import { Prisma } from "$/db/generated/client.js";

export class Api_error extends Error {
  status_code: number;
  path: string;

  constructor(
    message: string,
    status_code: number,
    path: string = "",
    stack?: string
  ) {
    super(message);
    this.status_code = status_code;
    this.path = path;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const not_found_handler: RequestHandler = (_req, res, next) => {
  return api_response(res, 404, {
    success: false,
    message: "Sorry, that page cannot be found!",
  });
};

export const global_error_handler: ErrorRequestHandler = async (
  error,
  req,
  res,
  next
) => {
  let status_code = 500;
  let message =
    error.message || "Something went wrong. Please try again later.";
  let errors = null;
  let path = req.originalUrl; // Capture the request path

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint
        status_code = 409;
        message = "Duplicate value violates a unique constraint";
        errors = [
          {
            path:
              (error.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      case "P2003": // Foreign key
        status_code = 400;
        message = "Foreign key constraint violation";
        errors = [
          {
            path:
              (error.meta?.target as string[] | undefined)?.[0] || "general",
            message,
          },
        ];
        break;

      case "P1000": // Auth fail
        status_code = 500;
        message = "Database authentication failed";
        errors = [{ path: "general", message }];
        break;

      default:
        status_code = 400;
        message = error.message;
        errors = [{ path: "general", message }];
        break;
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    status_code = 400;
    message = "Prisma query validation error";
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    status_code = 500;
    message = "Unknown error occurred in Prisma";
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    status_code = 500;
    message = "Prisma client failed to initialize";
  } else if (error instanceof ZodError) {
    status_code = 400;
    message = "Input validation failed";
    errors = error.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] || "general",
      message: issue.message,
    }));
  } else if (error instanceof Api_error) {
    status_code = error.status_code;
    message = error.message;
    if (error.path) {
      errors = [{ path: error.path, message }];
    }
  } else if (error instanceof Error) {
    status_code = 500;
    message = error.message;
  }

  return api_response(res, status_code, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
    path,
    request_id: new Date().getTime(),
  });
};
