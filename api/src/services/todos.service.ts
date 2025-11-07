import { CreateTodoInput, UpdateTodoInput } from "../schemas/todo.schema.ts";
import { prisma } from "../libs/prisma.js";

export async function listTodos() {
  return prisma.todos.findMany({
    orderBy: { id: "asc" },
    select: { id: true, title: true, done: true, createdAt: true, updatedAt: true },
  });
}
export async function getTodo(id: number) {
  return prisma.todos.findUnique({
    where: { id },
    select: { id: true, title: true, done: true, createdAt: true, updatedAt: true },
  });
}
export async function createTodo(input: CreateTodoInput) {
  return prisma.todos.create({
    data: { title: input.title, done: input.done ?? false },
    select: { id: true, title: true, done: true, createdAt: true, updatedAt: false },
  });
}
export async function updateTodo(id: number, input: UpdateTodoInput) {
  return prisma.todos.update({
    where: { id },
    data: {
      title: input.title ?? undefined,
      done: input.done ?? undefined,
    },
    select: { id: true, title: true, done: true, createdAt: true, updatedAt: true },
  }).catch((e) => {
    // id が存在しない場合は Prisma が例外を投げる
    if ((e as any).code === "P2025") return null;
    throw e;
  });
}
export async function deleteTodo(id: number) {
  return prisma.todos.delete({ where: { id } })
    .then(() => true)
    .catch((e) => {
      if ((e as any).code === "P2025") return false;
      throw e;
    });
}
