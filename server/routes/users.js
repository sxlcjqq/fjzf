var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/example', function(req, res, next) {
  // res.send('respond with a resource');
  res.json({
    code: '-200',
    msg: '操作失败'
  });
});

module.exports = router;
