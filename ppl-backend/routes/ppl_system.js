const express = require('express'),
   router = express.Router(),
   moment = require('moment'),
   pplSystemModel = require('../models/ppl_system');

function requireLogin(req, res, next) {
   if (req.session && req.session.users) {
      console.log('user is logged in')
      next();
   } else {
      console.log('user is not logged in')
      res.json({
         user_status: false
      });
   }
};

router.get('/routine', requireLogin, async (req, res) => {
   const user_id = req.session.users.user_id;
   const anyRoutine = await pplSystemModel.checkAnyRoutine(user_id);
   anyRoutine.rowCount === 0 ? res.json({ routine_found: false }) : res.json({ routine_found: true, routines: anyRoutine.rows })
});

router.post('/routine/currentDay', requireLogin, async (req, res) => {
   const user_id = req.session.users.user_id;
   const { date } = req.body;
   console.log(date)
   const getWorkout = await pplSystemModel.getWorkoutDays(user_id);
   if (getWorkout[0].json_agg !== null) {
      const getWorkoutByDay = getWorkout[0].json_agg.map(workout => {
         const date_between = Math.floor(moment.duration(moment(date).diff(workout.date_started)).asDays());
         const days = workout.days.length;
         const curr_day_ind = (date_between % days);
         console.log('----------------');
         console.log(`In map of: ${workout.routine_name}`)
         console.log(`date: ${date}`)
         console.log(`date_between: ${date_between}`);
         console.log(`days: ${days}`);
         console.log(`curr_day_ind: ${curr_day_ind}`);
         console.log('----------------\n');
         return date_between < 0 ? null : curr_day_ind >= 0 ? { routine_name: workout.routine_name, current_workout: workout.days[curr_day_ind] } : { routine_name: workout.routine_name, current_workout: workout.days[0] }
      })

      res.json({ todays_workout: getWorkoutByDay.filter(e => e !== null) });
   } else {
      res.json({ todays_workout: false });
   }
});

router.get('/get_full_routine/:routine?', requireLogin, async (req, res) => {
   const { routine } = req.params;
   const user_id = req.session.users.user_id;
   const getFullRoutine = await pplSystemModel.getFullRoutine(routine, user_id);
   getFullRoutine[0].json_agg === null ? res.json({ routine_found: false }) : res.json({ routine_found: true, routine: getFullRoutine[0].json_agg[0] });
});

router.post('/routine/update_routine', requireLogin, async (req, res) => {
   const { routine_id, routine_name, days } = req.body;
   const user_id = req.session.users.user_id;
   const routineModel = new pplSystemModel(routine_id, routine_name, null, null, user_id);
   const getOriginalFullRoutine = await pplSystemModel.getFullRoutineByID(routine_id, user_id);
   const originalRoutineInfo = getOriginalFullRoutine[0].json_agg[0];

   // Update Routine Name
   try {
      if (originalRoutineInfo.routine_name !== routine_name) {
         await routineModel.updateRoutineName();
      }

      // Update Days, Exercises, Exercise Sets
      if (JSON.stringify(originalRoutineInfo.routine_days) !== JSON.stringify(days)) {
         // Update Days
         await routineModel.updateRoutineDays(days);

         days.forEach(async (day) => {

            console.log(day);
            if (day.hasOwnProperty('deleted')) {
               if (!!day.deleted) {

                  await routineModel.deleteRoutineDay(day.routine_day_id);
               }
            }

            if (day.hasOwnProperty('newDay')) {
               if (!!day.newDay) {
                  const addedDay = await routineModel.addRoutineDays(day);

                  // Add a new day and add routine id and routine day id after inserting.
                  day['routine_id'] = addedDay.rows[0].routine_id;
                  day['routine_day_id'] = addedDay.rows[0].id;
               }
            }
            // Only update exercise name on non rest days.
            if (day.exercises !== null && !day.rest_day) {
               // Update Exercise Name
               await routineModel.updateExerciseName(day.exercises);
               day.exercises.forEach(async (exercise) => {
                  if (exercise.hasOwnProperty('deleted')) {
                     if (!!exercise.deleted) {
                        await routineModel.deleteSingleExercise(exercise.id);
                        console.log('deleted exercise:', exercise.deleted);
                     }
                     // Add new Exercises to Existing days.
                  } else if (exercise.hasOwnProperty('newExercise')) {
                     await routineModel.addSingleExercise(exercise.name, day.routine_day_id);
                     await routineModel.addExerciseSets(exercise, day);
                  }
                  else {
                     // Add new sets to existing exercise.
                     exercise.sets.forEach(async (set) => {
                        if (set.hasOwnProperty('deleted')) {
                           if (!!set.deleted) {
                              await routineModel.deleteSingleExerciseSet(set.id);
                           }
                        } else if (set.hasOwnProperty('newset')) {
                           await routineModel.addSingleExerciseSet(set.weight, set.reps, exercise.id);
                        };
                     });
                  }
                  //Update Existing sets.
                  await routineModel.updateExerciseSets(exercise, day);
               });
            }
         })
      }

      // If we get all the way to the bottom send success
      res.json({ update_status: true })
   } catch (err) {
      // error down the line
      res.json({ update_status: false })
   }
});

router.post('/routine/add_routine', requireLogin, async (req, res) => {
   const { days, routine_name, todays_date } = req.body;
   const user_id = req.session.users.user_id;

   const routineModel = new pplSystemModel(null, routine_name, null, todays_date, user_id)
   const checkIfRoutineAlreadyCreated = await routineModel.getRoutineInfo();

   if (checkIfRoutineAlreadyCreated === undefined) {
      // No duplicate routine name, move forward.
      const addRoutine = await routineModel.createRoutine();
      const getRoutineInfo = await routineModel.getRoutineInfo();
      if (addRoutine.rowCount === 1) {
         const addingRoutineModel = new pplSystemModel(getRoutineInfo.id, getRoutineInfo.routine_name, days, getRoutineInfo.date_started, user_id);
         try {
            // add all days
            const addDays = await addingRoutineModel.addRoutineDays(days);

            if (addDays.rowCount >= 1) {
               // add exercises
               days.forEach(async day => {
                  if (!day.rest_day) {
                     const addExercises = await addingRoutineModel.addExercises(day);
                     if (addExercises.rowCount >= 1) {
                        // add sets
                        day.exercises.map(exercise => {
                           addingRoutineModel.addExerciseSets(exercise, day);
                        });
                     }
                  }
               });
            }
            // No failures, we successfully added a routine.
            res.json({ routine_added: true });
         } catch (err) {
            // Error Code: 2 Routine insert failures.
            res.json({ routine_added: false, error_code: 2 });
         }
      } else {
         // Error Code: 3 Insert Routine Name issue
         res.json({ routine_added: false, error_code: 3 });
      }
   } else {
      // Error Code: 1 Routine with the same name has already been created
      res.json({ routine_added: false, error_code: 1 })
   }
});

router.post('/routine/finish_workout', requireLogin, async (req, res) => {
   const { workout, workout_date } = req.body;
   const addSets = await pplSystemModel.finishWorkout(workout.exercises, workout_date);
   addSets.rowCount > 0 ? res.json({ completed_workout: true }) : res.json({ completed_workout: false });
});

router.get('/track/:routine?', requireLogin, async (req, res) => {
   const { routine } = req.params;
   const user_id = req.session.users.user_id;
   const getTrackedRoutine = await pplSystemModel.getTrackedRoutine(routine, user_id);

   getTrackedRoutine === undefined ? res.json({ routine_found: false }) : res.json({ routine_found: true, routine: getTrackedRoutine[0].json_agg[0] })
});
module.exports = router;