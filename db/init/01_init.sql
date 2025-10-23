CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO todos (title, done) VALUES
('Write first API', false),
('Dockerize app', true);