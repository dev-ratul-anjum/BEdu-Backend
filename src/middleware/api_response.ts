import { type Response } from "express";

export default function api_response<T extends unknown>(
  response: Response,
  status_code: number,
  options: TOptions<T>
) {
  return response.status(status_code).json(options);
}

type TOptions<T extends unknown> = {
  success: boolean;
  message: string;
  data?: T | null | undefined;
  [x: string]: unknown;
};
