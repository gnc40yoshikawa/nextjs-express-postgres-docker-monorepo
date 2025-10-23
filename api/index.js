const express = require('express');
const app = express();

// PostgreSQLの設定
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'step2-db-1',
  database: 'mydb',
  password: 'postgres',
  port: 5432,
})

// ルーティングの設定
app.get('/', async(req, res) => {
  const { rows } = await pool.query('select * from mybook')
  res.send(rows)
});

const port = 4000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});