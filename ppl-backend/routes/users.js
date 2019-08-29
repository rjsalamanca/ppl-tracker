var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
  res.json({
    test: 1
  })
});

module.exports = router;