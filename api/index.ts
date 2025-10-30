// src/server.ts
import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();

// PostgreSQLの設定
const pool = new Pool({
  user: 'user',
  host: 'nextjs-express-postgres-docker-monorepo-db-1',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

// ルーティングの設定
app.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rows } = await pool.query('SELECT * FROM todos');
    res.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
