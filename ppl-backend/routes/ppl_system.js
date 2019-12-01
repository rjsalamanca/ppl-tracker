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

router.get('/get_full_routine/:routine?', async (req, res) => {
    const { routine } = req.params;
    const user_id = req.session.user_id;
    const getFullRoutine = await pplSystemModel.getFullRoutine(routine, user_id);
    let routineJson = {};
    console.log('bruh:', getFullRoutine)
    getFullRoutine.rows.forEach((ele, idx) => {
        if (idx === 0) {
            // Initial get, we need to format our JSON
            routineJson['user_id'] = ele.user_id;
            routineJson['routine_id'] = ele.routine_id;
            routineJson['routine_name'] = ele.routine_name;
            routineJson['routine_days'] = [];

            let temp = `{
                    "day_name": "${ele.day_name}",
                    "exercises": [{
                        "exercise_name": "${ele.exercise_name}",
                        "sets": [{
                            "set" : "${ele.sets}",
                            "weight" : "${ele.weight}",
                            "reps" : "${ele.reps}"
                        }]
                    }]
            }`;
            routineJson.routine_days.push(JSON.parse(temp))
        } else {
            // for (let i = 0; i < routineJson.routine_days.length; i++) {
            //     if (routineJson.routine_days[i].includes(ele.day_name)) {

            //     }
            // }
        }
    });

    console.log(routineJson)
});

router.post('/routine/add_routine', async (req, res) => {
    const { days, routine_info } = req.body;
    const user_id = req.session.user_id;

    const routine = new pplSystemModel(routine_info.id, routine_info.routine_name, days, routine_info.date_started, user_id);

    days.forEach(async (day) => {
        let addDay = await routine.addRoutineDay(day);

        if (addDay.rowCount >= 1) {
            day.exercises.forEach(async (exercise) => {
                let addExercise = await routine.addExercise(day, exercise);
                if (addExercise.rowCount >= 1) {
                    exercise.sets.forEach(async (set, idx) => {
                        let addSets = await routine.addExerciseSet(exercise, (idx + 1), set, day);
                        if (addSets.rowCount >= 1) {
                            // added 
                        } else {
                            // Fail wasn't added
                        }
                    })
                } else {
                    // Fail wasn't added
                }
            })
        } else {
            // Fail wasn't added
        }
    })
});

module.exports = router;