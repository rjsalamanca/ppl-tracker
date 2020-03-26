const express = require('express'),
   router = express.Router(),
   moment = require('moment'),
   pplSystemModel = require('../models/ppl_system');

router.get('/routine', async (req, res) => {
   const user_id = req.session.user_id;
   const anyRoutine = await pplSystemModel.checkAnyRoutine(user_id);
   anyRoutine.rowCount === 0 ? res.json({ routine_found: false }) : res.json({ routine_found: true, routines: anyRoutine.rows })
});

router.post('/routine/currentDay', async (req, res) => {
   const user_id = req.session.user_id;
   const { date } = req.body;
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
         return curr_day_ind >= 0 ? { routine_name: workout.routine_name, current_workout: workout.days[curr_day_ind] } : { routine_name: workout.routine_name, current_workout: workout.days[0] }
      })
      res.json({ todays_workout: getWorkoutByDay });
   } else {
      res.json({ todays_workout: false });
   }
});

// router.post('/create_routine', async (req, res) => {
//    const { routine_name, todays_date } = req.body;
//    const user_id = req.session.user_id;
//    const routineModel = new pplSystemModel(null, routine_name, null, todays_date, user_id)
//    const checkIfRoutineAlreadyCreated = await routineModel.getRoutineInfo()

//    if (checkIfRoutineAlreadyCreated === undefined) {
//       const addRoutine = await routineModel.createRoutine();
//       const getRoutineInfo = await routineModel.getRoutineInfo();
//       addRoutine.rowCount === 1 ? res.json({ routine_added: true, routine_info: getRoutineInfo }) : res.json({ routine_added: false });
//    } else {
//       // Error Code 
//       // 1 = Already Created
//       res.json({ routine_added: false, error_code: 1 })
//    }
// });

router.get('/get_full_routine/:routine?', async (req, res) => {
   const { routine } = req.params;
   const user_id = req.session.user_id;
   const getFullRoutine = await pplSystemModel.getFullRoutine(routine, user_id);
   getFullRoutine[0].json_agg === null ? res.json({ routine_found: false }) : res.json({ routine_found: true, routine: getFullRoutine[0].json_agg[0] });
});

router.post('/routine/add_routine', async (req, res) => {
   const { days, routine_name, todays_date } = req.body;
   const user_id = req.session.user_id;

   const routineModel = new pplSystemModel(null, routine_name, null, todays_date, user_id)
   const checkIfRoutineAlreadyCreated = await routineModel.getRoutineInfo();

   if (checkIfRoutineAlreadyCreated === undefined) {
      // No duplicate routine name, move forward.
      const addRoutine = await routineModel.createRoutine();
      const getRoutineInfo = await routineModel.getRoutineInfo();
      if (addRoutine.rowCount === 1) {
         const addingRoutineModel = new pplSystemModel(getRoutineInfo.id, getRoutineInfo.routine_name, days, getRoutineInfo.date_started, user_id);
         try {
            days.forEach(async (day) => {
               let addDay = await addingRoutineModel.addRoutineDay(day);
               if (addDay.rowCount >= 1) {
                  day.exercises.forEach(async (exercise) => {
                     let addExercise = await addingRoutineModel.addExercise(day, exercise);
                     if (addExercise.rowCount >= 1) {
                        exercise.sets.forEach(async (set, idx) => {
                           await addingRoutineModel.addExerciseSet(exercise, (idx + 1), set, day);
                        })
                     }
                  })
               }
            });
            // No failures, we successfully added a routine.
            res.json({ routine_added: true })
         } catch (err) {
            // Error Code: 2 Routine insert failures.
            res.json({ routine_added: false, error_code: 2 })
         }
      } else {
         res.json({ routine_added: false })
      }

   } else {
      // Error Code: 1 Routine with the same name has already been created
      res.json({ routine_added: false, error_code: 1 })
   }
});

router.post('/routine/finish_workout', async (req, res) => {
   const { workout, workout_date } = req.body;
   const addSets = await pplSystemModel.finishWorkout(workout.exercises, workout_date);
   addSets.rowCount > 0 ? res.json({ completed_workout: true }) : res.json({ completed_workout: false });
});

module.exports = router;