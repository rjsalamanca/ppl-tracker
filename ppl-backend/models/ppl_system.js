const db = require('./conn.js');

class PPL_System {
   constructor(routine_id, routine_name, days, date_started, user_id) {
      this.routine_id = routine_id,
         this.routine_name = routine_name,
         this.days = days,
         this.date_started = date_started,
         this.user_id = user_id
   }

   static async checkAnyRoutine(uid) {
      try {
         const response = await db.result(`
                SELECT * FROM routine WHERE user_id = $1
            `, [uid])
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   static async getWorkoutDays(uid) {
      try {
         const response = await db.any(`
            SELECT json_agg(USR)
            FROM(
               SELECT routine.routine_name, 
                  routine.date_started, 
                  (SELECT json_agg(days)
                     FROM(
                        SELECT * 
                        FROM routine_day
                        WHERE routine.id = routine_day.routine_id
                     ) AS days
                  ) AS days
               FROM routine
               WHERE routine.user_id = $1
            ) AS USR
         `, [uid])
         return response;
      } catch (err) {
         return err.message
      }
   }

   static async getFullRoutine(routine_name, uid) {
      try {
         const response = await db.any(`
            SELECT json_agg(USR) 
            FROM (
               SELECT users.id AS user_id, 
                  routine.id AS routine_id, 
                  routine.routine_name AS routine_name,
                  routine.date_started,
                  (SELECT json_agg(RD)
                     FROM(
                        SELECT routine_day.day_name as name, 
                           routine_day.id AS routine_day_id,
                           routine_day.rest_day,
                           routine_day.routine_id,
                           (SELECT json_agg(EXER)
                              FROM(
                                 SELECT id,
                                 exercise_name as name,
                                 routine_day_id,
                                 (SELECT json_agg(single_set)
                                    FROM(
                                       SELECT weight,
                                          id,
                                          set_num AS set,
                                          reps,
                                          set_date,
                                          exercise_id
                                          FROM exercise_sets
                                          WHERE set_date IS NULL
                                    ) single_set
                                    WHERE single_set.exercise_id = exercises.id
                              ) AS sets
                           FROM exercises
                        ) AS EXER
                        WHERE EXER.routine_day_id = routine_day.id
                     ) AS exercises
                     FROM routine
                     INNER JOIN routine_day ON routine.id = routine_day.routine_id
                  ) AS RD
                  WHERE RD.routine_id = routine.id
               ) AS ROUTINE_DAYS
               FROM users
               INNER JOIN routine ON users.id = routine.user_id
               WHERE users.id = $1 AND routine.user_id = $1 AND routine.routine_name = $2
            ) AS USR
            `, [uid, routine_name]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   static async getFullRoutineByID(routine_id, uid) {
      try {
         const response = await db.any(`
            SELECT json_agg(USR) 
            FROM (
               SELECT users.id AS user_id, 
                  routine.id AS routine_id, 
                  routine.routine_name AS routine_name,
                  routine.date_started,
                  (SELECT json_agg(RD)
                     FROM(
                        SELECT routine_day.day_name as name, 
                           routine_day.id AS routine_day_id,
                           routine_day.routine_id,
                           (SELECT json_agg(EXER)
                              FROM(
                                 SELECT id,
                                 exercise_name as name,
                                 routine_day_id,
                                 (SELECT json_agg(single_set)
                                    FROM(
                                       SELECT 
                                          id,
                                          weight,
                                          set_num AS set,
                                          reps,
                                          set_date,
                                          exercise_id
                                          FROM exercise_sets
                                          WHERE set_date IS NULL
                                    ) single_set
                                    WHERE single_set.exercise_id = exercises.id
                              ) AS sets
                           FROM exercises
                        ) AS EXER
                        WHERE EXER.routine_day_id = routine_day.id
                     ) AS exercises
                     FROM routine
                     INNER JOIN routine_day ON routine.id = routine_day.routine_id
                  ) AS RD
                  WHERE RD.routine_id = routine.id
               ) AS ROUTINE_DAYS
               FROM users
               INNER JOIN routine ON users.id = routine.user_id
               WHERE users.id = $1 AND routine.user_id = $1 AND routine.id = $2
            ) AS USR
            `, [uid, routine_id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   static async finishWorkout(workoutInfo, date) {
      console.log(workoutInfo)
      try {
         const buildValues = workoutInfo.map(workout => {
            const buildSets = workout.sets.map(set => `(${set.weight}, ${set.set}, ${set.reps}, '${date}', ${set.exercise_id})`)
            return buildSets.join(',');
         }).join(',');


         await db.result(`
            UPDATE routine_day
               SET workouts_completed = workouts_completed +1
               WHERE ID  = $1
         `, [workoutInfo[0].routine_day_id]);

         const response = await db.result(`
            INSERT INTO exercise_sets 
               (weight, set_num, reps, set_date, exercise_id)
            VALUES
               ${buildValues}`);

         return response;
      } catch (err) {
         return err.message
      }
   }

   async getRoutineInfo() {
      try {
         const response = await db.one(`
            SELECT * FROM routine WHERE user_id = $1 AND routine_name = $2
            `, [this.user_id, this.routine_name])
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async getRoutineDayInfo(day) {
      try {
         console.log(`before select: ${day.name} ${this.routine.id}`)
         const response = await db.result(`
            SELECT * FROM routine_day WHERE day_name = $1 AND routine_id = $2
            `, [day.name, this.routine_id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async getExerciseInfo(exercise, routineDayId) {
      try {
         const response = await db.result(`
            SELECT * FROM exercises WHERE exercise_name = $1 AND routine_day_id = $2
            `, [exercise.name, routineDayId]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async getExerciseSetInfo() {
      try {
         const response = await db.one(`
            SELECT * FROM routine WHERE user_id = $1 AND routine_name = $2
            `, [this.user_id, this.routine_name]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async createRoutine() {
      try {
         const response = await db.result(`
            INSERT INTO routine(routine_name, date_started, user_id)
            VALUES($1, $2, $3)
               `, [this.routine_name, this.date_started, this.user_id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async deleteRoutine(id) {
      try {
         const response = await db.result(`
            DELETE FROM routine WHERE id = $1
         `, [id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async updateRoutineName() {
      try {
         const response = await db.result(`
            UPDATE routine
            SET routine_name = $1
            WHERE 
               id = $2 
            AND user_id = $3
         `, [this.routine_name, this.routine_id, this.user_id]);
         console.log(response)
         return response;
      } catch (err) {
         return err.msgs
      }
   }

   async addRoutineDays(days) {
      const buildDays = () => {
         let buildInsert;
         console.log(days);

         if (typeof days === 'object' && !!Array.isArray(days)) {
            if (days.length === 1) {
               console.log('1');
               buildInsert = `('${days[0].name}', ${days[0].rest_day}, 0, ${this.routine_id})`
            } else {
               console.log('2');
               buildInsert = days.map(day => `('${day.name}', ${day.rest_day}, 0, ${this.routine_id})`).join(',');
            }
         } else if (typeof days === 'object' && !Array.isArray(days)) {
            console.log('3');
            buildInsert = `('${days.name}', ${days.rest_day}, 0, ${this.routine_id})`;
         } else {
            console.log('4');
            buildInsert = days.map(day => `('${day.name}', ${day.rest_day}, 0, ${this.routine_id})`).join(',');
         }

         // typeof days === 'object' ?  `('${days.name}', ${days.rest_day}, ${this.routine_id})` : days.map(day => `('${day.name}', ${days.rest_day}, ${this.routine_id}, 'test')`).join(',');
         return buildInsert;
      }

      try {
         const response = await db.result(`
            INSERT INTO routine_day(day_name, rest_day, workouts_completed, routine_id)
            VALUES ${buildDays()} RETURNING *`);
         return response;
      } catch (err) {
         console.log(err)
         return err.msg;
      }
   }

   async deleteRoutineDay(id) {
      try {
         const response = await db.result(`
            DELETE FROM routine_day WHERE id = $1
         `, [id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async updateRoutineDays(days) {
      const buildDays = days.map(day => `(${day.routine_day_id}, '${day.name}', ${day.routine_id})`).join(',')

      try {
         const response = await db.result(`
            UPDATE routine_day as RD
            SET day_name = new_day.day_name, 
               routine_id = new_day.routine_id
            FROM(
               VALUES
               ${buildDays}
            ) as new_day(id, day_name, routine_id)
            WHERE RD.id = new_day.id`);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   // Creation of Exercises
   async addExercises(day) {
      try {
         const buildExercises = day.exercises.map(exercise => `('${exercise.name}', (SELECT id FROM routine_day WHERE day_name = '${day.name}' AND routine_id = ${this.routine_id})) `).join(',');
         const response = await db.result(`
            INSERT INTO exercises(exercise_name, routine_day_id)
            VALUES ${buildExercises}`);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   // Adding Single Exercise
   async addSingleExercise(exerciseName, routine_day_id) {
      try {
         const response = await db.result(`
            INSERT INTO exercises(exercise_name, routine_day_id)
            VALUES ($1, $2) `, [exerciseName, routine_day_id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   // Deleting of Exercises
   async deleteSingleExercise(id) {
      try {
         const response = await db.result(`DELETE FROM exercises WHERE id = $1`, [id]);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async updateExerciseName(exercises) {
      const buildExercises = exercises.map(exercise => `(${exercise.id}, '${exercise.name}', ${exercise.routine_day_id})`);

      try {
         const response = await db.result(`
            UPDATE exercises as E
            SET exercise_name = new_exercise.exercise_name,
               routine_day_id = new_exercise.routine_day_id
            FROM(
               VALUES
               ${buildExercises}
            ) AS new_exercise(id,exercise_name,routine_day_id)
            WHERE E.id = new_exercise.id
         `);
         return response;
      } catch (err) {
         return err.msg;
      }
   }

   // Add multiple sets
   async addExerciseSets(exercise, day) {
      const buildSets = exercise.sets.map((set, setIdx) => `
         (${parseInt(set.weight)}, ${setIdx + 1}, ${set.reps},
            (SELECT id from exercises WHERE exercise_name = '${exercise.name}' AND routine_day_id =
               (SELECT id from routine_day WHERE day_name = '${day.name}' AND routine_id = ${this.routine_id})))`).join(',');
      try {
         const response = await db.result(`
         INSERT INTO exercise_sets(weight, set_num, reps, exercise_id)
         VALUES ${buildSets}`);

         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async addSingleExerciseSet(weight, reps, exerciseID) {
      try {
         const findLastSet = await db.result('SELECT set_num from exercise_sets where exercise_id = $1', [exerciseID]);
         const response = await db.result(
            `INSERT INTO exercise_sets(weight,set_num, reps, exercise_id)
         VALUES ($1, $2, $3, $4)`, [weight, findLastSet.rowCount + 1, reps, exerciseID]);

         return response;
      } catch (err) {
         return err.msg;
      }
   }

   async deleteSingleExerciseSet(id) {
      try {
         const response = await db.result('DELETE FROM exercise_sets WHERE id = $1', [id]);
         return response;
      } catch (err) {
         return err.msg
      }
   }

   async updateExerciseSets(exercise, day) {
      const buildSets = exercise.sets.map(exerciseSet => `(${exerciseSet.id}, ${exerciseSet.weight}, ${exerciseSet.set}, ${exerciseSet.reps}, ${exerciseSet.exercise_id})`);
      try {
         const response = await db.result(`
         UPDATE exercise_sets AS ES
         SET weight = new_exercise_sets.weight,
            set_num = new_exercise_sets.set_num,
            reps = new_exercise_sets.reps,
            exercise_id = new_exercise_sets.exercise_id
         FROM(
            VALUES
               ${buildSets}
         ) AS new_exercise_sets(id,weight,set_num,reps,exercise_id)
         WHERE ES.id = new_exercise_sets.id`);

         return response;
      } catch (err) {
         return err.msg;
      }
   }
}

module.exports = PPL_System;