const express = require('express'),
   router = express.Router(),
   bcrypt = require('bcryptjs'),
   SALT_ROUNDS = 10,
   UsersModel = require('../models/users');

/* 
  Error Codes:

  0 = Success
  1 = No User Found
  2 = Password Incorrect
  3 = User Already Created
  4 = Database Error
*/

router.get('/loginStatus', async (req, res) => {
   if (req.session.hasOwnProperty('users')) {
      (req.session.users.is_logged_in === true) ? res.json({ is_logged_in: req.session.users.is_logged_in }) : res.json({ is_logged_in: false })
   } else {
      res.json({ is_logged_in: false })
   }
});

router.get('/logout', async (req, res) => {
   req.session.expires = new Date(Date.now() - 1000000000000);
   req.session.maxAge = 1;

   await req.session.destroy();
   await res.clearCookie();

   res.json({
      is_logged_in: false
   })
});

router.post('/login', async (req, res, next) => {
   const { email, password } = req.body
   const checkUser = await UsersModel.checkUser(email);

   if (checkUser.rowCount === 1) {
      const user = checkUser.rows[0];
      const comparePassword = await bcrypt.compare(password, user.password);
      // If the password matches
      if (!!comparePassword) {
         var hour = 3600000;
         req.session.users = {
            is_logged_in: true,
            first_name: user.first_name,
            last_name: user.last_name,
            user_id: user.id,
            expires: new Date(Date.now() + hour),
            maxAge: hour
         }

         await req.session.save(function (err) {
            res.json({
               errorCode: 0,
               is_logged_in: req.session.users.is_logged_in,
               first_name: user.first_name,
               last_name: user.last_name,
               email: user.email
            });
         });
         console.log(req.session)
      } else {
         res.json({
            errorCode: 2
         })
      }
   } else {
      res.json({
         errorCode: 1
      })
   }
});

router.post('/register', async (req, res) => {
   const { firstName, lastName, email, password } = req.body;
   console.log(req.body)
   const user = new UsersModel(null, firstName, lastName, email, null);
   const checkUser = await UsersModel.checkUser(email);

   if (checkUser.rowCount === 0) {
      const hashedPW = await bcrypt.hash(password, SALT_ROUNDS);
      const addUser = await user.addUser(hashedPW);
      if (addUser.rowCount === 1) {
         //Successfully added user
         res.json({ errorCode: 0 })
      } else {
         //Failed To add User
         res.json({ errorCode: 2 })
      }
   } else {
      //User is already in the system
      res.json({ errorCode: 1 })
   }
})

module.exports = router;