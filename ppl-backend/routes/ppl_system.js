const express = require('express'),
    router = express.Router(),
    pplSystemModel = require('../models/ppl_system');

router.post('/routine', async (req, res) => {
    const { user_id } = req.body;
    const anyRoutine = await pplSystemModel.checkAnyRoutine(user_id)

    anyRoutine.rowCount === 0 ? res.json({ routine_found: false }) : res.json({ routine_found: true })
});

module.exports = router;