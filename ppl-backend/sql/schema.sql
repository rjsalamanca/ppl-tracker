-- CREATE DATABASE ppl_tracker;
DROP TABLE users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(500),
    last_name VARCHAR(500),
    email VARCHAR(500),
    password VARCHAR(500)
);

CREATE TABLE exercises
(
    id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(500),
    pounds INT,
    sets VARCHAR(500),
    cycle INT REFERENCES push(id)
);

CREATE TABLE push
(
    id SERIAL PRIMARY KEY
);

CREATE TABLE routines
(
    id SERIAL PRIMARY KEY,
    pushCycle INT REFERENCES push(id)
);