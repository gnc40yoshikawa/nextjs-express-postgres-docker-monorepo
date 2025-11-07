import express from "express";
import cors from "cors";
import { prisma } from './libs/prisma.js'

// 先にアプリのルート群を import（← これが大事）
import todosRouter from "./routes/todos.route.js";

import { openapiRouter } from "./docs/openapi.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.send({ ok: true }));

app.use("/todos", todosRouter);

// 最後に /docs
app.use("/docs", openapiRouter);

// エラーハンドラ
app.use(errorHandler);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
