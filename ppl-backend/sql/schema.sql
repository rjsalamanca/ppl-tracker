-- CREATE DATABASE ppl_tracker;
DROP TABLE users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    first_name VARCHAR(500),
    last_name VARCHAR(500),
    email VARCHAR(500),
    password VARCHAR(500)
);