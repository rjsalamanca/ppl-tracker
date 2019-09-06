const db = require('./conn.js');

class PPL_System {
    constructor(routine_id, routine_name, date_started, user_id) {
        this.routine_id = routine_id,
            this.routine_name = routine_name,
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
}

module.exports = PPL_System;