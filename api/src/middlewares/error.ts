import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface HttpErrorLike {
  status?: unknown; // 後で number に絞る
  message?: unknown; // 後で string に絞る
  code?: unknown;
  details?: unknown;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isHttpErrorLike(e: unknown): e is HttpErrorLike {
  return isObject(e) && ("message" in e || "status" in e || "code" in e);
}

function pickStatus(e: unknown): number {
  // Zod のバリデーションエラーは 400 を返す
  if (e instanceof ZodError) return 400;

  if (isHttpErrorLike(e) && typeof e.status === "number") return e.status;
  return 500;
}

function pickMessage(e: unknown): string {
  if (e instanceof ZodError) return "Validation error";
  if (isHttpErrorLike(e) && typeof e.message === "string" && e.message)
    return e.message;
  return "Internal Server Error";
}

/** 4 引数シグネチャは必須（err を unknown にするのがポイント） */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = pickStatus(err);
  const message = pickMessage(err);

  // 追加情報（例：Zodの issues）は型ガードを通して安全に付与
  const body: Record<string, unknown> = { error: message };
  if (err instanceof ZodError) body.issues = err.issues;
  if (isHttpErrorLike(err) && isObject(err.details)) body.details = err.details;

  res.status(status).json(body);
}
