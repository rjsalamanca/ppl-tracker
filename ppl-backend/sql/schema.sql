-- CREATE DATABASE ppl_tracker;
DROP TABLE users;
DROP TABLE exercises;
DROP TABLE push;
DROP TABLE routines;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(500),
    last_name VARCHAR(500),
    email VARCHAR(500),
    password VARCHAR(500)
);

CREATE TABLE push
(
    id SERIAL PRIMARY KEY,
    exercise_id INT
);

CREATE TABLE exercises
(
    id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(500),
    pounds INT,
    rep_sets VARCHAR(500),
    cycle INT REFERENCES push(id),
    exercise_date VARCHAR(100)
);
