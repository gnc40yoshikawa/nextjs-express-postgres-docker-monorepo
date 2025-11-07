import { pool } from "../libs/db.ts";
import { CreateTodoInput, UpdateTodoInput } from "../schemas/todo.schema.ts";
import { prisma } from "../libs/prisma.js";

export async function listTodos() {
  return prisma.todos.findMany({
    orderBy: { id: "asc" },
    select: { id: true, title: true, done: true },
  });
}
export async function getTodo(id: number) {
  const { rows } = await pool.query("SELECT id, title, done FROM todos WHERE id=$1", [id]);
  return rows[0] ?? null;
}
export async function createTodo(input: CreateTodoInput) {
  return prisma.todos.create({
    data: { title: input.title, done: input.done ?? false },
    select: { id: true, title: true, done: true },
  });
}
export async function updateTodo(id: number, input: UpdateTodoInput) {
  const { rows } = await pool.query(
    "UPDATE todos SET title=COALESCE($2,title), done=COALESCE($3,done) WHERE id=$1 RETURNING id, title, done",
    [id, input.title ?? null, input.done ?? null]
  );
  return rows[0] ?? null;
}
export async function deleteTodo(id: number) {
  const { rowCount } = await pool.query("DELETE FROM todos WHERE id=$1", [id]);
  return rowCount > 0;
}
