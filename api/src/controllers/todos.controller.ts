import type { Request, Response, NextFunction } from "express";
import * as svc from "../services/todos.service.js";

export async function index(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await svc.listTodos()); } catch (e) { next(e); }
}
export async function show(req: Request, res: Response, next: NextFunction) {
  try {
    const todo = await svc.getTodo(Number(req.params.id));
    if (!todo) return res.status(404).json({ error: "Not found" });
    res.json(todo);
  } catch (e) { next(e); }
}
export async function create(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json(await svc.createTodo((req as any).validated)); }
  catch (e) { next(e); }
}
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const todo = await svc.updateTodo(Number(req.params.id), (req as any).validated);
    if (!todo) return res.status(404).json({ error: "Not found" });
    res.json(todo);
  } catch (e) { next(e); }
}
export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const ok = await svc.deleteTodo(Number(req.params.id));
    res.status(ok ? 204 : 404).send(ok ? undefined : { error: "Not found" });
  } catch (e) { next(e); }
}
