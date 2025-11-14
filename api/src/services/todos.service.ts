import type {
  CreateTodoInputType,
  UpdateTodoInputType,
} from "../schemas/todo.schema.js";
import { prisma } from "../libs/prisma.js";
import { Prisma } from "@prisma/client";

// 返却フィールドの共通 select（重複防止）
const todoSelect = {
  id: true,
  title: true,
  done: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function listTodos() {
  return prisma.todos.findMany({
    orderBy: { id: "asc" },
    select: todoSelect,
  });
}

export async function getTodo(id: number) {
  return prisma.todos.findUnique({
    where: { id },
    select: todoSelect,
  });
}

export async function createTodo(input: CreateTodoInputType) {
  return prisma.todos.create({
    data: { title: input.title, done: input.done },
    select: todoSelect, // ★ updatedAt も揃えて true に
  });
}

function toUpdateData(input: UpdateTodoInputType): Prisma.TodosUpdateInput {
  const data: Prisma.TodosUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.done !== undefined) data.done = input.done;
  return data;
}

export async function updateTodo(id: number, input: UpdateTodoInputType) {
  try {
    const data = toUpdateData(input); // ← ここで undefined を除去

    return await prisma.todos.update({
      where: { id },
      data,
      select: todoSelect,
    });
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025")
      return null;
    throw e;
  }
}

export async function deleteTodo(id: number) {
  try {
    await prisma.todos.delete({ where: { id } });
    return true;
  } catch (e: unknown) {
    // ★ unknown
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return false; // 見つからず → false
    }
    throw e;
  }
}
