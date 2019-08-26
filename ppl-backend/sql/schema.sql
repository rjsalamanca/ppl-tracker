-- CREATE DATABASE ppl_tracker;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(500),
    last_name VARCHAR(500),
    email VARCHAR(500),
    password VARCHAR(500)
);