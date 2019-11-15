const express = require('express'),
    router = express.Router(),
    pplSystemModel = require('../models/ppl_system');

router.get('/routine', async (req, res) => {
    console.log('bruh in ppl system/routine')
    // const user_id = req.session.user_id;
    // const anyRoutine = await pplSystemModel.checkAnyRoutine(user_id);
    // console.log('testing')
    res.json({ routine_found: false, bruh: 'bruh' })
    //anyRoutine.rowCount === 0 ? res.json({ routine_found: false }) : res.json({ routine_found: true, routines: anyRoutine.rows })
});

router.post('/create_routine', async (req, res) => {

    const { routine_name, todays_date } = req.body;
    const user_id = req.session.user_id;
    const routineModel = new pplSystemModel(null, routine_name, todays_date, user_id)
    await routineModel.createRoutine();
});

module.exports = router;