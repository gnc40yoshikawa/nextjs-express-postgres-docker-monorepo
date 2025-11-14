import { Router } from "express";
import { z } from "zod";
import { registry } from "../docs/registry.js";
import * as ctrl from "../controllers/todos.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  ErrorResponse,
} from "../schemas/todo.schema.js";

const router = Router();

// ここで components を登録（1回でOK。複数回呼んでも重複は無視されます）
registry.register("Todo", Todo);
registry.register("CreateTodoInput", CreateTodoInput);
registry.register("UpdateTodoInput", UpdateTodoInput);
registry.register("ErrorResponse", ErrorResponse);

// パスパラメータ
const IdParam = z
  .object({ id: z.coerce.number().int().min(1) })
  .openapi("IdParam");

// --- /api/todos
registry.registerPath({
  method: "get",
  path: "/todos",
  summary: "Todo一覧を取得",
  tags: ["Todos"],
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: z.array(Todo) } },
    },
  },
});
router.get("/", ctrl.index);

// --- /api/todos/{id}
registry.registerPath({
  method: "get",
  path: "/todos/{id}",
  summary: "Todoを1件取得",
  tags: ["Todos"],
  request: { params: IdParam },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: Todo } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});
router.get("/:id", ctrl.show);

// --- POST /api/todos
registry.registerPath({
  method: "post",
  path: "/todos",
  summary: "Todoを作成",
  tags: ["Todos"],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: CreateTodoInput } },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: Todo } },
    },
    400: {
      description: "Bad Request",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});
router.post("/", validate(CreateTodoInput), ctrl.create);

// --- PATCH /api/todos/{id}
registry.registerPath({
  method: "patch",
  path: "/todos/{id}",
  summary: "Todoを更新",
  tags: ["Todos"],
  request: {
    params: IdParam,
    body: { content: { "application/json": { schema: UpdateTodoInput } } },
  },
  responses: {
    200: {
      description: "OK",
      content: { "application/json": { schema: Todo } },
    },
    400: {
      description: "Bad Request",
      content: { "application/json": { schema: ErrorResponse } },
    },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});
router.patch("/:id", validate(UpdateTodoInput), ctrl.update);

// --- DELETE /api/todos/{id}
registry.registerPath({
  method: "delete",
  path: "/todos/{id}",
  summary: "Todoを削除",
  tags: ["Todos"],
  request: { params: IdParam },
  responses: {
    204: { description: "No Content" },
    404: {
      description: "Not found",
      content: { "application/json": { schema: ErrorResponse } },
    },
  },
});
router.delete("/:id", ctrl.destroy);

export default router;
