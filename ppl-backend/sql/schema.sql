-- CREATE DATABASE ppl_tracker;
DROP TABLE exercise_sets;
DROP TABLE exercises;
DROP TABLE routine_day;
DROP TABLE routine;
DROP TABLE users;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(500),
    last_name VARCHAR(500),
    email VARCHAR(500),
    password VARCHAR(500)
);

CREATE TABLE routine
(
    id SERIAL PRIMARY KEY,
    routine_name VARCHAR(500),
    date_started VARCHAR(100),
    user_id INT REFERENCES users(id)
);

CREATE TABLE routine_day
(
    id SERIAL PRIMARY KEY,
    day_name VARCHAR(100),
    routine_id INT REFERENCES routine(id),
    routine_date VARCHAR(100)
);

CREATE TABLE exercises
(
    id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(500),
    reps INT,
    routine_day_id INT REFERENCES routine_day(id)
);

CREATE TABLE exercise_sets
(
    id SERIAL PRIMARY KEY,
    weight FLOAT,
    sets INT,
    reps INT,
    exercise_id INT REFERENCES exercises(id)
);