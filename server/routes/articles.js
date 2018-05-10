var express = require('express');
var router = express.Router();
var user = require('../database/db').user;
let fs = require('fs');
let path = require('path');
//获取当前时间
var nowdate = new Date().getTime();

// see https://github.com/expressjs/body-parser
// 添加 body-parser 中间件就可以了
// 响应一个JSON数据
// 以json形式，把操作结果返回给前台页面
var responseJSON = function(res, ret) {
  if(typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
}

//md5加密
var crypto = require('crypto');
function md5Encrypt(encryptString) {
    var md5=crypto.createHash("md5");
    md5.update(encryptString);
    var str=md5.digest('hex');
    return str;
}

/* 退出登录. */
router.get('/loginout', function(req, res) {
  req.session.destroy(function(err){
      if(err) console.log("session销毁失败.");
      else {
        console.log("session被销毁.");
      }
   });
});

/* 登陆 */
router.post('/login', function(req, res) {
  var query = {username: req.body.username, password: md5Encrypt(req.body.password)};
  (function(){
    user.find(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
      if(!err){
        if(doc.length == 1){
            console.log(query.name + ": 登陆成功 " + new Date());
            req.session.user=req.body.name;
            req.session.userid=doc[0]._id;
            responseJSON(res, {
      				code: '200',
      				msg: '登陆成功～'
      			});
        }else{
          var newUser = new user(query);
          newUser.save(function (err){
            if(!err){
              console.log(query.name + ": 注册并登陆成功 " + new Date());
              req.session.user=req.body.name;
              req.session.userid=(ObjectId)newUser.get( "_id" );

              responseJSON(res, {
        				code: '201',
        				msg: '注册并登陆成功～'
        			});
            }else{
              responseJSON(res, {
                code: '402',
                msg: '注册并登陆失败～'
              });
            }
          });
        }
      }else{
        responseJSON(res, {
          code: '401',
          msg: '登陆失败～'
        });
      }
    });
  })(query);
});
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
