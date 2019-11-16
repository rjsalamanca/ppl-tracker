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
    const routineModel = new pplSystemModel(null, routine_name, todays_date, user_id)
    const addRoutine = await routineModel.createRoutine();

    addRoutine.rowCount === 1 ? res.json({ routine_added: true }) : res.json({ routine_added: false });
});

router.post('/routine/add_exercises', async (req, res) => {
    console.log('test')
});


module.exports = router;