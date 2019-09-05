INSERT INTO users
    (first_name,last_name,email,password)
VALUES('First Temp', 'Last Temp', 'rj@rj.com', '$2a$10$jAv09QOZoPtqmwprFW8tguMJdUWBPUNQ/E5TdJ3nvFBEl2QOmZfj.');
-- Password is 1

INSERT INTO push
    (exercise_id)
VALUES(1);

INSERT INTO exercises
    (exercise_name, pounds, rep_sets, cycle, exercise_date)
VALUES('Bench Press', 135, '5-5-5-12', 1, 'Oct 14 2019');