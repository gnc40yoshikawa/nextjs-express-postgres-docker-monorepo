import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema, from: "body" | "query" | "params" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse((req as any)[from]);
    if (!result.success) {
      next({ status: 400, message: result.error.flatten() });
    } else {
      (req as any).validated = result.data;
      next();
    }
  };
