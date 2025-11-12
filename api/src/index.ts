import express from "express";
import cors from "cors";

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