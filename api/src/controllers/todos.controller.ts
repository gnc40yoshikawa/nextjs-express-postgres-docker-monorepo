import type { Request, Response, NextFunction } from "express";
import * as svc from "../services/todos.service.js";
import type { RequestWithValidated } from "../middlewares/validate.js";
import type {
  CreateTodoInputType,
  UpdateTodoInputType,
} from "../schemas/todo.schema.js";

const toId = (s: string) => {
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : NaN;
};

export async function index(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await svc.listTodos());
  } catch (e) {
    next(e);
  }
}

export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    const id = toId(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const todo = await svc.getTodo(id);
    if (!todo) return res.status(404).json({ error: "Not found" });
    res.json(todo);
  } catch (e) {
    next(e);
  }
}

export async function create(
  req: RequestWithValidated<CreateTodoInputType>,
  res: Response,
  next: NextFunction,
) {
  try {
    const created = await svc.createTodo(req.validated);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function update(
  req: RequestWithValidated<UpdateTodoInputType>,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = toId(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const todo = await svc.updateTodo(id, req.validated);
    if (!todo) return res.status(404).json({ error: "Not found" });
    res.json(todo);
  } catch (e) {
    next(e);
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const id = toId(req.params.id);
    if (!Number.isFinite(id))
      return res.status(400).json({ error: "Invalid id" });

    const ok = await svc.deleteTodo(id);
    res.status(ok ? 204 : 404).send(ok ? undefined : { error: "Not found" });
  } catch (e) {
    next(e);
  }
}
