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
   date_started DATE,
   date_ended DATE,
   user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE routine_day
(
   id SERIAL PRIMARY KEY,
   day_name VARCHAR(100),
   rest_day BOOLEAN,
   workouts_completed INT,
   routine_id INT REFERENCES routine(id) ON DELETE CASCADE
);

CREATE TABLE exercises
(
   id SERIAL PRIMARY KEY,
   exercise_name VARCHAR(500),
   reps INT,
   routine_day_id INT REFERENCES routine_day(id) ON DELETE CASCADE
);

CREATE TABLE exercise_sets
(
   id SERIAL PRIMARY KEY,
   weight FLOAT,
   set_num INT,
   reps INT,
   set_date DATE,
   initial_set BOOLEAN,
   exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE
);



