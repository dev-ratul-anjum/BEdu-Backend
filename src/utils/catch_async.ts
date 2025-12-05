import { NextFunction, Request, Response } from "express";

type TAsync_handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<Response>;

const catch_async =
  (fn: TAsync_handler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      next(err);
    });
  };

export default catch_async;
