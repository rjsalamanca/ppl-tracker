const express = require('express'),
    router = express.Router(),
    pplSystemModel = require('../models/ppl_system');

router.get('/routine', async (req, res) => {
    const user_id = req.session.user_id;
    const anyRoutine = await pplSystemModel.checkAnyRoutine(user_id);
    anyRoutine.rowCount === 0 ? res.json({ routine_found: false }) : res.json({ routine_found: true, routines: anyRoutine.rows })
});

router.post('/create_routine', async (req, res) => {
    const { routine_name, todays_date } = req.body;
    const user_id = req.session.user_id;
    const routineModel = new pplSystemModel(null, routine_name, null, todays_date, user_id)
    const checkIfRoutineAlreadyCreated = await routineModel.getRoutineInfo()

    if (checkIfRoutineAlreadyCreated === undefined) {
        const addRoutine = await routineModel.createRoutine();
        const getRoutineInfo = await routineModel.getRoutineInfo();
        addRoutine.rowCount === 1 ? res.json({ routine_added: true, routine_info: getRoutineInfo }) : res.json({ routine_added: false });
    } else {
        // Error Code 
        // 1 = Already Created
        res.json({ routine_added: false, error_code: 1 })
    }
});

router.post('/routine/add_routine', async (req, res) => {
    const { days, routine_info } = req.body;
    const user_id = req.session.user_id;

    //{ id: 12,
    //   routine_name: 'ppl',
    //   date_started: 'Nov 25 2019',
    //   user_id: 1 }

    // console.log(routine_info);
    //routine_id, routine_name, days, date_started, user_id
    const routine = new pplSystemModel(routine_info.id, routine_info.routine_name, null, routine_info.date_started, user_id)

    days.forEach(async (day) => {
        let addDay = await routine.addRoutineDay(day);

        if (addDay.rowCount === 1) {
            let getDayInfo = await routine.getRoutineDayInfo(day);
            console.log('test:', getDayInfo)

            // day.exercises.forEach((exercise) => {
            //     let addExercise = await routine.addExercise(exercise);

            // })
        } else {
            // fail
        }
    })
});

module.exports = router;