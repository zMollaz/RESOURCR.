DROP TABLE IF EXISTS topics CASCADE;

CREATE TABLE topics (
  id SERIAL PRIMARY KEY NOT NULL,
  topic VARCHAR(255) NOT NULL
);