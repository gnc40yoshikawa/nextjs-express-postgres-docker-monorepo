import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export type RequestWithValidated<T> = Request & { validated: T };

export const validate = <TS extends z.ZodType>(
  schema: TS
): ((req: RequestWithValidated<z.output<TS>>, res: Response, next: NextFunction) => void) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    (req as RequestWithValidated<z.output<TS>>).validated = schema.parse(req.body);
    next();
  };
};
