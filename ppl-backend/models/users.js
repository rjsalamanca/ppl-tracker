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
      // console.log(db);
      // let test = db.connect();
      // console.log(await db.connect());
      // const response = await db.result(`
      //        SELECT * FROM users
      //        WHERE email = $1
      //        `, [email]).then(uh => console.log(uh));
      // return db.result(`
      //        SELECT * FROM users
      //         WHERE email = $1
      //         `, [email]).then(uh => console.log(uh));
      // console.log(responsse);
      try {
         const response = await db.result(` SELECT * FROM users WHERE email = $1`, [email]);
         return response;
      } catch (err) {
         return err.message;
      }


      // try {
      //    const response = await db.query(`
      //       SELECT * FROM users
      //       WHERE email = $1
      //       `, [email]);

      //    console.log(response)
      //    return response;
      // } catch (err) {
      //    console.log('hi2')
      //    return err.message;
      // }
   }

   async addUser(hashedPW) {
      console.log('hi3')

      try {
         const response = await db.result(`
            INSERT INTO users (first_name, last_name, email, password)
            VALUES($1,$2,$3,$4)
            `, [this.first_name, this.last_name, this.email, hashedPW])

         return response;
      } catch (err) {
         console.log('hi4')

         return err.message;
      }
   }
}

module.exports = Users;