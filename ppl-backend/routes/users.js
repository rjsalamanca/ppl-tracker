const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcryptjs'),
  SALT_ROUNDS = 10,
  UsersModel = require('../models/users');

/* 
  Error Codes:
  1 = No User Found
  2 = Password Incorrect 
*/

router.post('/loginStatus', async (req, res) => {
  if (req.session.is_logged_in !== true)
    res.json({
      is_logged_in: req.session.is_logged_in
    })
});

router.post('/logout', async (req, res) => {
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
      req.session.is_logged_in = true;
      req.session.first_name = user.first_name;
      req.session.last_name = user.last_name;
      req.session.id = user.id;

      res.json({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      })
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

router.post('/register, asy')

module.exports = router;