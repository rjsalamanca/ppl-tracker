const db = require('./conn.js');

class Users {
    constructor(id, first_name, last_name, email, password) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }

    static async checkUser(email) {
        try {
            const response = db.result(`
                SELECT * FROM users
                WHERE email = $1
            `, [email]);

            return response;
        } catch (err) {
            return err.message;
        }
    }

    static async getUser(email, password) {

    }
}

module.exports = Users;