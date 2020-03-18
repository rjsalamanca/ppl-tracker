INSERT INTO users
   (first_name,last_name,email,password)
VALUES('First Temp', 'Last Temp', 'rj@rj.com', '$2a$10$jAv09QOZoPtqmwprFW8tguMJdUWBPUNQ/E5TdJ3nvFBEl2QOmZfj.');
-- Password is 1

INSERT INTO routine
   (routine_name,date_started,user_id)
VALUES('Push Pull Legs Routine', 'Nov 25 2019', 1);

INSERT INTO routine_day
   (day_name, routine_id)
VALUES('Chest Day', 1);

INSERT INTO routine_day
   (day_name, routine_id)
VALUES('Back Day', 1);

INSERT INTO exercises
   (exercise_name, routine_day_id)
VALUES('Bench Press', (SELECT id
      from routine_day
      WHERE day_name = 'Chest Day' AND routine_id = 1));

INSERT INTO exercises
   (exercise_name, routine_day_id)
VALUES('Row', (SELECT id
      from routine_day
      WHERE day_name = 'Back Day' AND routine_id = 1));

INSERT INTO exercise_sets
   (weight, set_num, reps, exercise_id)
VALUES(135, 1, 10,
      (SELECT id
      from exercises
      WHERE exercise_name = 'Bench Press' AND routine_day_id = 
                        (SELECT id
         from routine_day
         WHERE day_name = 'Chest Day' AND routine_id = 1)));

INSERT INTO exercise_sets
   (weight, set_num, reps, exercise_id)
VALUES(1, 1, 10,
      (SELECT id
      from exercises
      WHERE exercise_name = 'Row' AND routine_day_id = 
                        (SELECT id
         from routine_day
         WHERE day_name = 'Back Day' AND routine_id = 1)));

INSERT INTO exercise_sets
   (weight, set_num, reps, exercise_id)
VALUES(120, 2, 10,
      (SELECT id
      from exercises
      WHERE exercise_name = 'Bench Press' AND routine_day_id = 
                        (SELECT id
         from routine_day
         WHERE day_name = 'Chest Day' AND routine_id = 1)));

INSERT INTO exercise_sets
   (weight, set_num, reps, exercise_id)
VALUES(110, 3, 10,
      (SELECT id
      from exercises
      WHERE exercise_name = 'Bench Press' AND routine_day_id = 
                        (SELECT id
         from routine_day
         WHERE day_name = 'Chest Day' AND routine_id = 1)));

INSERT INTO exercise_sets
   (weight, set_num, reps, exercise_id)
VALUES(2, 2, 10,
      (SELECT id
      from exercises
      WHERE exercise_name = 'Row' AND routine_day_id = 
                        (SELECT id
         from routine_day
         WHERE day_name = 'Back Day' AND routine_id = 1)));

INSERT INTO exercise_sets
   (weight, set_num, reps, exercise_id)
VALUES(3, 3, 10,
      (SELECT id
      from exercises
      WHERE exercise_name = 'Row' AND routine_day_id = 
                        (SELECT id
         from routine_day
         WHERE day_name = 'Back Day' AND routine_id = 1)));