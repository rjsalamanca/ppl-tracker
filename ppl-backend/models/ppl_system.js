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

    static async getFullRoutine(routine_name, uid) {
        try {
            const response = await db.any(`
            SELECT users.id AS user_id,
                routine.id AS routine_id,routine.routine_name, 
                routine_day.day_name, routine_date,
                exercises.exercise_name,
                exercise_sets.weight,exercise_sets.sets,exercise_sets.reps
            FROM users
            INNER JOIN routine ON users.id = routine.user_id
            INNER JOIN routine_day ON routine.id = routine_day.routine_id
            INNER JOIN exercises ON exercises.routine_day_id = routine_day.id
            INNER JOIN exercise_sets ON exercise_sets.exercise_id = exercises.id
            WHERE users.id = $1 AND routine.user_id = $1 AND routine.routine_name = $2
            ORDER BY routine_day.id`, [uid, routine_name]);
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
            console.log(`before select: ${day.name} ${this.routine.id}`)
            const response = await db.result(`
                 SELECT * FROM routine_day WHERE day_name = $1 AND routine_id = $2
                `, [day.name, this.routine_id]);
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async getExerciseInfo(exercise, routineDayId) {
        try {
            const response = await db.result(`
                 SELECT * FROM exercises WHERE exercise_name = $1 AND routine_day_id = $2
                `, [exercise.name, routineDayId]);
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
                INSERT INTO routine(routine_name, date_started, user_id)
                VALUES($1, $2, $3)
                    `, [this.routine_name, this.date_started, this.user_id])
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async addRoutineDay(day) {
        try {
            const response = await db.result(`
                INSERT INTO routine_day(day_name, routine_id, routine_date)
                VALUES($1, $2, $3)
                    `, [day.name, this.routine_id, this.routine_date]);
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async addExercise(day, exercise) {
        try {
            const response = await db.result(`
                INSERT INTO exercises(exercise_name, routine_day_id)
                VALUES($1, (SELECT id from routine_day WHERE day_name = $2 AND routine_id = $3))
            `, [exercise.name, day.name, this.routine_id]);
            return response;
        } catch (err) {
            return err.msg;
        }
    }

    async addExerciseSet(exercise, set, set_info, day) {
        try {
            const response = await db.result(`
                INSERT INTO exercise_sets(weight, sets, reps, exercise_id)
                VALUES($1, $2, $3, 
                    (SELECT id from exercises WHERE exercise_name = $4 AND routine_day_id = 
                        (SELECT id from routine_day WHERE day_name = $5 AND routine_id = $6)))
            `, [parseInt(set_info.weight), set, 10, exercise.name, day.name, this.routine_id]);

            return response;
        } catch (err) {
            return err.msg;
        }
    }
}

module.exports = PPL_System;