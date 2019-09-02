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
  console.log('IN login status: ', req.session);
  (req.session.is_logged_in === true) ? res.json({ is_logged_in: req.session.is_logged_in }) : res.json({ is_logged_in: false })
});

router.get('/logout', async (req, res) => {
  req.session.destroy();
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
      req.session.is_logged_in = true;
      req.session.first_name = user.first_name;
      req.session.last_name = user.last_name;
      req.session.id = user.id;
      req.session.expires = new Date(Date.now() + hour);
      req.session.maxAge = hour;
      req.session.save();

      res.json({
        errorCode: 0,
        is_logged_in: req.session.is_logged_in,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      });

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
  const { first_name, last_name, email, password } = req.body;
  const user = new UsersModel(null, first_name, last_name, email, null);
  console.log('bruh where are u: ', email)
  const checkUser = await UsersModel.checkUser(email);

  if (checkUser.rowCount === 0) {
    const hashedPW = await bcrypt.hash(password, SALT_ROUNDS);
    const addUser = await user.addUser(hashedPW);
    if (addUser.rowCount === 1) {
      //Successfully added user
      res.json({ errorCode: 0 })
    } else {
      //Failed To add User
      res.json({ errorCode: 4 })
    }
  } else {
    res.json({ errorCode: 3 })
  }
})

module.exports = router;