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
   const getFullRoutine = await pplSystemModel.getFullRoutine(routine_name, user_id);
   const routineInfo = getFullRoutine[0].json_agg[0];

   if (routineInfo.routine_name !== routine_name) {
      console.log('we need to change')
   } else {
      console.log('no change needed')
   }

   // // Updare Routine Name.
   // const updateRoutine = await routineModel.updateRoutineName();

   // if(updateRoutine.rowCount === 1){

   // } else {
   //    console.log('err update')
   // }
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
            let addDays = await addingRoutineModel.addRoutineDays(days);

            if (addDays.rowCount >= 1) {
               // add exercises
               days.forEach(async day => {
                  let addExercises = await addingRoutineModel.addExercises(day);
                  if (!day.hasOwnProperty('rest_day') && addExercises.rowCount >= 1) {
                     // add sets
                     day.exercises.map(exercise => {
                        addingRoutineModel.addExerciseSets(exercise, day);
                     });
                  }
               })
            }
            // No failures, we successfully added a routine.
            res.json({ routine_added: true })
         } catch (err) {
            // Error Code: 2 Routine insert failures.
            res.json({ routine_added: false, error_code: 2 })
         }
      } else {
         // Error Code: 3 Insert Routine Name issue
         res.json({ routine_added: false, error_code: 3 })
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

module.exports = router;