const db = require('./conn.js');

class PPL_System {
    constructor(routine_id, routine_name, days, date_started, user_id) {
        this.routine_id = routine_id,
            this.routine_name = routine_name,
            this.days = days,
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

    async getRoutineInfo() {
        try {
            const response = await db.one(`
                 SELECT * FROM routine WHERE user_id = $1 AND routine_name = $2
            `, [this.user_id, this.routine_name])
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async getRoutineDayInfo(day) {
        try {
            const response = await db.result(`
                 SELECT * FROM routine_day WHERE day_name = $1 AND routine_id = $2
            `, [day.name, this.routine_id])
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async getExerciseInfo() {
        try {
            const response = await db.result(`
                 SELECT * FROM routine WHERE user_id = $1 AND routine_name = $2
            `, [this.user_id, this.routine_name]);
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async getExerciseSetInfo() {
        try {
            const response = await db.one(`
                 SELECT * FROM routine WHERE user_id = $1 AND routine_name = $2
            `, [this.user_id, this.routine_name])
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async createRoutine() {
        try {
            const response = await db.result(`
                INSERT INTO routine (routine_name, date_started, user_id)
                VALUES($1,$2,$3)
            `, [this.routine_name, this.date_started, this.user_id])
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async addRoutineDay(day) {
        try {
            const response = await db.result(`
                INSERT INTO routine_day (day_name, routine_id, routine_date)
                VALUES($1,$2,$3)
            `, [day.name, this.routine_id, this.routine_date]);
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    static async addExercises(exercise) {
        try {
            const response = await db.result(`
                INSERT INTO exercises (exercise_name, reps, routine_day_id)
                VALUES($1,$2,$3)
            `, [day.name, this.routine_id, this.routine_date]);
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    static async addExerciseSets() {
        try {
            const response = await db.result(`
                `)

            return response;
        } catch (err) {
            return err.msg;
        }
    }
}

module.exports = PPL_System;