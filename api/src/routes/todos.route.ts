import { Router } from "express";
import { z } from "zod";
import { registry } from "../docs/registry";
import { validate } from "../middlewares/validate";
import * as svc from "../services/todos.service";
import { Todo, CreateTodoInput, UpdateTodoInput, ErrorResponse } from "../schemas/todo.schema";

const router = Router();

// ここで components を登録（1回でOK。複数回呼んでも重複は無視されます）
registry.register("Todo", Todo);
registry.register("CreateTodoInput", CreateTodoInput);
registry.register("UpdateTodoInput", UpdateTodoInput);
registry.register("ErrorResponse", ErrorResponse);

// パスパラメータ
const IdParam = z.object({ id: z.coerce.number().int().min(1) }).openapi("IdParam");

// --- /api/todos
registry.registerPath({
  method: "get",
  path: "/api/todos",
  summary: "Todo一覧を取得",
  tags: ["Todos"],
  responses: { 200: { description: "OK", content: { "application/json": { schema: z.array(Todo) } } } }
});
router.get("/", async (_req, res, next) => {
  try { res.json(await svc.listTodos()); } catch (e) { next(e); }
});

// --- /api/todos/{id}
registry.registerPath({
  method: "get",
  path: "/api/todos/{id}",
  summary: "Todoを1件取得",
  tags: ["Todos"],
  request: { params: IdParam },
  responses: {
    200: { description: "OK", content: { "application/json": { schema: Todo } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorResponse } } }
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const row = await svc.getTodo(Number(req.params.id));
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) { next(e); }
});

// --- POST /api/todos
registry.registerPath({
  method: "post",
  path: "/api/todos",
  summary: "Todoを作成",
  tags: ["Todos"],
  request: { body: { required: true, content: { "application/json": { schema: CreateTodoInput } } } },
  responses: {
    201: { description: "Created", content: { "application/json": { schema: Todo } } },
    400: { description: "Bad Request", content: { "application/json": { schema: ErrorResponse } } }
  }
});
router.post("/", validate(CreateTodoInput), async (req, res, next) => {
  try { res.status(201).json(await svc.createTodo((req as any).validated)); }
  catch (e) { next(e); }
});

// --- PATCH /api/todos/{id}
registry.registerPath({
  method: "patch",
  path: "/api/todos/{id}",
  summary: "Todoを更新",
  tags: ["Todos"],
  request: {
    params: IdParam,
    body: { content: { "application/json": { schema: UpdateTodoInput } } }
  },
  responses: {
    200: { description: "OK", content: { "application/json": { schema: Todo } } },
    400: { description: "Bad Request", content: { "application/json": { schema: ErrorResponse } } },
    404: { description: "Not found", content: { "application/json": { schema: ErrorResponse } } }
  }
});
router.patch("/:id", validate(UpdateTodoInput), async (req, res, next) => {
  try {
    const row = await svc.updateTodo(Number(req.params.id), (req as any).validated);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e) { next(e); }
});

// --- DELETE /api/todos/{id}
registry.registerPath({
  method: "delete",
  path: "/api/todos/{id}",
  summary: "Todoを削除",
  tags: ["Todos"],
  request: { params: IdParam },
  responses: {
    204: { description: "No Content" },
    404: { description: "Not found", content: { "application/json": { schema: ErrorResponse } } }
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await svc.deleteTodo(Number(req.params.id));
    res.status(ok ? 204 : 404).send(ok ? undefined : { error: "Not found" });
  } catch (e) { next(e); }
});

export default router;
