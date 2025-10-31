import { pool } from "../libs/db.ts";
import { CreateTodoInput, UpdateTodoInput } from "../schemas/todo.schema.ts";

export async function listTodos() {
  const { rows } = await pool.query("SELECT id, title, done FROM todos ORDER BY id");
  return rows;
}
export async function getTodo(id: number) {
  const { rows } = await pool.query("SELECT id, title, done FROM todos WHERE id=$1", [id]);
  return rows[0] ?? null;
}
export async function createTodo(input: CreateTodoInput) {
  const { rows } = await pool.query(
    "INSERT INTO todos (title, done) VALUES ($1, $2) RETURNING id, title, done",
    [input.title, input.done ?? false]
  );
  return rows[0];
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
