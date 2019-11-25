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
    const { days } = req.body;

});

module.exports = router;