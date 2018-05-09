var express = require('express');
var router = express.Router();
var user = require('../database/db').user;
//生成uuid
var uuid = require('node-uuid');
//获取当前时间
var nowdate = new Date().getTime();

//md5加密
var crypto = require('crypto');
function md5Encrypt(encryptString) {
    var md5=crypto.createHash("md5");
    md5.update(encryptString);
    var str=md5.digest('hex');
    return str;
}
/* GET home page. */
router.get('/', function(req, res) {

  req.session.destroy(function(err){
      if(err) console.log("session销毁失败.");
      else {
        console.log("session被销毁.");
      }
   });
    res.render('index', { title: 'index' });
});

/* login */
router.get('/login', function(req, res) {
    res.render('login', { title: 'login' });
});
/* login */
router.get('/register', function(req, res) {
    res.render('register', { title: 'register' });
});
/* login */
router.get('/List', function(req, res) {
    res.render('List', { title: 'register' });
});
/* users */
router.get('/users', function(req, res) {
    res.render('users', { title: 'users' });
});

/* 登陆 */
router.post('/lotoList', function(req, res) {
    var query = {name: req.body.name, password: md5Encrypt(req.body.password)};
    (function(){
        user.find(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
            if(doc.length == 1){
                console.log(query.name + ": 登陆成功 " + new Date());
                req.session.user=req.body.name;
                req.session.userid=doc[0].userid;
                res.render('List', { title:'List' ,user:req.body.name});//这里如果直接写req.session.user。会报错
            }else{
                console.log(query.name + ": 登陆失败 " + new Date());
                res.redirect('/login?error');
            }
        });
    })(query);
});
// 注册
router.post('/retoList', function(req, res) {
    var query = {name: req.body.name};
    var id = uuid.v1();
    var registers = {'name': req.body.name,'password':md5Encrypt(req.body.password),'userid':id,'createTime':nowdate};
    (function(){
        user.count(query, function(err, doc){    //count返回集合中文档的数量，和 find 一样可以接收查询条件。query 表示查询的条件
            if(doc >= 1){
                console.log(query.name + ": 用户名已存在，请更换用户名！ " + new Date());
                res.redirect('/register?repeat');
            }else{
              var newUser = new user(registers);
              // update 和save详情查看 https://www.cnblogs.com/yu-zhang/p/5210966.html
              //1.2save命令
              // Mongodb另一个更新命令是save，格式如下：
              // db.collection.save(obj)
              // obj代表需要更新的对象，如果集合内部已经存在一个和obj相同的"_id"的记录，Mongodb会把obj对象替换集合内已存在的记录，如果不存在，则会插入obj对象。
              // 这条命令比较简单，示例就省略了。
              newUser.save(function (err){
                  req.session.user=req.body.name;
                  req.session.userid=id;
                  res.redirect('List', { title:'List' });
              });
              // (ObjectId)newUser.get( "_id" ); // 获取文档id--要试试可不可以
                // user.create(registers, function(err, doc){
                //     res.redirect('List', { title:'List' });
                // });
            }
        });

    })(query,registers);
});

module.exports = router;
