import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

const validate_data =
  <T extends ZodType<any, any>>(schema: T) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
export default validate_data;
