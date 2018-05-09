var express = require('express');
var router = express.Router();
let fs = require('fs');
let path = require('path');

/* GET users listing. */
router.get('/example', function(req, res, next) {
  // res.send('respond with a resource');
  res.json({
    code: '200',
    msg: '测试成功！'
  });
});
router.post('/savehtml', function(req, res) {
  // var query = {value: req.body.value};
  fs.open('public/data/sql.txt','a+',function(err,fd){
    if (err) {
      res.json({
        code: '200',
        msg: '打开失败！'
      });
    } else {
      fs.writeFileSync('public/data/sql.txt',req.body.value,function(err2){
          if (err2) {
            // 关闭文件
           fs.close(fd, function(err3){
              if (err3){
                 console.log(err3);
              }
              console.log("文件关闭成功");
           });
            res.json({
              code: '200',
              msg: '写入失败！'
            });
          } else {
            res.json({
              code: '200',
              msg: '写入成功！'
            });
          }
      })
    }
  })
  res.json({
    code: '200',
    msg: '保存成功！'
  });
});

module.exports = router;
