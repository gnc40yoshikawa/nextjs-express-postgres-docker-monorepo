import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST ?? "db",
  port: Number(process.env.PGPORT ?? 5432),
  user: process.env.PGUSER ?? "user",
  password: process.env.PGPASSWORD ?? "password",
  database: process.env.PGDATABASE ?? "mydb",
});
