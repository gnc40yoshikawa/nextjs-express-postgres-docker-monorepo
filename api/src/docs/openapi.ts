import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry.js";

export const openapiRouter = Router();

// JSON を動的生成して返す（UI はこれを読む）
openapiRouter.get("/docs.json", (_req, res) => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const doc = generator.generateDocument({
    openapi: "3.0.3",
    info: { title: "Todo API", version: "1.0.0" },
    servers: [{ url: "http://api.localhost/" }],
  });
  res.json(doc);
});

// Swagger UI には docs.json の URL を渡す
openapiRouter.use("/", swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerUrl: "/docs/docs.json",
}));
