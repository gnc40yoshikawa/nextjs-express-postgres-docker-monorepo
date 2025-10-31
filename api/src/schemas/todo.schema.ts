import { z } from "zod";
import { OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// スキーマを register するためのローカル registry（後でまとめて docs の registry に合流させる）
export const todoRegistry = new OpenAPIRegistry();

/** 共通エラーレスポンス（例） */
export const ErrorResponse = z.object({
  error: z.string(),
}).openapi("ErrorResponse");

// Todo 本体
export const Todo = z.object({
  id: z.number().int().openapi({ example: 1 }),
  title: z.string().min(1).openapi({ example: "buy milk" }),
  done: z.boolean().openapi({ example: false }),
}).openapi("Todo");

// 作成
export const CreateTodoInput = z.object({
  title: z.string().min(1),
  done: z.boolean().optional().default(false),
}).openapi("CreateTodoInput");

// 更新
export const UpdateTodoInput = z.object({
  title: z.string().min(1).optional(),
  done: z.boolean().optional(),
}).openapi("UpdateTodoInput");

// OpenAPI の components に載せたいスキーマを registry に登録
todoRegistry.register("Todo", Todo);
todoRegistry.register("CreateTodoInput", CreateTodoInput);
todoRegistry.register("UpdateTodoInput", UpdateTodoInput);
todoRegistry.register("ErrorResponse", ErrorResponse);

// 型エイリアス（実行時にも検証で利用）
export type CreateTodoInputType = z.infer<typeof CreateTodoInput>;
export type UpdateTodoInputType = z.infer<typeof UpdateTodoInput>;
